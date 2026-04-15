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
