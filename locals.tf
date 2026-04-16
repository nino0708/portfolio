locals {
  api_name              = "contact-form-api"
  api_stage_name        = "prod"
  api_resource_path     = "contact"
  lambda_handler        = "lambda_function.lambda_handler"
  lambda_runtime        = "python3.12"
  lambda_function_name  = "${var.project_name}-lambda"
  cloudfront_comment    = "${var.project_name} cloudfront distribution"

  common_tags = {
    Project = var.project_name
    Managed = "terraform"
  }

  api_invoke_url = "${aws_api_gateway_stage.prod.invoke_url}/${local.api_resource_path}"

  rendered_index_html = templatefile("${path.module}/templates/contact_form.html.tftpl", {
    api_endpoint = local.api_invoke_url
  })

  rendered_admin_html = templatefile("${path.module}/templates/admin.html.tftpl", {
    api_endpoint = local.api_invoke_url
  })
}
