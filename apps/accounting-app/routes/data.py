"""データのエクスポート/インポートのAPI。"""
from flask import Blueprint, jsonify, request

from common import (
    datetime,
    get_db,
)

bp = Blueprint('data', __name__)


# ===== Export / Import =====

@bp.route('/api/export', methods=['GET'])
def export_data():
    conn = get_db()
    data = {
        'accounts': [dict(r) for r in conn.execute('SELECT * FROM accounts').fetchall()],
        'sub_accounts': [dict(r) for r in conn.execute('SELECT * FROM sub_accounts').fetchall()],
        'fiscal_periods': [dict(r) for r in conn.execute('SELECT * FROM fiscal_periods').fetchall()],
        'journal_entries': [dict(r) for r in conn.execute('SELECT * FROM journal_entries').fetchall()],
        'entry_lines': [dict(r) for r in conn.execute('SELECT * FROM entry_lines').fetchall()],
        'deletion_log': [dict(r) for r in conn.execute('SELECT * FROM deletion_log').fetchall()],
        'edit_log': [dict(r) for r in conn.execute('SELECT * FROM edit_log').fetchall()],
        'opening_balances': [dict(r) for r in conn.execute('SELECT * FROM opening_balances').fetchall()],
        'budgets': [dict(r) for r in conn.execute('SELECT * FROM budgets').fetchall()],
        'exported_at': datetime.now().isoformat()
    }
    conn.close()
    return jsonify(data)


@bp.route('/api/import', methods=['POST'])
def import_data():
    data = request.json
    conn = get_db()
    imported = 0
    has_lines = bool(data.get('entry_lines'))
    for entry in data.get('journal_entries', []):
        exists = conn.execute('SELECT id FROM journal_entries WHERE id=?', (entry['id'],)).fetchone()
        if not exists:
            conn.execute('''
                INSERT INTO journal_entries
                  (id, entry_date, description, debit_account_id, credit_account_id, amount,
                   period_id, memo, debit_sub_account_id, credit_sub_account_id, created_at)
                VALUES (?,?,?,?,?,?,?,?,?,?,?)
            ''', (entry.get('id'), entry['entry_date'], entry.get('description', ''),
                  entry['debit_account_id'], entry['credit_account_id'], entry['amount'],
                  entry.get('period_id'), entry.get('memo', ''),
                  entry.get('debit_sub_account_id'), entry.get('credit_sub_account_id'),
                  entry.get('created_at', datetime.now().isoformat())))
            # 明細行が無い旧フォーマットは1対1から復元
            if not has_lines:
                for side, acc, sub in (('debit', entry['debit_account_id'], entry.get('debit_sub_account_id')),
                                       ('credit', entry['credit_account_id'], entry.get('credit_sub_account_id'))):
                    conn.execute(
                        'INSERT INTO entry_lines (entry_id, side, account_id, sub_account_id, amount, line_order) VALUES (?,?,?,?,?,0)',
                        (entry['id'], side, acc, sub, entry['amount']))
            imported += 1
    for line in data.get('entry_lines', []):
        exists = conn.execute('SELECT id FROM entry_lines WHERE id=?', (line['id'],)).fetchone()
        if not exists:
            conn.execute(
                'INSERT INTO entry_lines (id, entry_id, side, account_id, sub_account_id, amount, line_order) VALUES (?,?,?,?,?,?,?)',
                (line.get('id'), line['entry_id'], line['side'], line['account_id'],
                 line.get('sub_account_id'), line['amount'], line.get('line_order', 0)))
    for log in data.get('deletion_log', []):
        exists = conn.execute('SELECT id FROM deletion_log WHERE id=?', (log['id'],)).fetchone()
        if not exists:
            conn.execute(
                'INSERT INTO deletion_log (id, entry_id, entry_date, description, memo, amount, detail, deleted_at) VALUES (?,?,?,?,?,?,?,?)',
                (log.get('id'), log['entry_id'], log.get('entry_date'), log.get('description', ''),
                 log.get('memo', ''), log.get('amount'), log.get('detail', ''), log.get('deleted_at')))
    for log in data.get('edit_log', []):
        exists = conn.execute('SELECT id FROM edit_log WHERE id=?', (log['id'],)).fetchone()
        if not exists:
            conn.execute(
                '''INSERT INTO edit_log (id, entry_id, entry_date, description, memo, amount, before_detail, after_detail, edited_at)
                   VALUES (?,?,?,?,?,?,?,?,?)''',
                (log.get('id'), log['entry_id'], log.get('entry_date'), log.get('description', ''),
                 log.get('memo', ''), log.get('amount'), log.get('before_detail', ''),
                 log.get('after_detail', ''), log.get('edited_at')))
    for ob in data.get('opening_balances', []):
        conn.execute(
            '''INSERT INTO opening_balances (period_id, account_id, amount) VALUES (?,?,?)
               ON CONFLICT(period_id, account_id) DO UPDATE SET amount=excluded.amount''',
            (ob['period_id'], ob['account_id'], ob.get('amount', 0)))
    for bg in data.get('budgets', []):
        conn.execute(
            '''INSERT INTO budgets (period_id, account_id, amount) VALUES (?,?,?)
               ON CONFLICT(period_id, account_id) DO UPDATE SET amount=excluded.amount''',
            (bg['period_id'], bg['account_id'], bg.get('amount', 0)))
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok', 'imported': imported})
