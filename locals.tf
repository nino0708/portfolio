locals {
  api_name              = "contact-form-api"
  api_stage_name        = "prod"
  api_resource_path     = "contact"
  lambda_handler        = "lambda_function.lambda_handler"
  lambda_runtime        = "python3.12"
  common_tags = {
    Project = var.project_name
    Managed = "terraform"
  }
}
