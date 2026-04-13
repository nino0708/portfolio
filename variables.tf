variable "project_name" {
  description = "Project name"
  type        = string
  default     = "contact-form"
}



variable "s3_bucket_name" {
  description = "S3 bucket name for static website files"
  type        = string
  default     = "20260412-aws-s3-test1"
}

variable "ses_from_email" {
  description = "SES verified sender email"
  type        = string
  default     = "2026awstest@gmail.com"
}

variable "operator_email" {
  description = "Operator notification email"
  type        = string
  default     = "kazuhiro19851013@hotmail.com"
}

variable "lambda_function_name" {
  description = "Lambda function name"
  type        = string
  default     = "contact-form-handler"
}

variable "dynamodb_table_name" {
  description = "DynamoDB table name"
  type        = string
  default     = "contact-form-table"
}

variable "domain_name" {
  description = "route_domain_name"
  type        = string
}

variable "site_domain_name" {
  description = "cloudfront_alias_domain_for_website"
  type        = string
}