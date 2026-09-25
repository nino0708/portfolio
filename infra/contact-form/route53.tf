# 既存のRoute53ゾーンを参照
data "aws_route53_zone" "main" {
  name         = "kktestkk.com"  # 既存のドメイン名
  private_zone = false
}