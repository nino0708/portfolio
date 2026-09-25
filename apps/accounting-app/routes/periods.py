"""会計期間・期首残高・繰越のAPI。"""
from flask import Blueprint, jsonify, request

from common import (
    get_db,
    get_balances_for_period,
    period_locked,
    STOCK_TYPES,
    _upsert_openings,
)

bp = Blueprint('periods', __name__)


# ===== Fiscal Periods =====

@bp.route('/api/periods', methods=['GET'])
def get_periods():
    conn = get_db()
    rows = conn.execute('SELECT * FROM fiscal_periods ORDER BY start_date DESC').fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@bp.route('/api/periods', methods=['POST'])
def create_period():
    d = request.json
    conn = get_db()
    if d.get('is_current'):
        conn.execute('UPDATE fiscal_periods SET is_current=0')
    conn.execute(
        'INSERT INTO fiscal_periods (name, start_date, end_date, is_current) VALUES (?,?,?,?)',
        (d['name'], d['start_date'], d['end_date'], 1 if d.get('is_current') else 0))
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok'})


@bp.route('/api/periods/<int:pid>', methods=['PUT'])
def update_period(pid):
    d = request.json
    conn = get_db()
    if d.get('is_current'):
        conn.execute('UPDATE fiscal_periods SET is_current=0')
    conn.execute(
        'UPDATE fiscal_periods SET name=?, start_date=?, end_date=?, is_current=? WHERE id=?',
        (d['name'], d['start_date'], d['end_date'], 1 if d.get('is_current') else 0, pid))
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok'})


@bp.route('/api/periods/<int:pid>', methods=['DELETE'])
def delete_period(pid):
    conn = get_db()
    conn.execute('DELETE FROM fiscal_periods WHERE id=?', (pid,))
    conn.execute('DELETE FROM opening_balances WHERE period_id=?', (pid,))
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok'})


@bp.route('/api/periods/<int:pid>/lock', methods=['POST'])
def set_period_lock(pid):
    """会計期間を締める / 締めを解除する。"""
    locked = 1 if (request.json or {}).get('locked') else 0
    conn = get_db()
    conn.execute('UPDATE fiscal_periods SET is_locked=? WHERE id=?', (locked, pid))
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok', 'locked': bool(locked)})


@bp.route('/api/carryover-account', methods=['POST'])
def set_carryover_account(aid=None):
    """繰越先の正味財産科目を1つ指定する（前期の正味財産増減額の振替先）。"""
    aid = (request.json or {}).get('account_id')
    conn = get_db()
    row = conn.execute(
        "SELECT id FROM accounts WHERE id=? AND account_type='equity' AND is_active=1", (aid,)).fetchone()
    if not row:
        conn.close()
        return jsonify({'error': '有効な正味財産科目を指定してください'}), 400
    conn.execute('UPDATE accounts SET is_carryover=0')
    conn.execute('UPDATE accounts SET is_carryover=1 WHERE id=?', (aid,))
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok'})


@bp.route('/api/periods/<int:pid>/opening-balances', methods=['GET'])
def get_opening_balances(pid):
    """その会計期間の期首残高。ストック科目を全件返し、未設定は 0。"""
    conn = get_db()
    saved = {r['account_id']: r['amount'] for r in conn.execute(
        'SELECT account_id, amount FROM opening_balances WHERE period_id=?', (pid,))}
    accounts = conn.execute(
        "SELECT * FROM accounts WHERE is_active=1 AND account_type IN (?,?,?) ORDER BY display_order, code",
        STOCK_TYPES).fetchall()
    conn.close()
    result = [{**dict(a), 'amount': saved.get(a['id'], 0)} for a in accounts]
    return jsonify(result)


@bp.route('/api/periods/<int:pid>/opening-balances', methods=['PUT'])
def put_opening_balances(pid):
    """期首残高の一括保存（手入力・初年度・調整用）。"""
    items = (request.json or {}).get('balances', [])
    conn = get_db()
    if period_locked(conn, pid):
        conn.close()
        return jsonify({'error': '締め済みの会計期間の期首残高は変更できません。'}), 400
    _upsert_openings(conn, pid, items)
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok'})


@bp.route('/api/periods/<int:pid>/carry-forward', methods=['POST'])
def carry_forward(pid):
    """前期末残高を当期の期首残高として繰り越す。
       ストック科目の期末残高をそのまま引き継ぎ、前期の当期正味財産増減額
       （Σ収益 − Σ費用）を繰越先（is_carryover）科目に合算する。"""
    conn = get_db()
    target = conn.execute('SELECT * FROM fiscal_periods WHERE id=?', (pid,)).fetchone()
    if not target:
        conn.close()
        return jsonify({'error': '会計期間が見つかりません'}), 404
    if period_locked(conn, pid):
        conn.close()
        return jsonify({'error': '締め済みの会計期間へは繰越できません。'}), 400

    prev_id = (request.json or {}).get('prev_period_id') if request.json else None
    if not prev_id:
        prev = conn.execute(
            'SELECT id FROM fiscal_periods WHERE end_date < ? ORDER BY end_date DESC LIMIT 1',
            (target['start_date'],)).fetchone()
        prev_id = prev['id'] if prev else None
    if not prev_id:
        conn.close()
        return jsonify({'error': '繰越元となる前期が見つかりません'}), 400

    carryover_row = conn.execute('SELECT id FROM accounts WHERE is_carryover=1 LIMIT 1').fetchone()
    carryover_id = carryover_row['id'] if carryover_row else None
    conn.close()

    prev_bal = get_balances_for_period(prev_id)
    net_change = 0
    openings = {}
    for b in prev_bal.values():
        if b['account_type'] in STOCK_TYPES:
            if round(b['balance'], 2) != 0:
                openings[b['id']] = b['balance']
        elif b['account_type'] == 'revenue':
            net_change += b['balance']
        elif b['account_type'] == 'expense':
            net_change -= b['balance']

    # 前期の正味財産増減額を繰越先科目（正味財産）に合算
    if carryover_id and round(net_change, 2) != 0:
        openings[carryover_id] = openings.get(carryover_id, 0) + net_change

    conn = get_db()
    conn.execute('DELETE FROM opening_balances WHERE period_id=?', (pid,))
    _upsert_openings(conn, pid, [{'account_id': aid, 'amount': amt} for aid, amt in openings.items()])
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok', 'prev_period_id': prev_id,
                    'net_change': net_change, 'count': len(openings)})
