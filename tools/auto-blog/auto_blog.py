#!/usr/bin/env python3
"""多カテゴリ学習ブログ自動生成・Qiita下書き投稿スクリプト（日次1記事）"""

import json
import os
from pathlib import Path

import anthropic
import requests
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.environ["ANTHROPIC_API_KEY"]
QIITA_TOKEN = os.environ["QIITA_TOKEN"]

STATE_FILE = Path(__file__).parent / "topics_state.json"

# ── トピック定義 ──────────────────────────────────────────────────────────────
TOPICS = [
    # AWSテーマ
    {"category": "AWS", "topic": "PostGIS空間関数とは何か",
     "tags": ["AWS", "PostgreSQL", "PostGIS", "初心者"]},
    {"category": "AWS", "topic": "VMware vCenterと仮想環境の違い",
     "tags": ["AWS", "仮想化", "クラウド", "初心者"]},
    {"category": "AWS", "topic": "IAMグループとAWS OrganizationsのOU、Identity Centerの使い分け",
     "tags": ["AWS", "IAM", "Organizations", "初心者"]},
    {"category": "AWS", "topic": "rootユーザーと管理アカウントの違い",
     "tags": ["AWS", "セキュリティ", "IAM", "初心者"]},
    {"category": "AWS", "topic": "MFA認証を強制設定する方法",
     "tags": ["AWS", "セキュリティ", "MFA", "初心者"]},
    {"category": "AWS", "topic": "AWS Budgetsでリソースを停止する方法",
     "tags": ["AWS", "コスト管理", "Budgets", "初心者"]},
    {"category": "AWS", "topic": "RDSの7日自動起動問題とスナップショット削除の現実解",
     "tags": ["AWS", "RDS", "コスト管理", "初心者"]},
    {"category": "AWS", "topic": "CloudWatchアラームで実行できる操作一覧",
     "tags": ["AWS", "CloudWatch", "監視", "初心者"]},
    {"category": "AWS", "topic": "CloudWatch Logsのエラー検知はメトリクスフィルターが正解",
     "tags": ["AWS", "CloudWatch", "ログ管理", "初心者"]},
    {"category": "AWS", "topic": "ALBのUnhealthy情報をCloudWatchで監視する方法",
     "tags": ["AWS", "ALB", "CloudWatch", "初心者"]},
    {"category": "AWS", "topic": "別AWSアカウントへのCloudFormation展開方法",
     "tags": ["AWS", "CloudFormation", "マルチアカウント", "初心者"]},
    {"category": "AWS", "topic": "CloudFormationで作成リソースにタグを自動付与する方法",
     "tags": ["AWS", "CloudFormation", "タグ管理", "初心者"]},
    {"category": "AWS", "topic": "RDSフェールオーバーの発生条件",
     "tags": ["AWS", "RDS", "可用性", "初心者"]},
    {"category": "AWS", "topic": "AWS BudgetsはCloudWatchアラーム不要で通知できる",
     "tags": ["AWS", "Budgets", "コスト管理", "初心者"]},

    # 効率化・哲学テーマ
    {"category": "効率化・哲学", "topic": "脳のリソースをいかに減らすか",
     "tags": ["生産性", "効率化", "思考法"]},
    {"category": "効率化・哲学", "topic": "仕事をする意義とは",
     "tags": ["キャリア", "哲学", "思考法"]},
    {"category": "効率化・哲学", "topic": "スマホを見ない時間の作り方",
     "tags": ["集中力", "生産性", "習慣"]},
    {"category": "効率化・哲学", "topic": "必要な情報だけ収集せよ、いらない情報に踊らされるな",
     "tags": ["情報収集", "思考法", "生産性"]},
    {"category": "効率化・哲学", "topic": "比較対象は自分の中にあり、他人と比べるな",
     "tags": ["マインドセット", "自己成長", "思考法"]},
    {"category": "効率化・哲学", "topic": "常に自分を高め続けろ",
     "tags": ["自己成長", "マインドセット", "習慣"]},
    {"category": "効率化・哲学", "topic": "能動的に動き続けろ",
     "tags": ["行動力", "マインドセット", "自己成長"]},
    {"category": "効率化・哲学", "topic": "圧倒的な量をこなしてチャンスを掴む",
     "tags": ["努力", "行動力", "自己成長"]},
    {"category": "効率化・哲学", "topic": "自慢するな、静かに記録せよ",
     "tags": ["マインドセット", "アウトプット", "習慣"]},
    {"category": "効率化・哲学", "topic": "哲学的にやりすぎな思考で圧倒的な成果を出す",
     "tags": ["哲学", "思考法", "生産性"]},

    # ENTJテーマ
    {"category": "ENTJ", "topic": "ENTJが会社で生きにくい理由",
     "tags": ["MBTI", "ENTJ", "キャリア"]},
    {"category": "ENTJ", "topic": "ENTJの効率化思考が誤解される理由",
     "tags": ["MBTI", "ENTJ", "人間関係"]},
    {"category": "ENTJ", "topic": "ENTJが組織より個人で動く理由",
     "tags": ["MBTI", "ENTJ", "フリーランス"]},
    {"category": "ENTJ", "topic": "ENTJが副業を始めた理由",
     "tags": ["MBTI", "ENTJ", "副業"]},

    # ガジェット・節約テーマ
    {"category": "ガジェット・節約", "topic": "作業効率化に買って良かったガジェット",
     "tags": ["ガジェット", "作業効率化", "テック"]},
    {"category": "ガジェット・節約", "topic": "節約思考でAWS無料枠を使い倒す方法",
     "tags": ["AWS", "節約", "無料枠", "初心者"]},
    {"category": "ガジェット・節約", "topic": "疲労回復に効いたガジェット・グッズ",
     "tags": ["ガジェット", "疲労回復", "健康"]},
    {"category": "ガジェット・節約", "topic": "睡眠の質を上げたら勉強効率が上がった話",
     "tags": ["睡眠", "生産性", "健康"]},

    # 体づくり・健康テーマ
    {"category": "体づくり・健康", "topic": "疲れた体を整えながら勉強する方法",
     "tags": ["健康", "勉強法", "ライフハック"]},
    {"category": "体づくり・健康", "topic": "仕事後に勉強できる体の作り方",
     "tags": ["健康", "勉強法", "習慣"]},
    {"category": "体づくり・健康", "topic": "15分で体をリセットする方法",
     "tags": ["健康", "ストレス解消", "ライフハック"]},

    # 資格・学習テーマ
    {"category": "資格・学習", "topic": "資格勉強で脳のリソースを使わない方法",
     "tags": ["資格", "勉強法", "効率化"]},
    {"category": "資格・学習", "topic": "資格勉強で使う教材は1冊でいい",
     "tags": ["資格", "勉強法", "AWS"]},
    {"category": "資格・学習", "topic": "試験前日にやること・やらないこと",
     "tags": ["資格", "試験対策", "勉強法"]},
    {"category": "資格・学習", "topic": "暗記効率を上げる方法",
     "tags": ["勉強法", "記憶術", "資格"]},

    # SNS・ブログ運用テーマ
    {"category": "SNS・ブログ運用", "topic": "Qiita×X×楽天ルームで副業収入を作る仕組み",
     "tags": ["副業", "ブログ", "SNS運用"]},
    {"category": "SNS・ブログ運用", "topic": "フォロワー1000人で楽天アフィリエイトはいくら稼げるか",
     "tags": ["副業", "アフィリエイト", "SNS運用"]},
    {"category": "SNS・ブログ運用", "topic": "自動化で1日10分の発信を実現する方法",
     "tags": ["自動化", "SNS運用", "副業"]},
    {"category": "SNS・ブログ運用", "topic": "録画しながらAWS構築してブログ素材を作る方法",
     "tags": ["AWS", "ブログ", "コンテンツ制作"]},
]

# ── カテゴリ別プロンプトテンプレート ─────────────────────────────────────────
PROMPT_TEMPLATES = {
    "AWS": (
        "あなたはAWSを独学で学んでいる初心者エンジニアです。\n"
        "今日は「{topic}」について学んだことをブログに書いてください。\n\n"
        "【条件】\n"
        "- 文字数：1000〜1500字（本文のみ）\n"
        "- 文体：勉強日記風（「今日学んだのは〜」「これが意外と難しくて…」「なるほど！」「詰まったポイント」）"
        "と解説記事風（概念説明・コマンド例・注意点）を自然にミックス\n"
        "- 初心者目線で躓きやすいポイントや「なぜそうなるのか」を丁寧に説明\n"
        "- Markdown形式、見出し（##）を2〜3個、最後に「## まとめ」\n"
        "- 1行目は「# 【AWS学習】」で始まる具体的なタイトル"
    ),
    "効率化・哲学": (
        "あなたはITエンジニアとして働きながら、生産性や思考法を深く研究している人物です。\n"
        "今日は「{topic}」についてブログに書いてください。\n\n"
        "【条件】\n"
        "- 文字数：1000〜1500字（本文のみ）\n"
        "- 文体：個人の経験談・気づき（日記風）と論理的な考察・具体的アドバイス（解説風）をミックス\n"
        "- 抽象論で終わらず「自分がどうやっているか」の具体例を必ず入れる\n"
        "- Markdown形式、見出し（##）を2〜3個、最後に「## まとめ」\n"
        "- 1行目は「# 」で始まる具体的なタイトル"
    ),
    "ENTJ": (
        "あなたはMBTIがENTJで、エンジニアとして働きながら副業・自己成長に取り組んでいます。\n"
        "今日は「{topic}」についてブログに書いてください。\n\n"
        "【条件】\n"
        "- 文字数：1000〜1500字（本文のみ）\n"
        "- 文体：自分の体験談・本音（日記風）と客観的な分析・ENTJの特性説明（解説風）をミックス\n"
        "- 共感を得つつも論理的に整理された文章\n"
        "- Markdown形式、見出し（##）を2〜3個、最後に「## まとめ」\n"
        "- 1行目は「# 【ENTJ】」で始まる具体的なタイトル"
    ),
    "ガジェット・節約": (
        "あなたはエンジニアとして働きながら、コスパ重視でガジェットや節約を研究している人物です。\n"
        "今日は「{topic}」についてブログに書いてください。\n\n"
        "【条件】\n"
        "- 文字数：1000〜1500字（本文のみ）\n"
        "- 文体：実際に使った感想・体験談（日記風）と具体的な選び方・使い方の解説（解説風）をミックス\n"
        "- 具体的な商品名・金額・数値を入れてリアリティを出す\n"
        "- Markdown形式、見出し（##）を2〜3個、最後に「## まとめ」\n"
        "- 1行目は「# 」で始まる具体的なタイトル"
    ),
    "体づくり・健康": (
        "あなたはフルタイムで働きながら資格勉強もしている、健康管理を重視するエンジニアです。\n"
        "今日は「{topic}」についてブログに書いてください。\n\n"
        "【条件】\n"
        "- 文字数：1000〜1500字（本文のみ）\n"
        "- 文体：自分の経験・失敗談（日記風）と効果的な方法の解説（解説風）をミックス\n"
        "- 忙しい人でも実践できる具体的な方法を提示する\n"
        "- Markdown形式、見出し（##）を2〜3個、最後に「## まとめ」\n"
        "- 1行目は「# 」で始まる具体的なタイトル"
    ),
    "資格・学習": (
        "あなたはAWS認定資格に挑戦しながら、効率的な勉強法を研究しているエンジニアです。\n"
        "今日は「{topic}」についてブログに書いてください。\n\n"
        "【条件】\n"
        "- 文字数：1000〜1500字（本文のみ）\n"
        "- 文体：自分の勉強体験・失敗談（日記風）と効率的な学習法の解説（解説風）をミックス\n"
        "- 「なぜその方法が効くのか」の理由を含める\n"
        "- Markdown形式、見出し（##）を2〜3個、最後に「## まとめ」\n"
        "- 1行目は「# 」で始まる具体的なタイトル"
    ),
    "SNS・ブログ運用": (
        "あなたはエンジニアとして働きながら、QiitaやXで発信し副収入を目指している人物です。\n"
        "今日は「{topic}」についてブログに書いてください。\n\n"
        "【条件】\n"
        "- 文字数：1000〜1500字（本文のみ）\n"
        "- 文体：自分の実績・体験談（日記風）と具体的な運用方法・数字（解説風）をミックス\n"
        "- 実際の数値・ツール名を入れてリアリティを出す\n"
        "- Markdown形式、見出し（##）を2〜3個、最後に「## まとめ」\n"
        "- 1行目は「# 」で始まる具体的なタイトル"
    ),
}


# ── 状態管理 ──────────────────────────────────────────────────────────────────
def load_state() -> dict:
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text(encoding="utf-8"))
    return {"current_index": 0}


def save_state(state: dict) -> None:
    STATE_FILE.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")


def get_current_topic() -> tuple[dict, int]:
    state = load_state()
    index = state["current_index"] % len(TOPICS)
    return TOPICS[index], index


def advance_topic() -> None:
    state = load_state()
    state["current_index"] = (state["current_index"] % len(TOPICS)) + 1
    save_state(state)


# ── ブログ生成 ────────────────────────────────────────────────────────────────
def generate_blog_content(topic_data: dict) -> tuple[str, str]:
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    template = PROMPT_TEMPLATES[topic_data["category"]]
    prompt = template.format(topic=topic_data["topic"])

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        messages=[{"role": "user", "content": prompt}],
    )

    content = message.content[0].text.strip()
    lines = content.split("\n")
    title = lines[0].lstrip("#").strip()
    body = "\n".join(lines[1:]).strip()
    return title, body


# ── Qiita投稿（レート制限時は最大3回リトライ）────────────────────────────────
def post_to_qiita(title: str, body: str, tags: list[str]) -> str:
    import time
    headers = {
        "Authorization": f"Bearer {QIITA_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "title": title,
        "body": body,
        "private": True,
        "tags": [{"name": tag} for tag in tags],
    }
    for attempt in range(3):
        response = requests.post(
            "https://qiita.com/api/v2/items",
            json=payload,
            headers=headers,
            timeout=30,
        )
        if response.status_code == 429:
            wait = 60 * (attempt + 1)
            print(f"      レート制限中... {wait}秒待機 (試行 {attempt + 1}/3)")
            time.sleep(wait)
            continue
        response.raise_for_status()
        return response.json()["url"]
    response.raise_for_status()
    return ""  # unreachable


# ── メイン ────────────────────────────────────────────────────────────────────
def main() -> None:
    topic_data, index = get_current_topic()
    done = index + 1
    remaining = len(TOPICS) - done

    print(f"[カテゴリ] {topic_data['category']}")
    print(f"[トピック] {topic_data['topic']}")
    print(f"[進捗    ] {done}/{len(TOPICS)}（残り {remaining} 記事）")
    print()

    print("[1/2] ブログ記事を生成中...")
    title, body = generate_blog_content(topic_data)
    print(f"      タイトル: {title}")
    print(f"      文字数  : {len(body)}字")

    print("[2/2] Qiitaに下書き保存中...")
    qiita_url = post_to_qiita(title, body, topic_data["tags"])
    print(f"      URL: {qiita_url}")

    # Qiita投稿成功後にのみインデックスを進める
    advance_topic()

    print()
    print("─" * 50)
    print(f"完了 | {title}")
    print(f"URL  | {qiita_url}")


if __name__ == "__main__":
    main()
