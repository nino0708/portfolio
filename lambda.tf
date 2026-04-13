data "archive_file" "lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/lambda_src/lambda_function.py"
  output_path = "${path.module}/lambda_src/lambda_function.zip"
}

resource "aws_lambda_function" "contact_function" {
  function_name = var.lambda_function_name
  role          = aws_iam_role.lambda_role.arn
  handler       = local.lambda_handler
  runtime       = local.lambda_runtime
  filename      = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  timeout       = 10

  environment {
    variables = {
      TABLE_NAME      = aws_dynamodb_table.contact_table.name
      SES_FROM_EMAIL  = var.ses_from_email
      OPERATOR_EMAIL  = var.operator_email
    }
  }

  tags = local.common_tags
}
