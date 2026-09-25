"""勘定科目・補助科目のAPI。"""
from flask import Blueprint, jsonify, request

from common import (
    sqlite3,
    npo_pl_section,
    get_db,
)

bp = Blueprint('accounts', __name__)


# ===== Accounts =====

@bp.route('/api/accounts', methods=['GET'])
def get_accounts():
    conn = get_db()
    rows = conn.execute('SELECT * FROM accounts WHERE is_active=1 ORDER BY display_order, code').fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@bp.route('/api/accounts', methods=['POST'])
def create_account():
    d = request.json
    conn = get_db()
    # codeは自動採番（重複しなくなるまでインクリメント）
    max_code = conn.execute(
        "SELECT MAX(CAST(code AS INTEGER)) FROM accounts WHERE code GLOB '[0-9]*'"
    ).fetchone()[0]
    code = (max_code or 0) + 1
    while True:
        try:
            pl_sec = d.get('pl_section', '')
            if not pl_sec:
                pl_sec = npo_pl_section(d['account_type'], d.get('name', ''))
            cur = conn.execute(
                'INSERT INTO accounts (code, name, account_type, category, display_order, pl_section) VALUES (?,?,?,?,?,?)',
                (str(code), d['name'], d['account_type'], d.get('category', ''), d.get('display_order', 0), pl_sec))
            new_id = cur.lastrowid
            conn.commit()
            break
        except sqlite3.IntegrityError:
            code += 1
    conn.close()
    return jsonify({'status': 'ok', 'id': new_id})


@bp.route('/api/accounts/<int:aid>', methods=['PUT'])
def update_account(aid):
    d = request.json
    conn = get_db()
    conn.execute(
        'UPDATE accounts SET name=?, account_type=?, category=?, display_order=?, pl_section=? WHERE id=?',
        (d['name'], d['account_type'], d.get('category', ''), d.get('display_order', 0), d.get('pl_section', ''), aid))
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok'})


@bp.route('/api/accounts/<int:aid>', methods=['DELETE'])
def delete_account(aid):
    conn = get_db()
    conn.execute('UPDATE accounts SET is_active=0 WHERE id=?', (aid,))
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok'})


# ===== Sub Accounts =====

@bp.route('/api/sub-accounts', methods=['GET'])
def get_all_sub_accounts():
    conn = get_db()
    rows = conn.execute(
        'SELECT * FROM sub_accounts WHERE is_active=1 ORDER BY account_id, display_order, code'
    ).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@bp.route('/api/accounts/<int:aid>/sub-accounts', methods=['GET'])
def get_sub_accounts(aid):
    conn = get_db()
    rows = conn.execute(
        'SELECT * FROM sub_accounts WHERE account_id=? AND is_active=1 ORDER BY display_order, code',
        (aid,)
    ).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@bp.route('/api/accounts/<int:aid>/sub-accounts', methods=['POST'])
def create_sub_account(aid):
    d = request.json
    conn = get_db()
    conn.execute(
        'INSERT INTO sub_accounts (account_id, code, name, display_order) VALUES (?,?,?,?)',
        (aid, d.get('code', ''), d['name'], d.get('display_order', 0))
    )
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok'})


@bp.route('/api/sub-accounts/<int:sid>', methods=['PUT'])
def update_sub_account(sid):
    d = request.json
    conn = get_db()
    conn.execute(
        'UPDATE sub_accounts SET name=?, display_order=? WHERE id=?',
        (d['name'], d.get('display_order', 0), sid)
    )
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok'})


@bp.route('/api/sub-accounts/<int:sid>', methods=['DELETE'])
def delete_sub_account(sid):
    conn = get_db()
    conn.execute('UPDATE sub_accounts SET is_active=0 WHERE id=?', (sid,))
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok'})
