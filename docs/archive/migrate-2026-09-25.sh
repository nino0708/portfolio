#!/bin/zsh
# 2026-09-25 の構成再編（PR #17）を Mac の ~/portfolio に反映する。
# Git が動かさない「管理外のファイル」（tools/・content/・node_modules・会計DB・.env 等）を新しい場所へ移す。
# 消すものは無い。不要物は ~/portfolio-archive/2026-09-25/ に退避するだけ。
set -e
cd ~/portfolio
A=~/portfolio-archive/2026-09-25
mkdir -p "$A"

echo "1) Terraform の状態ファイルを退避（Git 管理から外れるので pull で消えるため）"
for f in terraform.tfstate terraform.tfstate.backup terraform.tfvars; do
  [ -f "$f" ] && cp -p "$f" "$A/"
done

echo "2) 手元の変更を stash して main を最新にする"
git stash push -m "before-restructure-2026-09-25" || true
git switch main
git pull --ff-only origin main

echo "3) Terraform 関連を infra/contact-form/ へ"
for f in terraform.tfstate terraform.tfstate.backup terraform.tfvars; do
  [ -f "$A/$f" ] && cp -p "$A/$f" infra/contact-form/
done
[ -d .terraform ] && mv .terraform infra/contact-form/

echo "4) claude code/ に残った管理外ファイルを直下へ移す"
if [ -d "claude code" ]; then
  for d in .claude/knowledge .claude/docs; do
    [ -e "claude code/$d" ] && mv "claude code/$d" "$A/$(basename $d)"
  done
  rsync -a --ignore-existing --remove-source-files "claude code/" ./   # 同名が既にあれば上書きせず残す
  find "claude code" -type d -empty -delete
fi

echo "5) 名前の変更と、使わないものの退避"
[ -d "apps/ドリンク代計算" ] && mv "apps/ドリンク代計算" apps/drink-calc
mkdir -p apps/brand
[ -d apps/builtjapan-brand ] && mv apps/builtjapan-brand apps/brand/builtjapan
[ -d apps/friday-brand ] && mv apps/friday-brand apps/brand/friday
[ -d apps/tokyo-building-blog ] && mv apps/tokyo-building-blog "$A/"
[ -d tools/summit-kb ] && mv tools/summit-kb "$A/"

echo ""
echo "=== 完了 ==="
[ -d "claude code" ] && echo "※ claude code/ に移せなかったものが残っています:" && ls -la "claude code"
echo "退避先: $A"
ls "$A"
echo "--- Git 管理外で残っているもの（あとで追加するか判断）---"
git status --short | head -30
