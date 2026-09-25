import json
import boto3
import uuid
import os
from datetime import datetime, timezone

# 環境変数
TABLE_NAME = os.environ.get('TABLE_NAME', 'test-table')
FROM_EMAIL = os.environ.get('SES_FROM_EMAIL')
TO_EMAIL = os.environ.get('OPERATOR_EMAIL')
#TO_EMAIL_2 = os.environ.get('OPERATOR_EMAIL_2')

# AWS clients/resources
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(TABLE_NAME)

ses = boto3.client('ses', region_name='us-east-1')


def lambda_handler(event, context):
    print("Lambda start")
    print("event:", json.dumps(event, ensure_ascii=False))

    try:
        # API Gateway REST API / HTTP API 両対応
        method = event.get('httpMethod')
        if not method:
            method = event.get('requestContext', {}).get('http', {}).get('method')

        print("method:", method)

        # CORS preflight
        if method == 'OPTIONS':
            return response(200, '')

        # POST
        if method == 'POST':
            raw_body = event.get('body', '{}')

            # bodyがbase64の場合の簡易対応は今回は省略
            if not raw_body:
                raw_body = '{}'

            body = json.loads(raw_body)
            print("parsed body:", json.dumps(body, ensure_ascii=False))

            name = body.get('name', '')
            email = body.get('email', '')
            subject = body.get('subject', '')
            message = body.get('message', '')

            item = {
                'id': str(uuid.uuid4()),
                'timestamp': datetime.now(timezone.utc).isoformat(),
                'name': name,
                'email': email,
                'subject': subject,
                'message': message
            }

            print("before dynamodb put_item")
            table.put_item(Item=item)
            print("after dynamodb put_item")

            # SES送信は失敗してもPOST自体は成功扱いにする
            try:
                mail_subject = f"【フォーム通知】{subject if subject else '件名なし'}"
                mail_body = f"""フォームから新しい問い合わせがありました。

名前: {name}
メールアドレス: {email}
件名: {subject}
内容:
{message}

受付日時(UTC): {item['timestamp']}
ID: {item['id']}
"""

                print("before ses send_email")
                ses_response = ses.send_email(
                    Source=FROM_EMAIL,
                    Destination={
                        'ToAddresses': [TO_EMAIL]
                    },
                    Message={
                        'Subject': {
                            'Data': mail_subject,
                            'Charset': 'UTF-8'
                        },
                        'Body': {
                            'Text': {
                                'Data': mail_body,
                                'Charset': 'UTF-8'
                            }
                        }
                    }
                )
                print("after ses send_email:", json.dumps(ses_response, default=str, ensure_ascii=False))

            except Exception as ses_error:
                print("SES error:", str(ses_error))

            return response(200, {'message': 'success'})

        # GET
        if method == 'GET':
            print("before dynamodb scan")
            result = table.scan()
            items = result.get('Items', [])
            items.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
            print(f"after dynamodb scan, count={len(items)}")
            return response(200, items)

        return response(405, {'message': 'Method Not Allowed'})

    except Exception as e:
        print("Unhandled error:", str(e))
        return response(500, {'message': 'error', 'error': str(e)})


def response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
        },
        'body': body if isinstance(body, str) else json.dumps(body, ensure_ascii=False)
    }
