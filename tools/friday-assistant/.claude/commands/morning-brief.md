朝のブリーフィングを実施してください。

手順:
1. `scripts/tasks.js` の advanceTasks を呼んで、期日が来た upcoming タスクを today に昇格
2. `data/tasks.json` から vip・today タスクを取得し、優先度順に並べる
3. Google Calendar MCP が使える場合: 今日の予定を取得して追記
4. Gmail MCP が使える場合: 未読の重要メールを確認して追記
5. 以下の形式でブリーフィングをターミナルに表示:

---
🌅 おはようございます！
【YYYY年MM月DD日(曜)】

⭐ VIPタスク: (あれば)

📅 今日のカレンダー: (Google Calendar使える場合)

📋 今日のタスク (N件):
  🔴 タスク名
  🟡 タスク名
  ...

今日も頑張りましょう！💪
---

6. LINE設定済みの場合: `node scripts/line.js send "メッセージ"` でLINEにも送信
