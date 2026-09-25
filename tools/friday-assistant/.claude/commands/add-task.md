タスクを追加します。

ユーザーの入力からタスク情報を読み取り、不明な場合は確認してください:
- タイトル（必須）
- 優先度: high / medium / low（デフォルト: medium）
- カテゴリ: vip / today / upcoming / someday（デフォルト: today）
- 期日: YYYY-MM-DD形式（upcoming の場合は必須、それ以外は任意）

`data/tasks.json` の tasks 配列に以下の形式で追加:
```json
{
  "id": "一意なID（timestamp+random）",
  "title": "タスク名",
  "priority": "medium",
  "category": "today",
  "dueDate": null,
  "completed": false,
  "createdAt": "現在のISO8601時刻"
}
```

追加後、追加したタスクの情報と現在の今日のタスク件数を報告してください。
