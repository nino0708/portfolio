#!/usr/bin/env python3
"""
使い方:
  python3 screenshot.py https://example.com
  python3 screenshot.py https://example.com --full   # ページ全体
  python3 screenshot.py https://example.com --out my.png  # ファイル名指定
"""

import argparse
import sys
from pathlib import Path
from datetime import datetime
from playwright.sync_api import sync_playwright


def take_screenshot(url: str, output: str, full_page: bool):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto(url, wait_until="networkidle")
        page.screenshot(path=output, full_page=full_page)
        browser.close()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("url", help="スクリーンショットを撮るURL")
    parser.add_argument("--full", action="store_true", help="ページ全体を撮影")
    parser.add_argument("--out", help="出力ファイル名（省略時は自動生成）")
    args = parser.parse_args()

    if args.out:
        output = args.out
    else:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output = f"screenshot_{timestamp}.png"

    print(f"撮影中: {args.url}")
    take_screenshot(args.url, output, args.full)
    print(f"保存: {Path(output).resolve()}")


if __name__ == "__main__":
    main()
