"""帳簿・決算書・予実・月次推移・監査・整合性チェックのAPI。"""
from flask import Blueprint, jsonify, request

from common import (
    PL_REVENUE_SECTIONS,
    PL_EXPENSE_SECTIONS,
    PL_EXTRA_REVENUE,
    PL_EXTRA_EXPENSE,
    PL_ALL_REVENUE,
    PL_ALL_EXPENSE,
    get_db,
    get_balances_for_period,
    period_locked,
    FLOW_TYPES,
    LINE_SELECT,
    fetch_lines_by_entry,
    _flow_section,
    _upsert_budgets,
    _enum_months,
)

bp = Blueprint('reports', __name__)


# ===== General Ledger =====

@bp.route('/api/general-ledger', methods=['GET'])
def get_general_ledger():
    period_id = request.args.get('period_id')
    account_id = request.args.get('account_id')
    conn = get_db()

    clauses, params = [], []
    if period_id:
        clauses.append('je.period_id = ?')
        params.append(period_id)
    if account_id:
        clauses.append('el.account_id = ?')
        params.append(account_id)

    where = ('WHERE ' + ' AND '.join(clauses)) if clauses else ''
    rows = conn.execute(
        f'''{LINE_SELECT}
            JOIN journal_entries je ON el.entry_id = je.id
            {where} ORDER BY je.entry_date, je.id, el.side DESC''',
        params).fetchall()
    # 相手科目を出すため、各伝票の反対側の科目名を引く
    headers = {r['entry_id']: None for r in (dict(x) for x in rows)}
    by_entry = fetch_lines_by_entry(conn, list(headers.keys()))
    je_meta = {}
    if headers:
        ph = ','.join('?' * len(headers))
        for h in conn.execute(f'SELECT id, entry_date, description FROM journal_entries WHERE id IN ({ph})', list(headers.keys())):
            je_meta[h['id']] = dict(h)
    accounts = conn.execute('SELECT * FROM accounts WHERE is_active=1 ORDER BY display_order, code').fetchall()
    conn.close()

    ledger = {dict(a)['id']: {**dict(a), 'entries': [], 'total_debit': 0, 'total_credit': 0, 'balance': 0}
              for a in accounts}

    for r in rows:
        e = dict(r)
        aid, side = e['account_id'], e['side']
        if aid not in ledger:
            continue
        meta = je_meta.get(e['entry_id'], {})
        opp_side = 'credit' if side == 'debit' else 'debit'
        opp = by_entry.get(e['entry_id'], {}).get(opp_side, [])
        counter = '諸口' if len(opp) > 1 else (opp[0]['account_name'] if opp else '')
        ledger[aid]['entries'].append({
            'id': e['entry_id'], 'entry_date': meta.get('entry_date'),
            'description': meta.get('description', ''),
            'amount': e['amount'], 'side': side, 'counter_account_name': counter,
        })
        if side == 'debit':
            ledger[aid]['total_debit'] += e['amount']
        else:
            ledger[aid]['total_credit'] += e['amount']

    for a in ledger.values():
        a['balance'] = a['total_debit'] - a['total_credit'] if a['account_type'] in ('asset', 'expense') \
            else a['total_credit'] - a['total_debit']

    result = sorted([v for v in ledger.values() if v['entries']], key=lambda x: x['display_order'])
    return jsonify(result)


# ===== Trial Balance =====

@bp.route('/api/trial-balance', methods=['GET'])
def get_trial_balance():
    period_id = request.args.get('period_id')
    balances = get_balances_for_period(period_id)
    conn = get_db()
    accounts = conn.execute('SELECT * FROM accounts WHERE is_active=1 ORDER BY display_order, code').fetchall()
    conn.close()
    result = []
    for acc in accounts:
        a = dict(acc)
        b = balances.get(a['id'], {})
        d, c = b.get('total_debit', 0), b.get('total_credit', 0)
        if d == 0 and c == 0:
            continue
        result.append({**a, 'debit_total': d, 'credit_total': c, 'balance': b.get('balance', 0)})
    return jsonify(result)


# ===== Balance Sheet =====

@bp.route('/api/balance-sheet', methods=['GET'])
def get_balance_sheet():
    period_id = request.args.get('period_id')
    balances = get_balances_for_period(period_id)
    assets, liabilities, equity = [], [], []
    net_income = 0
    for b in balances.values():
        if b['balance'] == 0:
            continue
        if b['account_type'] == 'asset':
            assets.append(b)
        elif b['account_type'] == 'liability':
            liabilities.append(b)
        elif b['account_type'] == 'equity':
            equity.append(b)
        elif b['account_type'] == 'revenue':
            net_income += b['balance']
        elif b['account_type'] == 'expense':
            net_income -= b['balance']
    if net_income != 0:
        equity.append({
            'id': None, 'code': '', 'name': '当期正味財産増減額', 'account_type': 'equity',
            'category': '正味財産', 'display_order': 9999, 'is_active': 1,
            'balance': net_income,
        })
    return jsonify({
        'assets': assets, 'liabilities': liabilities, 'equity': equity,
        'total_assets': sum(a['balance'] for a in assets),
        'total_liabilities': sum(l['balance'] for l in liabilities),
        'total_equity': sum(e['balance'] for e in equity),
    })


# ===== 活動計算書（正味財産増減計算書） =====

@bp.route('/api/profit-loss', methods=['GET'])
def get_profit_loss():
    """NPO法人会計基準の活動計算書。
       経常収益 − 経常費用＝当期経常増減額、±経常外＝当期正味財産増減額、
       ＋前期繰越正味財産＝次期繰越正味財産。"""
    period_id = request.args.get('period_id')
    balances = get_balances_for_period(period_id)

    sections = {s: [] for s in PL_ALL_REVENUE + PL_ALL_EXPENSE}

    for b in balances.values():
        if b['balance'] == 0:
            continue
        sec = b.get('pl_section', '')
        if b['account_type'] == 'revenue':
            sections[sec if sec in PL_ALL_REVENUE else '事業収益'].append(b)
        elif b['account_type'] == 'expense':
            sections[sec if sec in PL_ALL_EXPENSE else '管理費'].append(b)

    def tot(k):
        return sum(a['balance'] for a in sections[k])

    keijo_rev = sum(tot(s) for s in PL_REVENUE_SECTIONS)   # 経常収益計
    keijo_exp = sum(tot(s) for s in PL_EXPENSE_SECTIONS)   # 経常費用計
    keijo_change = keijo_rev - keijo_exp                    # 当期経常増減額
    eo_rev = tot(PL_EXTRA_REVENUE)
    eo_exp = tot(PL_EXTRA_EXPENSE)
    net = keijo_change + eo_rev - eo_exp                    # 当期正味財産増減額

    # 前期繰越正味財産＝期首の正味財産合計（正味財産科目の期首残高合計）
    prev_net_assets = sum(b.get('opening', 0) for b in balances.values()
                          if b['account_type'] == 'equity')
    next_net_assets = prev_net_assets + net

    totals = {
        '経常収益計': keijo_rev,
        '事業費': tot('事業費'), '管理費': tot('管理費'),
        '経常費用計': keijo_exp,
        '当期経常増減額': keijo_change,
        '経常外収益': eo_rev, '経常外費用': eo_exp,
        '当期正味財産増減額': net,
        '前期繰越正味財産': prev_net_assets, '次期繰越正味財産': next_net_assets,
    }
    for s in PL_REVENUE_SECTIONS:
        totals[s] = tot(s)

    return jsonify({
        'sections': sections,
        'revenue_sections': PL_REVENUE_SECTIONS,
        'expense_sections': PL_EXPENSE_SECTIONS,
        'totals': totals,
    })


@bp.route('/api/periods/<int:pid>/budgets', methods=['PUT'])
def put_budgets(pid):
    """予算の一括保存。締め済みの期は変更不可。"""
    items = (request.json or {}).get('budgets', [])
    conn = get_db()
    if period_locked(conn, pid):
        conn.close()
        return jsonify({'error': '締め済みの会計期間の予算は変更できません。'}), 400
    _upsert_budgets(conn, pid, items)
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok'})


@bp.route('/api/budget-actual', methods=['GET'])
def get_budget_actual():
    """予実分析。収益/費用科目ごとに予算・実績を区分（活動計算書区分）でまとめて返す。
       差異・達成率はフロント側で算出（予算をその場で編集して即時に再計算するため）。"""
    period_id = request.args.get('period_id')
    balances = get_balances_for_period(period_id)

    budget = {}
    if period_id:
        conn = get_db()
        budget = {r['account_id']: r['amount'] for r in conn.execute(
            'SELECT account_id, amount FROM budgets WHERE period_id=?', (period_id,))}
        conn.close()

    sections = {s: [] for s in PL_ALL_REVENUE + PL_ALL_EXPENSE}
    # 有効な収益・費用科目は実績/予算が無くても全て出す（年度初め＝実績ゼロでも予算を立てられるように）
    for b in balances.values():
        if b['account_type'] not in FLOW_TYPES:
            continue
        actual = b['balance']
        bud = budget.get(b['id'], 0)
        sec = _flow_section(b['account_type'], b.get('pl_section', ''))
        sections[sec].append({
            'id': b['id'], 'name': b['name'], 'code': b['code'],
            'category': b.get('category', ''), 'account_type': b['account_type'],
            'actual': actual, 'budget': bud,
        })

    return jsonify({
        'sections': sections,
        'revenue_sections': PL_REVENUE_SECTIONS,
        'expense_sections': PL_EXPENSE_SECTIONS,
        'extra_revenue': PL_EXTRA_REVENUE,
        'extra_expense': PL_EXTRA_EXPENSE,
        'has_period': bool(period_id),
    })


@bp.route('/api/monthly-trend', methods=['GET'])
def get_monthly_trend():
    """勘定科目を行、月を列にした月次推移表。
       各月は当月の純増減（フロー）、期首列は期首残高、合計＝期首＋各月＝期末残高。"""
    period_id = request.args.get('period_id')
    conn = get_db()
    where = 'WHERE je.period_id = ?' if period_id else ''
    params = [period_id] if period_id else []

    # 列（月）の範囲を決める。期間指定なら会計期間の開始〜終了、なければ伝票の最小〜最大日付。
    if period_id:
        p = conn.execute('SELECT start_date, end_date FROM fiscal_periods WHERE id=?',
                         [period_id]).fetchone()
        start_d, end_d = (p['start_date'], p['end_date']) if p else (None, None)
    else:
        r = conn.execute('SELECT MIN(entry_date) a, MAX(entry_date) b FROM journal_entries').fetchone()
        start_d, end_d = r['a'], r['b']
    months = _enum_months(start_d[:7] if start_d else None,
                          end_d[:7] if end_d else None)

    # 月×科目×貸借 の集計
    grid = {}  # account_id -> {ym -> {'debit':x,'credit':y}}
    for row in conn.execute(
            f"""SELECT el.account_id aid, strftime('%Y-%m', je.entry_date) ym,
                       el.side side, SUM(el.amount) t
                FROM entry_lines el JOIN journal_entries je ON el.entry_id = je.id
                {where} GROUP BY el.account_id, ym, el.side""", params):
        grid.setdefault(row['aid'], {}).setdefault(row['ym'], {'debit': 0, 'credit': 0})
        grid[row['aid']][row['ym']][row['side']] = row['t'] or 0

    opening = {}
    if period_id:
        opening = {r['account_id']: r['amount'] for r in conn.execute(
            'SELECT account_id, amount FROM opening_balances WHERE period_id=?', [period_id])}

    accounts = conn.execute('SELECT * FROM accounts WHERE is_active=1 ORDER BY display_order, code').fetchall()
    conn.close()

    rows = []
    for acc in accounts:
        a = dict(acc)
        atype = a['account_type']
        ob = opening.get(a['id'], 0)
        per_month = grid.get(a['id'], {})
        monthly = {}
        for ym in months:
            mv = per_month.get(ym, {})
            d, c = mv.get('debit', 0), mv.get('credit', 0)
            flow = (d - c) if atype in ('asset', 'expense') else (c - d)
            monthly[ym] = flow
        total = ob + sum(monthly.values())
        if ob == 0 and total == 0 and not any(monthly.values()):
            continue
        rows.append({
            'id': a['id'], 'code': a['code'], 'name': a['name'],
            'account_type': atype, 'display_order': a['display_order'],
            'opening': ob, 'monthly': monthly, 'total': total,
        })

    return jsonify({'months': months, 'rows': rows})


# ===== Audit Report =====

@bp.route('/api/audit-report', methods=['GET'])
def get_audit_report():
    curr_id = request.args.get('current_period_id')
    prev_id = request.args.get('prev_period_id')
    curr = get_balances_for_period(curr_id)
    prev = get_balances_for_period(prev_id)
    conn = get_db()
    accounts = conn.execute('SELECT * FROM accounts WHERE is_active=1 ORDER BY display_order, code').fetchall()
    conn.close()
    report = []
    for acc in accounts:
        a = dict(acc)
        cb = curr.get(a['id'], {}).get('balance', 0)
        pb = prev.get(a['id'], {}).get('balance', 0)
        if cb == 0 and pb == 0:
            continue
        chg = cb - pb
        pct = (chg / pb * 100) if pb != 0 else None
        report.append({**a, 'current_balance': cb, 'prev_balance': pb, 'change': chg, 'change_pct': pct})
    return jsonify(report)


# ===== Integrity Check =====

@bp.route('/api/integrity', methods=['GET'])
def get_integrity():
    """貸借の整合性を常時チェック（現行データで完結）。
       ①借方合計＝貸方合計 ②各仕訳の貸借一致 ③貸借対照表の均衡"""
    period_id = request.args.get('period_id')
    conn = get_db()
    where = 'WHERE je.period_id = ?' if period_id else ''
    params = [period_id] if period_id else []

    # ① 貸借平均（明細行の借方合計＝貸方合計）
    total_debit = conn.execute(
        f"SELECT COALESCE(SUM(el.amount),0) FROM entry_lines el JOIN journal_entries je ON el.entry_id=je.id {where} {'AND' if where else 'WHERE'} el.side='debit'", params).fetchone()[0]
    total_credit = conn.execute(
        f"SELECT COALESCE(SUM(el.amount),0) FROM entry_lines el JOIN journal_entries je ON el.entry_id=je.id {where} {'AND' if where else 'WHERE'} el.side='credit'", params).fetchone()[0]

    # ② 各仕訳の貸借一致（伝票ごとに借方合計＝貸方合計）
    rows = conn.execute(
        f'''SELECT je.id,
                   COALESCE(SUM(CASE WHEN el.side='debit'  THEN el.amount END),0) d,
                   COALESCE(SUM(CASE WHEN el.side='credit' THEN el.amount END),0) c
            FROM journal_entries je LEFT JOIN entry_lines el ON el.entry_id=je.id
            {where} GROUP BY je.id''', params).fetchall()
    bad_ids = [r['id'] for r in rows if round(r['d'], 2) != round(r['c'], 2)]
    entry_count = len(rows)
    conn.close()

    # ③ 貸借対照表の均衡（資産＝負債＋純資産＋当期純利益）
    balances = get_balances_for_period(period_id)
    assets = liabilities = equity = net_income = 0
    for b in balances.values():
        t = b['account_type']
        if t == 'asset':       assets += b['balance']
        elif t == 'liability': liabilities += b['balance']
        elif t == 'equity':    equity += b['balance']
        elif t == 'revenue':   net_income += b['balance']
        elif t == 'expense':   net_income -= b['balance']
    liab_equity = liabilities + equity + net_income

    # ④ 期首残高の貸借一致（資産期首＝負債＋正味財産の期首）
    open_debit = open_credit = 0
    for b in balances.values():
        ob = b.get('opening', 0)
        if not ob:
            continue
        if b['account_type'] == 'asset':
            open_debit += ob
        elif b['account_type'] in ('liability', 'equity'):
            open_credit += ob

    def eq(a, b):
        return round(a, 2) == round(b, 2)

    checks = [
        {
            'key': 'trial', 'label': '貸借平均の原則',
            'ok': eq(total_debit, total_credit),
            'detail': f'借方合計 {total_debit:,.0f} 円 ／ 貸方合計 {total_credit:,.0f} 円',
        },
        {
            'key': 'vouchers', 'label': '各仕訳の貸借一致',
            'ok': len(bad_ids) == 0,
            'detail': (f'全 {entry_count} 件すべて一致' if not bad_ids
                       else f'{len(bad_ids)} 件が不一致（伝票No. {", ".join(map(str, bad_ids[:10]))}{"…" if len(bad_ids) > 10 else ""}）'),
            'bad_ids': bad_ids,
        },
        {
            'key': 'bs', 'label': '貸借対照表の均衡',
            'ok': eq(assets, liab_equity),
            'detail': f'資産 {assets:,.0f} 円 ／ 負債＋正味財産 {liab_equity:,.0f} 円',
        },
        {
            'key': 'opening', 'label': '期首残高の貸借一致',
            'ok': eq(open_debit, open_credit),
            'detail': (f'期首残高なし' if open_debit == 0 and open_credit == 0
                       else f'資産期首 {open_debit:,.0f} 円 ／ 負債＋正味財産期首 {open_credit:,.0f} 円'),
        },
    ]
    return jsonify({'ok': all(c['ok'] for c in checks), 'checks': checks})
