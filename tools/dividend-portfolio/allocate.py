#!/usr/bin/env python3
"""毎月の高配当株ポートフォリオ推奨表から、その月に買う銘柄と株数を決める。

優先順位は本人の指定どおり:
  1. ディフェンシブ / 景気敏感 を 50:50 に寄せる（最優先）
  2. セクターの金額をできるだけ均等に
  3. セクター内の企業の金額をできるだけ均等に

保有株は売らない前提なので、各段階とも「下から水位を上げる」水入れ方式で
目標額を決め、そのうえで実際に買える株数の組み合わせを総当たりして
目標に一番近いものを選ぶ（＝本人の言う「四捨五入で一番条件に近い方」）。
"""
import json, argparse
from itertools import product
from pathlib import Path

D = Path(__file__).parent / "data"
W_SECTOR, W_COMPANY = 10, 1   # ②セクター均等を③企業均等より重く見る


def load(month):
    j = lambda f: json.loads((D / f).read_text())
    rec, hold, cls = j(f"recommended_{month}.json"), j(f"holdings_{month}.json"), j("classification.json")
    prices = {k: v["price"] for k, v in j("prices.json").items()}
    lots = {k: v for k, v in j("lots.json").items() if not k.startswith("_")}
    excludes = {k: v for k, v in j("excludes.json").items() if not k.startswith("_")}
    excluded_stocks = [s for s in rec["stocks"] if s["code"] in excludes]
    rec["stocks"] = [s for s in rec["stocks"] if s["code"] not in excludes]
    return rec, hold, prices, cls, lots, excludes, excluded_stocks


def water_fill(budget, items):
    """items: [(key, 現在額)] -> {key: 追加額}。下位から水位を上げて均等化する。"""
    if budget <= 0 or not items:
        return {k: 0.0 for k, _ in items}
    order = sorted(items, key=lambda x: x[1])
    for k in range(1, len(order) + 1):
        level = (budget + sum(v for _, v in order[:k])) / k
        if k == len(order) or level <= order[k][1]:
            return {key: max(0.0, level - val) for key, val in items}


def best_combo(sec_budget, members, sec_now, cur_val, prices, lots):
    """1セクター分の株数の組み合わせを総当たりし、目標からのズレが最小のものを返す。"""
    tgt_co = water_fill(sec_budget, [(c, cur_val.get(c, 0.0)) for c in members])
    tgt_sec = sec_now + sec_budget
    lot = lambda c: lots.get(c, {}).get("lot", 1)
    unit = lambda c: prices[c] * lot(c)
    # 1銘柄にセクター予算を全部入れても足りる本数＋1 を上限に打ち切る
    ranges = [range(int(sec_budget // unit(c)) + 2) for c in members]

    best, best_cost = None, float("inf")
    for combo in product(*ranges):
        spend = sum(n * unit(c) for n, c in zip(combo, members))
        if spend > sec_budget + max(unit(c) for c in members):
            continue
        cost = W_SECTOR * (sec_now + spend - tgt_sec) ** 2 + W_COMPANY * sum(
            (cur_val.get(c, 0.0) + n * unit(c) - (cur_val.get(c, 0.0) + tgt_co[c])) ** 2
            for n, c in zip(combo, members))
        if cost < best_cost:
            best, best_cost = combo, cost
    return {c: n * lot(c) for n, c in zip(best, members) if n}, tgt_co


def topup_budget(buys, leftover, rec_by_code, prices, lots, after, side):
    """バランス配分後に余った予算を使い切るための追い買い。
    ①50:50 / ②セクター均等 を通した後の"残り"を対象にするので、
    毎月これが動くこと自体はバランス計算が正常に機能している証拠（下の説明参照）。
    予算消化を優先し、その中でだけ景気敏感/ディフェンシブの薄い方を優先して買う。
    """
    lot = lambda c: lots.get(c, {}).get("lot", 1)
    unit = lambda c: prices[c] * lot(c)
    topup = {}
    while True:
        candidates = [c for c in rec_by_code if unit(c) <= leftover]
        if not candidates:
            break
        thin_side = "景気敏感" if after["景気敏感"] <= after["ディフェンシブ"] else "ディフェンシブ"
        pool = [c for c in candidates if side(rec_by_code[c]["sector"]) == thin_side] or candidates
        c = min(pool, key=unit)
        buys[c] = buys.get(c, 0) + lot(c)
        topup[c] = topup.get(c, 0) + lot(c)
        leftover -= unit(c)
        after[side(rec_by_code[c]["sector"])] += unit(c)
    return topup, leftover


def trim_to_budget(buys, budget, prices, lots, targets, cur_val):
    """全セクター合計が予算を超えたら、削っても一番痛くない1単元から外す。"""
    lot = lambda c: lots.get(c, {}).get("lot", 1)
    spent = lambda: sum(buys[c] * prices[c] for c in buys)
    while spent() > budget:
        alive = [c for c in buys if buys[c] >= lot(c)]
        if not alive:
            break
        # 目標を一番buyしすぎている（削っても目標に近いままの）銘柄を削る
        c = max(alive, key=lambda c: buys[c] * prices[c] - targets.get(c, 0.0))
        buys[c] -= lot(c)
        if buys[c] == 0:
            del buys[c]
    return buys


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--month", default="2026-08")
    ap.add_argument("--budget", type=int, default=28000)
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()

    rec, hold, prices, cls, lots, excludes, excluded_stocks = load(a.month)
    defensive = set(cls["defensive"])
    rec_by_code = {s["code"]: s for s in rec["stocks"]}
    hold_by_code = {h["code"]: h for h in hold["holdings"]}

    val = {h["code"]: h["shares"] * prices[h["code"]] for h in hold["holdings"]}
    side = lambda sec: "ディフェンシブ" if sec in defensive else "景気敏感"
    sec_of = lambda c: (hold_by_code.get(c) or rec_by_code[c])["sector"]

    cur = {"ディフェンシブ": 0.0, "景気敏感": 0.0}
    for c, v in val.items():
        cur[side(sec_of(c))] += v
    total = sum(cur.values())

    # --- ① 予算をディフェンシブ/景気敏感に割る（50:50に最も近づく配分） ---
    gap = cur["景気敏感"] - cur["ディフェンシブ"]
    to_def = min(a.budget, max(0.0, (gap + a.budget) / 2))
    side_budget = {"ディフェンシブ": to_def, "景気敏感": a.budget - to_def}

    buys, targets, sector_plan = {}, {}, {}
    for s in ("ディフェンシブ", "景気敏感"):
        if side_budget[s] <= 0:
            continue
        # --- ② セクター均等（推奨表に載っているセクターだけが買付対象） ---
        secs = sorted({r["sector"] for r in rec["stocks"] if side(r["sector"]) == s})
        sec_now = {x: sum(v for c, v in val.items() if sec_of(c) == x) for x in secs}
        sec_alloc = water_fill(side_budget[s], list(sec_now.items()))
        sector_plan[s] = (sec_now, sec_alloc)
        # --- ③ セクター内で企業均等 → 買える株数の組み合わせを総当たり ---
        for x, sb in sec_alloc.items():
            if sb <= 0:
                continue
            members = [r["code"] for r in rec["stocks"] if r["sector"] == x]
            got, tgt = best_combo(sb, members, sec_now[x], val, prices, lots)
            buys.update(got)
            targets.update(tgt)

    buys = trim_to_budget(buys, a.budget, prices, lots, targets, val)
    spent = sum(buys[c] * prices[c] for c in buys)

    # --- ④ 予算消化を優先し、①②で埋まらなかった残りを追い買いする ---
    after_balance = dict(cur)
    for c in buys:
        after_balance[side(sec_of(c))] += buys[c] * prices[c]
    leftover_before_topup = a.budget - spent
    topup, leftover = topup_budget(buys, leftover_before_topup, rec_by_code, prices, lots, after_balance, side)
    spent = sum(buys[c] * prices[c] for c in buys)

    add = [c for c in rec_by_code if c not in hold_by_code]
    drop = [c for c in hold_by_code if c not in rec_by_code]

    if a.json:
        print(json.dumps({"buys": buys, "spent": spent, "added": add, "dropped": drop},
                         ensure_ascii=False, indent=1))
        return

    P = print
    P(f"\n{'='*78}\n  {rec['title']}\n  今月の投資額 {a.budget:,}円 / 株価は {rec['month']} 時点\n{'='*78}")

    if excluded_stocks:
        P(f"\n■ 計算対象から除外（本人指定）")
        for s in excluded_stocks:
            P(f"    {s['code']} {s['name']}: {excludes[s['code']]}")

    P(f"\n■ 推奨表と保有の差分")
    P(f"  ▼ 推奨表にあって未保有（新しい買い候補） {len(add)}銘柄")
    for c in sorted(add, key=lambda c: (side(rec_by_code[c]['sector']), rec_by_code[c]["sector"])):
        r = rec_by_code[c]
        P(f"    {c} {r['name']:<22}{r['sector']:<12}利回り{r['yield']:5.2f}%  [{side(r['sector'])}]")
    P(f"  ▼ 保有しているが推奨表から外れた {len(drop)}銘柄（売却推奨ではなく、買い増し対象外）")
    for c in sorted(drop, key=lambda c: -val[c]):
        h = hold_by_code[c]
        P(f"    {c} {h['name']:<22}{h['sector']:<12}評価額{val[c]:>8,.0f}円  [{side(h['sector'])}]")

    P(f"\n■ ① ディフェンシブ / 景気敏感（最優先）")
    for s in ("景気敏感", "ディフェンシブ"):
        P(f"    現状 {s:<8}{cur[s]:>9,.0f}円  {cur[s]/total*100:5.2f}%")
    P(f"    差は {abs(gap):,.0f}円。{a.budget:,}円を全部ディフェンシブに入れてもまだ届かないので、"
      f"今月は\n    → ディフェンシブ {side_budget['ディフェンシブ']:,.0f}円 / 景気敏感 {side_budget['景気敏感']:,.0f}円")

    for s, (sec_now, sec_alloc) in sector_plan.items():
        P(f"\n■ ② {s}のセクター均等化（少ないセクターから水位を上げる）")
        for x in sorted(sec_alloc, key=lambda x: -sec_alloc[x]):
            mark = f"+{sec_alloc[x]:>6,.0f}円" if sec_alloc[x] > 0 else "   見送り"
            P(f"    {x:<14}現在{sec_now[x]:>8,.0f}円 → {mark}")

    P(f"\n■ ③ 今月買う銘柄と株数")
    P(f"    {'コード':<6}{'銘柄名':<26}{'セクター':<15}{'株価':>8}{'株数':>5}{'金額':>9}")
    P(f"    {'-'*72}")
    for c in sorted(buys, key=lambda c: (sec_of(c), -buys[c] * prices[c])):
        r = rec_by_code[c]
        mark = "  ←追い買い" if c in topup else ""
        P(f"    {c:<6}{r['name']:<26}{r['sector']:<15}{prices[c]:>8,.0f}{buys[c]:>5}{buys[c]*prices[c]:>9,.0f}{mark}")
    P(f"    {'-'*72}")
    P(f"    {'合計':<47}{len(buys):>4}銘柄{spent:>9,.0f}円")
    if topup:
        P(f"    うち①②のバランス配分だけでは {leftover_before_topup:,.0f}円 が余ったため、"
          f"薄い方（{'/'.join(topup)}）優先で追い買い{sum(prices[c]*n for c,n in topup.items()):,.0f}円分")
    if leftover > 0:
        P(f"    それでも使い切れなかった分 {leftover:,.0f}円 は、買える単元が無いため来月に繰り越し")

    after = dict(cur)
    for c in buys:
        after[side(sec_of(c))] += buys[c] * prices[c]
    tot2 = sum(after.values())
    P(f"\n■ 買った後の姿")
    for s in ("景気敏感", "ディフェンシブ"):
        P(f"    {s:<8}{after[s]:>9,.0f}円  {cur[s]/total*100:5.2f}% → {after[s]/tot2*100:5.2f}%")

    P(f"\n■ 1株単位で買えない銘柄")
    for c in (x for x in rec_by_code if x in lots):
        r, l = rec_by_code[c], lots[c]
        P(f"    {c} {r['name']}: {l['lot']}口単位（1回 約{prices[c]*l['lot']:,.0f}円）")
        P(f"      {l['reason']}")
        if c not in buys:
            P(f"      → 今月の配分額では1単元に届かないので見送り。")
    if cls["inferred"]:
        P(f"\n■ 注意：次のセクターは管理シートに実例が無く、東証33業種の一般的な扱いから推定")
        P(f"    {'、'.join(cls['inferred'])}")
    P()


if __name__ == "__main__":
    main()
