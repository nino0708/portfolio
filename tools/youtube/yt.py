#!/usr/bin/env python3
"""YouTube の情報を yt-dlp 経由で取りに行くための CLI。

サブコマンド:
  info        動画のメタデータ（タイトル/チャンネル/日付/長さ/再生数/概要）
  transcript  字幕テキスト（手動字幕→自動字幕の順で取得）
  search      キーワード検索（APIキー不要）
  channel     チャンネル/再生リストの動画一覧

字幕は毎回 .cache/ にテキスト保存する。長尺動画の全文をそのまま
コンテキストへ流し込まずに済むよう、既定では冒頭だけ表示してパスを返す。
"""

import argparse
import json
import os
import re
import subprocess
import sys
import tempfile

CACHE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".cache")
DEFAULT_LANGS = ["ja", "ja-orig", "en", "en-orig"]


def ytdlp_bin():
    for cand in ("yt-dlp", "/opt/homebrew/bin/yt-dlp", "/usr/local/bin/yt-dlp"):
        path = cand if os.path.sep in cand else None
        if path and os.path.exists(path):
            return path
        if not path:
            found = subprocess.run(["which", cand], capture_output=True, text=True)
            if found.returncode == 0:
                return found.stdout.strip()
    sys.exit("yt-dlp が見つかりません。`brew install yt-dlp` を実行してください。")


def run(args, extra=None):
    cmd = [ytdlp_bin()] + args + (extra or [])
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        sys.stderr.write(proc.stderr.strip()[-2000:] + "\n")
        sys.exit(f"yt-dlp が失敗しました (exit {proc.returncode})")
    return proc.stdout


def common_extra(ns):
    extra = []
    if getattr(ns, "cookies_from_browser", None):
        extra += ["--cookies-from-browser", ns.cookies_from_browser]
    return extra


def video_id(url_or_id):
    if re.fullmatch(r"[\w-]{11}", url_or_id):
        return url_or_id
    m = re.search(r"(?:v=|/shorts/|youtu\.be/|/embed/|/live/)([\w-]{11})", url_or_id)
    return m.group(1) if m else None


def to_url(url_or_id):
    vid = video_id(url_or_id)
    return f"https://www.youtube.com/watch?v={vid}" if vid else url_or_id


def hms(seconds):
    if not seconds:
        return "?"
    seconds = int(seconds)
    h, m, s = seconds // 3600, (seconds % 3600) // 60, seconds % 60
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m}:{s:02d}"


def fmt_date(d):
    return f"{d[:4]}-{d[4:6]}-{d[6:8]}" if d and len(d) == 8 else (d or "?")


# --- info -------------------------------------------------------------------

def cmd_info(ns):
    out = run(["--dump-single-json", "--skip-download", "--no-warnings", to_url(ns.url)],
              common_extra(ns))
    d = json.loads(out)
    desc = d.get("description") or ""
    if not ns.full_description and len(desc) > 1200:
        desc = desc[:1200] + f"\n…（概要欄 全{len(desc)}文字。全文は --full-description）"

    print(f"タイトル: {d.get('title')}")
    print(f"チャンネル: {d.get('uploader')} ({d.get('channel_url')})")
    print(f"公開日: {fmt_date(d.get('upload_date'))}  長さ: {hms(d.get('duration'))}")
    print(f"再生数: {d.get('view_count')}  高評価: {d.get('like_count')}")
    print(f"URL: https://www.youtube.com/watch?v={d.get('id')}")
    subs = sorted(set(list((d.get("subtitles") or {}).keys())))
    autos = sorted(set(list((d.get("automatic_captions") or {}).keys())))
    print(f"手動字幕: {', '.join(subs) if subs else 'なし'}")
    print(f"自動字幕: {'あり (' + str(len(autos)) + '言語)' if autos else 'なし'}")
    chapters = d.get("chapters") or []
    if chapters:
        print(f"\nチャプター ({len(chapters)}):")
        for c in chapters:
            print(f"  {hms(c.get('start_time'))} {c.get('title')}")
    print(f"\n概要:\n{desc}")


# --- transcript -------------------------------------------------------------

def parse_json3(path):
    """json3 字幕を (開始秒, テキスト) の列にする。自動字幕のローリング重複は捨てる。"""
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    lines = []
    for ev in data.get("events", []):
        if ev.get("aAppend"):
            continue
        segs = ev.get("segs") or []
        text = "".join(s.get("utf8", "") for s in segs)
        text = text.replace("\n", " ").strip()
        if not text:
            continue
        lines.append((ev.get("tStartMs", 0) / 1000.0, text))
    return lines


TAG_RE = re.compile(r"<[^>]+>")
CUE_RE = re.compile(r"^(\d\d:\d\d:\d\d\.\d\d\d)\s+-->\s+")


def parse_vtt(path):
    lines, seen, start = [], None, 0.0
    with open(path, encoding="utf-8") as f:
        for raw in f:
            raw = raw.rstrip("\n")
            m = CUE_RE.match(raw)
            if m:
                h, mi, s = m.group(1).split(":")
                start = int(h) * 3600 + int(mi) * 60 + float(s)
                continue
            if not raw.strip() or raw.startswith(("WEBVTT", "Kind:", "Language:", "NOTE")):
                continue
            text = TAG_RE.sub("", raw).strip()
            if text and text != seen:
                lines.append((start, text))
                seen = text
    return lines


def match_lang(pool, want):
    """pool のキーから want に合うものを返す。en → en-US のような部分一致も拾う。"""
    if want in pool:
        return want
    base = want.split("-")[0]
    for k in sorted(pool):
        if k == base or k.startswith(base + "-"):
            return k
    return None


def resolve_lang(url, langs, lang_explicit, extra):
    """ダウンロード前に言語を1つに絞る。

    自動字幕は全言語ぶん（100超）並ぶので、ワイルドカードで投げると
    大量リクエストになり 429 を食う。ここで1本に確定させる。
    """
    d = json.loads(run(["--dump-single-json", "--skip-download", "--no-warnings", url], extra))
    manual = {k: v for k, v in (d.get("subtitles") or {}).items() if k != "live_chat"}
    auto = d.get("automatic_captions") or {}

    for want in langs:                              # ① 手動字幕（希望順）
        hit = match_lang(manual, want)
        if hit:
            return hit, False, "手動字幕"
    if not lang_explicit:                           # ② 動画本来の言語の自動字幕
        orig = d.get("language")
        hit = match_lang(auto, orig) if orig else None
        if hit:
            return hit, True, "自動字幕(原語)"
    for want in langs:                              # ③ 自動字幕（希望順・自動翻訳含む）
        hit = match_lang(auto, want)
        if hit:
            return hit, True, "自動字幕"
    return None, False, None


def fetch_subs(url, lang, is_auto, extra):
    tmpdir = tempfile.mkdtemp(prefix="yt-subs-")
    flag = "--write-auto-subs" if is_auto else "--write-subs"
    for sub_format in ("json3", "vtt"):
        run(["--skip-download", flag, "--no-warnings",
             "--sub-langs", lang, "--sub-format", sub_format,
             "-o", os.path.join(tmpdir, "%(id)s"), url], extra)
        files = [f for f in os.listdir(tmpdir) if f.endswith(f".{sub_format}")]
        if files:
            return os.path.join(tmpdir, files[0]), sub_format
    return None, None


def cmd_transcript(ns):
    url = to_url(ns.url)
    langs = [l.strip() for l in ns.lang.split(",")] if ns.lang else DEFAULT_LANGS
    extra = common_extra(ns)

    lang, is_auto, kind = resolve_lang(url, langs, bool(ns.lang), extra)
    if not lang:
        sys.exit("字幕が見つかりませんでした（字幕オフの動画かもしれません）。"
                 "`info` で字幕の有無を確認してください。")

    path, sub_format = fetch_subs(url, lang, is_auto, extra)
    if not path:
        sys.exit(f"字幕 {lang} のダウンロードに失敗しました。")
    lines = parse_json3(path) if sub_format == "json3" else parse_vtt(path)

    if ns.timestamps:
        body, bucket, bucket_start = [], [], None
        for start, text in lines:
            if bucket_start is None:
                bucket_start = start
            bucket.append(text)
            if start - bucket_start >= ns.chunk:
                body.append(f"[{hms(bucket_start)}] " + " ".join(bucket))
                bucket, bucket_start = [], None
        if bucket:
            body.append(f"[{hms(bucket_start or 0)}] " + " ".join(bucket))
        text = "\n".join(body)
    else:
        text = " ".join(t for _, t in lines)
        text = re.sub(r"\s{2,}", " ", text)

    os.makedirs(CACHE_DIR, exist_ok=True)
    vid = video_id(url) or "unknown"
    out_path = os.path.join(CACHE_DIR, f"{vid}.{lang}.txt")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(text)

    print(f"言語: {lang}（{kind} / {sub_format}）  文字数: {len(text)}")
    print(f"保存先: {out_path}")
    if ns.print_mode == "path":
        return
    if ns.print_mode == "full" or len(text) <= ns.head:
        print("---")
        print(text)
    else:
        print(f"--- 冒頭 {ns.head} 文字（全文は上記ファイルを読むか --print full）")
        print(text[:ns.head])


# --- search / channel -------------------------------------------------------

def dump_entries(spec, limit, extra):
    out = run(["--dump-json", "--flat-playlist", "--no-warnings",
               "--playlist-end", str(limit), spec], extra)
    return [json.loads(line) for line in out.splitlines() if line.strip()]


def print_entries(entries):
    for i, e in enumerate(entries, 1):
        vid = e.get("id")
        dur = hms(e.get("duration"))
        views = e.get("view_count")
        views = f"{views:,}回" if isinstance(views, int) else "?"
        print(f"{i}. {e.get('title')}")
        who = (e.get("uploader") or e.get("channel")
               or e.get("playlist_uploader") or e.get("playlist_channel") or "?")
        print(f"   {who} | {dur} | {views} | "
              f"https://www.youtube.com/watch?v={vid}")


def cmd_search(ns):
    entries = dump_entries(f"ytsearch{ns.n}:{ns.query}", ns.n, common_extra(ns))
    print(f"「{ns.query}」の検索結果 {len(entries)}件\n")
    print_entries(entries)


def cmd_channel(ns):
    url = ns.url
    if not url.startswith("http"):
        url = f"https://www.youtube.com/{url if url.startswith('@') else '@' + url}"
    if "/watch" not in url and not re.search(r"/(videos|streams|playlists)/?$", url) \
            and "list=" not in url:
        url = url.rstrip("/") + "/videos"
    entries = dump_entries(url, ns.n, common_extra(ns))
    print(f"{url} の最新 {len(entries)}件\n")
    print_entries(entries)


def main():
    p = argparse.ArgumentParser(description="YouTube 情報取得 (yt-dlp ラッパー)")
    p.add_argument("--cookies-from-browser", help="年齢制限/限定公開向け (例: chrome)")
    sub = p.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser("info", help="動画のメタデータ")
    s.add_argument("url")
    s.add_argument("--full-description", action="store_true")
    s.set_defaults(func=cmd_info)

    s = sub.add_parser("transcript", help="字幕テキスト")
    s.add_argument("url")
    s.add_argument("--lang", help=f"優先言語をカンマ区切りで (既定: {','.join(DEFAULT_LANGS)})")
    s.add_argument("--timestamps", action="store_true", help="タイムスタンプ付きで出す")
    s.add_argument("--chunk", type=float, default=30.0, help="タイムスタンプの間隔(秒)")
    s.add_argument("--print", dest="print_mode", choices=["head", "full", "path"],
                   default="head")
    s.add_argument("--head", type=int, default=2000, help="冒頭表示の文字数")
    s.set_defaults(func=cmd_transcript)

    s = sub.add_parser("search", help="キーワード検索")
    s.add_argument("query")
    s.add_argument("-n", type=int, default=10)
    s.set_defaults(func=cmd_search)

    s = sub.add_parser("channel", help="チャンネル/再生リストの動画一覧")
    s.add_argument("url", help="@handle・チャンネルURL・再生リストURL")
    s.add_argument("-n", type=int, default=20)
    s.set_defaults(func=cmd_channel)

    ns = p.parse_args()
    ns.func(ns)


if __name__ == "__main__":
    main()
