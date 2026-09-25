
#!/bin/bash
# CloudFormation デプロイスクリプト
set -e

STACK_NAME="aws-training-main"
TEMPLATE_FILE="main-infrastructure.yaml"
PARAMETERS_FILE="parameters.json"
REGION="ap-northeast-1"

echo "===== CloudFormation スタックのデプロイ ====="
echo "スタック名  : ${STACK_NAME}"
echo "リージョン  : ${REGION}"
echo ""

# テンプレートの検証
echo "[1/3] テンプレートを検証中..."
aws cloudformation validate-template \
  --template-body file://${TEMPLATE_FILE} \
  --region ${REGION}
echo "テンプレート検証 OK"
echo ""

# スタックの存在確認
STACK_STATUS=$(aws cloudformation describe-stacks \
  --stack-name ${STACK_NAME} \
  --region ${REGION} \
  --query 'Stacks[0].StackStatus' \
  --output text 2>/dev/null || echo "NOT_EXIST")

if [ "${STACK_STATUS}" = "NOT_EXIST" ]; then
  echo "[2/3] 新規スタックを作成中..."
  aws cloudformation create-stack \
    --stack-name ${STACK_NAME} \
    --template-body file://${TEMPLATE_FILE} \
    --parameters file://${PARAMETERS_FILE} \
    --capabilities CAPABILITY_NAMED_IAM \
    --region ${REGION}

  echo "[3/3] スタック作成完了を待機中（完了まで15〜25分かかります）..."
  aws cloudformation wait stack-create-complete \
    --stack-name ${STACK_NAME} \
    --region ${REGION}
else
  echo "[2/3] 既存スタックを更新中..."
  aws cloudformation update-stack \
    --stack-name ${STACK_NAME} \
    --template-body file://${TEMPLATE_FILE} \
    --parameters file://${PARAMETERS_FILE} \
    --capabilities CAPABILITY_NAMED_IAM \
    --region ${REGION}

  echo "[3/3] スタック更新完了を待機中..."
  aws cloudformation wait stack-update-complete \
    --stack-name ${STACK_NAME} \
    --region ${REGION}
fi

echo ""
echo "===== デプロイ完了 ====="
aws cloudformation describe-stacks \
  --stack-name ${STACK_NAME} \
  --region ${REGION} \
  --query 'Stacks[0].Outputs' \
  --output table
