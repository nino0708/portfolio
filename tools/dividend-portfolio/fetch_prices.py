import json, urllib.request, sys

CODES = """9986 3076 8130 2659 3333 9989 4008 4097 4206 4958 8725 6785 7723 3231 3003
2169 9757 9769 4290 4641 3817 3844 3901 4674 4746 2003 1928 6345 9364 9381 7989
5982 5108 7994 4540 1343 1414 4042 4205 5388 6073 7820 8058 8309 8584 8593 9513""".split()

out = {}
for c in CODES:
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{c}.T?interval=1d&range=5d"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        meta = json.load(urllib.request.urlopen(req, timeout=20))["chart"]["result"][0]["meta"]
        out[c] = {"price": meta["regularMarketPrice"], "name": meta.get("shortName", "")}
    except Exception as e:
        out[c] = {"price": None, "name": f"ERROR {e}"}
        print(f"  !! {c}: {e}", file=sys.stderr)

json.dump(out, open("data/prices.json", "w"), ensure_ascii=False, indent=1)
print(f"{sum(1 for v in out.values() if v['price'])}/{len(CODES)} 件取得")
