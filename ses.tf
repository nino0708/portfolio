resource "aws_ses_email_identity" "from_email" {
  email = var.ses_from_email
}

resource "aws_ses_email_identity" "operator_email" {
  email = var.operator_email
}
