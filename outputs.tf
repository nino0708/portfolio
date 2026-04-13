output "route53_name_servers" {
  value       = data.aws_route53_zone.main.name_servers
  description = "Set these name servers in Onamae.com"
}

output "cloudfront_domain_name" {
  value       = aws_cloudfront_distribution.site_distribution.domain_name
  description = "CloudFront distribution domain"
}

output "website_url" {
  value       = "https://${var.site_domain_name}"
  description = "Website URL"
}

output "api_invoke_url" {
  value       = "https://${aws_api_gateway_rest_api.contact_api.id}.execute-api.us-east-1.amazonaws.com/${aws_api_gateway_stage.prod.stage_name}/${local.api_resource_path}"
  description = "API Gateway invoke URL"
}

output "s3_bucket_name" {
  value       = aws_s3_bucket.site_bucket.bucket
  description = "Static site bucket name"
}

output "dynamodb_table_name" {
  value       = aws_dynamodb_table.contact_table.name
  description = "DynamoDB table name"
}
