#!/usr/bin/env python3
"""
録画＋録音 → 文字起こし → ブログ生成 → Qiita下書き投稿
使い方: python record_blog.py
"""

import base64
import os
import subprocess
import sys
import time
import webbrowser
from datetime import datetime
from pathlib import Path

import anthropic
import requests
import whisper
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.environ["ANTHROPIC_API_KEY"]
QIITA_TOKEN = os.environ["QIITA_TOKEN"]

RECORDINGS_DIR = Path(__file__).parent / "recordings"
RECORDINGS_DIR.mkdir(exist_ok=True)

WHISPER_MODEL = "small"  # tiny/base/small/medium — smallが精度と速度のバランス良好
FRAME_INTERVAL = 60       # スクリーンショット取得間隔（秒）
MAX_FRAMES = 6            # Claude に渡す最大枚数


# ── デバイス確認・自動検出 ────────────────────────────────────────────────────
def list_devices() -> str:
    result = subprocess.run(
        ["ffmpeg", "-f", "avfoundation", "-list_devices", "true", "-i", ""],
        capture_output=True, text=True,
    )
    return result.stderr


def _parse_devices() -> tuple[list[tuple[str, str]], list[tuple[str, str]]]:
    """ビデオ・オーディオのデバイス一覧を (index, name) のリストで返す"""
    import re
    raw = list_devices()
    videos, audios = [], []
    in_audio = False
    for line in raw.splitlines():
        if "AVFoundation audio devices" in line:
            in_audio = True
            continue
        # 行末の "[idx] デバイス名" 部分だけ取り出す
        tail = line.split("] ", 1)[-1] if "] " in line else ""
        m = re.search(r"\[(\d+)\]\s+(.+)", tail)
        if not m:
            continue
        idx, name = m.group(1), m.group(2).strip()
        (audios if in_audio else videos).append((idx, name))
    return videos, audios


def detect_devices() -> tuple[str, str]:
    """画面キャプチャデバイスとマイクのインデックスを自動検出する"""
    videos, audios = _parse_devices()

    # スクリーン: "Capture screen" を探す
    screen_idx = next((idx for idx, name in videos if "Capture screen" in name), "1")

    # マイク優先順位: MacBook内蔵 > Built-in > その他のマイク
    audio_idx = audios[0][0] if audios else "0"
    for idx, name in audios:
        if any(k in name for k in ["MacBook", "内蔵", "Built-in"]):
            audio_idx = idx
            break

    return screen_idx, audio_idx


def show_devices() -> None:
    """デバイス一覧を見やすく表示"""
    videos, audios = _parse_devices()
    print("  [ビデオデバイス]")
    for idx, name in videos:
        tag = " ← 画面録画" if "Capture screen" in name else ""
        print(f"    [{idx}] {name}{tag}")
    print("  [オーディオデバイス]")
    for idx, name in audios:
        tag = " ← 内蔵マイク" if any(k in name for k in ["MacBook", "内蔵", "Built-in"]) else ""
        print(f"    [{idx}] {name}{tag}")


# ── 録画 ──────────────────────────────────────────────────────────────────────
def start_recording(output_path: Path, screen_idx: str, audio_idx: str) -> subprocess.Popen:
    cmd = [
        "ffmpeg",
        "-f", "avfoundation",
        "-capture_cursor", "1",
        "-framerate", "30",
        "-i", f"{screen_idx}:{audio_idx}",
        "-c:v", "libx264",
        "-preset", "ultrafast",
        "-crf", "28",
        "-c:a", "aac",
        "-b:a", "128k",
        str(output_path),
        "-y",
    ]
    return subprocess.Popen(
        cmd,
        stdin=subprocess.PIPE,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def start_recording_screen_only(output_path: Path, screen_idx: str) -> subprocess.Popen:
    cmd = [
        "ffmpeg",
        "-f", "avfoundation",
        "-capture_cursor", "1",
        "-framerate", "30",
        "-i", f"{screen_idx}:",
        "-c:v", "libx264",
        "-preset", "ultrafast",
        "-crf", "28",
        str(output_path),
        "-y",
    ]
    return subprocess.Popen(
        cmd,
        stdin=subprocess.PIPE,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def stop_recording(proc: subprocess.Popen) -> None:
    try:
        proc.stdin.write(b"q")
        proc.stdin.flush()
    except BrokenPipeError:
        pass
    proc.wait(timeout=10)


# ── 音声トラック確認 ──────────────────────────────────────────────────────────
def has_audio_track(video_path: Path) -> bool:
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "a",
         "-show_entries", "stream=codec_type", "-of", "csv=p=0", str(video_path)],
        capture_output=True, text=True,
    )
    return "audio" in result.stdout


# ── 音声抽出 ──────────────────────────────────────────────────────────────────
def extract_audio(video_path: Path, audio_path: Path) -> bool:
    if not has_audio_track(video_path):
        return False
    result = subprocess.run(
        [
            "ffmpeg", "-i", str(video_path),
            "-vn", "-acodec", "pcm_s16le",
            "-ar", "16000", "-ac", "1",
            str(audio_path), "-y",
        ],
        capture_output=True,
    )
    return result.returncode == 0


# ── 動画の長さ取得 ────────────────────────────────────────────────────────────
def get_duration(video_path: Path) -> float:
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(video_path)],
        capture_output=True, text=True,
    )
    try:
        return float(result.stdout.strip())
    except ValueError:
        return 0.0


# ── フレーム抽出 ──────────────────────────────────────────────────────────────
def extract_frames(video_path: Path, frames_dir: Path) -> list[Path]:
    frames_dir.mkdir(exist_ok=True)

    duration = get_duration(video_path)
    # 動画の長さに合わせて間隔を自動計算（最低1枚は必ず取得）
    n_frames = min(MAX_FRAMES, max(1, int(duration / FRAME_INTERVAL)))
    interval = max(1, duration / n_frames)

    subprocess.run(
        [
            "ffmpeg", "-i", str(video_path),
            "-vf", f"fps=1/{interval:.1f},scale=1280:-1",
            str(frames_dir / "frame_%04d.jpg"),
            "-y",
        ],
        capture_output=True,
    )
    return sorted(frames_dir.glob("frame_*.jpg"))


# ── 文字起こし ────────────────────────────────────────────────────────────────
def transcribe(audio_path: Path) -> str:
    print(f"      Whisper（{WHISPER_MODEL}）をロード中... 初回はモデルDLで数分かかります")
    model = whisper.load_model(WHISPER_MODEL)
    print("      文字起こし中...")
    result = model.transcribe(str(audio_path), language="ja", fp16=False)
    return result["text"].strip()


# ── ブログ生成 ────────────────────────────────────────────────────────────────
def encode_image(path: Path) -> str:
    return base64.standard_b64encode(path.read_bytes()).decode("utf-8")


def generate_blog(transcript: str, frames: list[Path]) -> tuple[str, str]:
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    # 画像＋ラベルを交互に並べる
    content: list = []
    for i, frame in enumerate(frames):
        content.append({
            "type": "image",
            "source": {
                "type": "base64",
                "media_type": "image/jpeg",
                "data": encode_image(frame),
            },
        })
        content.append({
            "type": "text",
            "text": f"[操作画面 {i + 1}/{len(frames)}]",
        })

    prompt = f"""あなたはAWSを実際に手を動かして学んでいる初心者エンジニアです。
以下の「操作中のスクリーンショット」と「作業中の音声文字起こし」をもとに、AWS学習ブログ記事を書いてください。

【音声文字起こし（作業中の生の声）】
{transcript if transcript else "（音声なし）"}

【条件】
- 文字数：1000〜1500字（本文のみ）
- 文体：勉強日記風（「今日やったのは〜」「ここで詰まった！」「なるほど、こういう仕組みか」「意外とハマったポイント」）と解説記事風（概念説明・操作手順・注意点）を自然にミックス
- 音声から「詰まった箇所」「気づき」「疑問」を積極的に拾って、読者が共感できる内容にする
- スクリーンショットの画面内容を参考に、具体的な操作手順や画面の説明を盛り込む
- Markdown形式、見出し（##）を2〜3個、最後に「## まとめ」
- 1行目は「# 【AWS実践】」で始まる具体的なタイトル"""

    content.append({"type": "text", "text": prompt})

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        messages=[{"role": "user", "content": content}],
    )

    text = message.content[0].text.strip()
    lines = text.split("\n")
    title = lines[0].lstrip("#").strip()
    body = "\n".join(lines[1:]).strip()
    return title, body


# ── ローカル保存（Qiita投稿失敗時のバックアップ）────────────────────────────
def save_locally(title: str, body: str, ts: str) -> Path:
    md_path = RECORDINGS_DIR / f"blog_{ts}.md"
    md_path.write_text(f"# {title}\n\n{body}\n", encoding="utf-8")
    return md_path


# ── Qiita投稿 ─────────────────────────────────────────────────────────────────
def post_to_qiita(title: str, body: str) -> str:
    headers = {
        "Authorization": f"Bearer {QIITA_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "title": title,
        "body": body,
        "private": True,
        "tags": [{"name": "AWS"}, {"name": "初心者"}, {"name": "クラウド"}],
    }
    response = requests.post(
        "https://qiita.com/api/v2/items",
        json=payload,
        headers=headers,
        timeout=30,
    )
    response.raise_for_status()
    return response.json()["url"]


# ── クリーンアップ ────────────────────────────────────────────────────────────
def cleanup(audio_path: Path, frames_dir: Path) -> None:
    audio_path.unlink(missing_ok=True)
    if frames_dir.exists():
        for f in frames_dir.glob("*"):
            f.unlink()
        frames_dir.rmdir()


# ── メイン ────────────────────────────────────────────────────────────────────
def main() -> None:
    print("=" * 54)
    print("  AWS録画ブログ生成ツール")
    print("  録画 → 文字起こし → ブログ生成 → Qiita下書き")
    print("=" * 54)
    print()

    # デバイス一覧表示＋自動検出
    print("【利用可能なデバイス一覧】")
    show_devices()
    print()

    auto_screen, auto_audio = detect_devices()
    print(f"自動検出 → スクリーン: [{auto_screen}]  マイク: [{auto_audio}]")
    print("そのままEnterでOK。変更したい場合は番号を入力してください。")
    print("マイク不要の場合は 'none' と入力。")
    print()

    s = input(f"スクリーン番号 [デフォルト: {auto_screen}]: ").strip()
    screen_idx = s or auto_screen

    a = input(f"マイク番号   [デフォルト: {auto_audio} / 不要なら none]: ").strip()
    audio_idx = (a or auto_audio) if (a or auto_audio) != "none" else "none"
    print()

    # ファイルパス準備
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    video_path = RECORDINGS_DIR / f"recording_{ts}.mp4"
    audio_path = RECORDINGS_DIR / f"audio_{ts}.wav"
    frames_dir = RECORDINGS_DIR / f"frames_{ts}"

    # 録画開始（caffeinate でディスプレイスリープを防止）
    print("録画を開始します。AWS操作をしながら声で解説してください。")
    print("（詰まったこと・気づき・疑問をどんどん話しかけてOKです）")
    print()
    print(">>> 終了するには Enter キーを押してください <<<")
    print()

    caffeinate = subprocess.Popen(["caffeinate", "-d"])  # 録画中はディスプレイOFFを防ぐ

    if audio_idx == "none":
        proc = start_recording_screen_only(video_path, screen_idx)
    else:
        proc = start_recording(video_path, screen_idx, audio_idx)
    start_time = time.time()

    try:
        input()
    except KeyboardInterrupt:
        pass
    finally:
        caffeinate.terminate()  # caffeinate を必ず終了

    elapsed = int(time.time() - start_time)
    print(f"\n録画停止（{elapsed // 60}分{elapsed % 60}秒）")

    stop_recording(proc)

    if elapsed < 5:
        print("録画が短すぎます（5秒未満）。終了します。")
        video_path.unlink(missing_ok=True)
        sys.exit(1)

    print()

    try:
        # 音声抽出
        print("[1/4] 音声を抽出中...")
        audio_ok = extract_audio(video_path, audio_path)
        print("      完了" if audio_ok else "      音声なし → スクリーンショットのみで生成します")

        # フレーム抽出
        print(f"[2/4] スクリーンショットを抽出中...")
        frames = extract_frames(video_path, frames_dir)
        print(f"      {len(frames)}枚取得")

        # 文字起こし
        transcript = ""
        if audio_ok and audio_path.exists():
            print("[3/4] 音声を文字起こし中（Whisper）...")
            transcript = transcribe(audio_path)
            print(f"      {len(transcript)}字")
            if transcript:
                preview = transcript[:100] + ("..." if len(transcript) > 100 else "")
                print(f"      プレビュー: {preview}")
        else:
            print("[3/4] 文字起こし スキップ（音声なし）")

        # ブログ生成
        print("[4/4] ブログ記事を生成中（Claude + スクリーンショット）...")
        title, body = generate_blog(transcript, frames)
        print(f"      タイトル: {title}")
        print(f"      文字数  : {len(body)}字")

        # ローカルに必ず保存（バックアップ）
        md_path = save_locally(title, body, ts)
        print(f"      ローカル保存: {md_path.name}")

        # Qiita投稿
        print("Qiitaに下書き保存中...")
        qiita_result = ""
        try:
            qiita_result = post_to_qiita(title, body)
            print(f"      完了: {qiita_result}")
            webbrowser.open(qiita_result)
        except requests.HTTPError as e:
            if e.response is not None and e.response.status_code == 429:
                print("      Qiitaのレート制限中のためスキップ（ローカルに保存済み）")
            else:
                print(f"      Qiita投稿失敗: {e}（ローカルに保存済み）")

        # 後処理
        cleanup(audio_path, frames_dir)

        print()
        print("=" * 54)
        print(f"タイトル    : {title}")
        if qiita_result:
            print(f"Qiita URL   : {qiita_result}")
        print(f"ローカル保存: {md_path}")
        print(f"録画ファイル: {video_path.name}")
        print("=" * 54)

    except Exception as e:
        caffeinate.terminate()
        cleanup(audio_path, frames_dir)
        print(f"\nエラーが発生しました: {e}")
        raise


if __name__ == "__main__":
    main()
