# portfolio

### HTML page 一般用 問い合わせ内容をDBに保存できる
https://nino0708.github.io/portfolio/HTMLfiles/contact_form

### HTML page 管理者用　DB内を閲覧可能
https://nino0708.github.io/portfolio/HTMLfiles/admin.html

### 構成図

![alt text](images/architecture.png)


<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>構成概要</title>
<style>
  body {
    font-family: 'Hiragino Sans', 'Meiryo', sans-serif;
    max-width: 800px;
    margin: 40px auto;
    padding: 0 24px;
    color: #222;
    line-height: 1.8;
    font-size: 16px;
  }

  h1 {
    font-size: 28px;
    border-bottom: 2px solid #333;
    padding-bottom: 10px;
    margin-bottom: 32px;
  }

  h2 {
    font-size: 22px;
    margin-top: 40px;
    margin-bottom: 16px;
    color: #333;
  }

  h3 {
    font-size: 18px;
    margin-top: 0;
    margin-bottom: 8px;
    color: #444;
  }

  ol, ul {
    padding-left: 24px;
  }

  li {
    margin-bottom: 8px;
    font-size: 16px;
  }

  .flow {
    background: #f5f5f5;
    border-left: 4px solid #555;
    padding: 16px 20px;
    margin: 16px 0;
    border-radius: 0 8px 8px 0;
    font-size: 15px;
  }

  .service-block {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px 20px;
    margin-bottom: 16px;
  }

  .alt {
    font-size: 13px;
    color: #888;
    margin-bottom: 8px;
  }

  hr {
    border: none;
    border-top: 1px solid #ddd;
    margin: 40px 0;
  }
</style>
</head>
<body>

<h1>構成概要</h1>

<h2>概要</h2>
<ol>
  <li>ユーザーが HTML フォームに情報を入力</li>
  <li>HTML へは HTTPS で接続</li>
  <li>HTML へのアクセスは独自ドメイン</li>
  <li>入力された情報は DB に保存</li>
  <li>DB に書き込まれた情報をオペレーターにメールで通知</li>
</ol>

<hr>

<h2>アーキテクチャ</h2>

<h3>1. 静的 Web Page の提供</h3>
<div class="flow">
  ユーザー → Route 53 → CloudFront (HTTPS) → S3 (静的 HTML)
</div>

<h3>2. 問い合わせ内容の送信</h3>
<div class="flow">
  ユーザーがフォーム送信 → API Gateway (REST API / HTTPS) → Lambda → DynamoDB / SES (メール送信)
</div>

<hr>

<h2>サービス選定</h2>

<div class="service-block">
  <h3>CloudFront + S3</h3>
  <ul>
    <li>各サービス学習のため</li>
    <li>AWS インフラとして標準的</li>
    <li>AWS の基本サービスだけで完結</li>
    <li>キャッシュ制御</li>
    <li>OAC で S3 バケットを非公開のまま CloudFront 経由のみ公開できる</li>
  </ul>
</div>

<div class="service-block">
  <h3>ACM</h3>
  <ul>
    <li>証明書発行・管理</li>
    <li>自前で準備する必要なし</li>
    <li>自動更新により有効期限の管理が不要</li>
  </ul>
</div>

<div class="service-block">
  <h3>Route 53</h3>
  <ul>
    <li>独自ドメイン利用</li>
    <li>ACM の検証のため</li>
    <li>DNS 検証により ACM の自動更新が可能（メール検証は自動更新不可）</li>
  </ul>
</div>

<div class="service-block">
  <h3>API Gateway REST API</h3>
  <p class="alt">選択肢：HTTP API / Lambda Function URL</p>
  <ul>
    <li>今後の認証・制御等の拡張性があるため</li>
  </ul>
</div>

<div class="service-block">
  <h3>Lambda</h3>
  <ul>
    <li>サーバーレス</li>
    <li>自動スケール</li>
  </ul>
</div>

<div class="service-block">
  <h3>DynamoDB</h3>
  <p class="alt">選択肢：RDS / Aurora</p>
  <ul>
    <li>単純な登録・参照に最適</li>
    <li>SQL 不要なシンプルな構成</li>
    <li>Lambda とともにサーバーレスアーキテクチャで統一</li>
  </ul>
</div>

<div class="service-block">
  <h3>SES</h3>
  <p class="alt">選択肢：SNS</p>
  <ul>
    <li>柔軟に本文や件名を作れる</li>
  </ul>
</div>

</body>
</html>
