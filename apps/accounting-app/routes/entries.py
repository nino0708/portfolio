"""仕訳の登録・修正・削除・赤伝と、変更/削除履歴のAPI。"""
from flask import Blueprint, jsonify, request

from common import (
    datetime,
    get_db,
    LOCK_MSG,
    period_locked,
    serialize_entries,
    detect_period,
    to_yen,
    normalize_lines,
    save_lines,
    entry_detail_text,
)

bp = Blueprint('entries', __name__)


@bp.route('/api/entries', methods=['GET'])
def get_entries():
    period_id = request.args.get('period_id')
    conn = get_db()
    where = 'WHERE je.period_id = ?' if period_id else ''
    params = [period_id] if period_id else []
    headers = conn.execute(
        f'SELECT * FROM journal_entries je {where} ORDER BY je.entry_date, je.id', params).fetchall()
    result = serialize_entries(conn, headers)
    conn.close()
    return jsonify(result)


@bp.route('/api/entries', methods=['POST'])
def create_entry():
    d = request.json
    try:
        debit, credit = normalize_lines(d)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    conn = get_db()
    period_id = detect_period(conn, d['entry_date'])
    if period_locked(conn, period_id):
        conn.close()
        return jsonify({'error': LOCK_MSG}), 400
    # 旧列(NOT NULL)は先頭行と合計で埋める。集計には使わず後方互換のための代表値
    total = sum(l['amount'] for l in debit)
    cur = conn.execute(
        '''INSERT INTO journal_entries
           (entry_date, description, debit_account_id, credit_account_id, amount,
            period_id, memo, debit_sub_account_id, credit_sub_account_id)
           VALUES (?,?,?,?,?,?,?,?,?)''',
        (d['entry_date'], d.get('description', ''), debit[0]['account_id'], credit[0]['account_id'],
         total, period_id, d.get('memo', ''),
         debit[0]['sub_account_id'], credit[0]['sub_account_id']))
    save_lines(conn, cur.lastrowid, debit, credit)
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok'})


@bp.route('/api/entries/bulk', methods=['POST'])
def create_entries_bulk():
    """CSV取込のレビュー後に、確定した仕訳をまとめて登録する。
       1件でも貸借不一致などがあればその行だけスキップし、結果を返す。"""
    items = (request.json or {}).get('entries', [])
    conn = get_db()
    saved, errors = 0, []
    for i, d in enumerate(items):
        try:
            debit, credit = normalize_lines(d)
        except ValueError as e:
            errors.append({'row': i, 'error': str(e)})
            continue
        period_id = detect_period(conn, d['entry_date'])
        if period_locked(conn, period_id):
            errors.append({'row': i, 'error': LOCK_MSG})
            continue
        total = sum(l['amount'] for l in debit)
        cur = conn.execute(
            '''INSERT INTO journal_entries
               (entry_date, description, debit_account_id, credit_account_id, amount,
                period_id, memo, debit_sub_account_id, credit_sub_account_id)
               VALUES (?,?,?,?,?,?,?,?,?)''',
            (d['entry_date'], d.get('description', ''), debit[0]['account_id'], credit[0]['account_id'],
             total, period_id, d.get('memo', ''),
             debit[0]['sub_account_id'], credit[0]['sub_account_id']))
        save_lines(conn, cur.lastrowid, debit, credit)
        saved += 1
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok', 'saved': saved, 'errors': errors})


@bp.route('/api/entries/<int:eid>', methods=['PUT'])
def update_entry(eid):
    d = request.json
    try:
        debit, credit = normalize_lines(d)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    conn = get_db()
    # 上書き前の内容をスナップショット（変更履歴に残す）
    before_detail, _ = entry_detail_text(conn, eid)
    old_head = conn.execute('SELECT * FROM journal_entries WHERE id=?', (eid,)).fetchone()

    period_id = detect_period(conn, d['entry_date'])
    # 元の期・新しい期のどちらかが締め済みなら編集不可
    if (old_head and period_locked(conn, old_head['period_id'])) or period_locked(conn, period_id):
        conn.close()
        return jsonify({'error': LOCK_MSG}), 400
    total = sum(l['amount'] for l in debit)
    conn.execute(
        '''UPDATE journal_entries
           SET entry_date=?, description=?, debit_account_id=?, credit_account_id=?, amount=?,
               period_id=?, memo=?, debit_sub_account_id=?, credit_sub_account_id=?
           WHERE id=?''',
        (d['entry_date'], d.get('description', ''), debit[0]['account_id'], credit[0]['account_id'],
         total, period_id, d.get('memo', ''),
         debit[0]['sub_account_id'], credit[0]['sub_account_id'], eid))
    save_lines(conn, eid, debit, credit)

    after_detail, _ = entry_detail_text(conn, eid)
    if old_head:
        conn.execute(
            '''INSERT INTO edit_log
               (entry_id, entry_date, description, memo, amount, before_detail, after_detail)
               VALUES (?,?,?,?,?,?,?)''',
            (eid, d['entry_date'], d.get('description', ''), d.get('memo', ''),
             total, before_detail, after_detail))
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok'})


@bp.route('/api/entries/<int:eid>', methods=['DELETE'])
def delete_entry(eid):
    conn = get_db()
    head = conn.execute('SELECT * FROM journal_entries WHERE id=?', (eid,)).fetchone()
    if head and period_locked(conn, head['period_id']):
        conn.close()
        return jsonify({'error': LOCK_MSG}), 400
    if head:
        head = dict(head)
        # 消す前に仕訳の中身をテキスト化してログに残す（あとから何を消したか追える）
        detail, total = entry_detail_text(conn, eid)
        conn.execute(
            'INSERT INTO deletion_log (entry_id, entry_date, description, memo, amount, detail) VALUES (?,?,?,?,?,?)',
            (eid, head['entry_date'], head.get('description', ''), head.get('memo', ''), total, detail))
    conn.execute('DELETE FROM entry_lines WHERE entry_id=?', (eid,))
    conn.execute('DELETE FROM journal_entries WHERE id=?', (eid,))
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok'})


@bp.route('/api/entries/<int:eid>/reverse', methods=['POST'])
def reverse_entry(eid):
    """赤伝（逆仕訳）。元仕訳の借方・貸方を入れ替えた取消仕訳を新規作成する。
       元仕訳はそのまま残す（訂正の証跡）。"""
    conn = get_db()
    head = conn.execute('SELECT * FROM journal_entries WHERE id=?', (eid,)).fetchone()
    if not head:
        conn.close()
        return jsonify({'error': '元の仕訳が見つかりません'}), 404
    head = dict(head)
    src = conn.execute(
        'SELECT side, account_id, sub_account_id, amount, line_order FROM entry_lines WHERE entry_id=?',
        (eid,)).fetchall()
    if not src:
        conn.close()
        return jsonify({'error': '明細のない仕訳は取消できません'}), 400

    # 借方↔貸方を入れ替えて取消仕訳の明細を作る
    flip = {'debit': 'credit', 'credit': 'debit'}
    debit = [{'account_id': r['account_id'], 'sub_account_id': r['sub_account_id'], 'amount': to_yen(r['amount'])}
             for r in src if flip[r['side']] == 'debit']
    credit = [{'account_id': r['account_id'], 'sub_account_id': r['sub_account_id'], 'amount': to_yen(r['amount'])}
              for r in src if flip[r['side']] == 'credit']

    # 既定は元仕訳と同じ日付（同一会計期間内で相殺される）。明示指定があればそれを使う。
    rev_date = (request.json or {}).get('entry_date') or head['entry_date']
    # 元仕訳が締め済みの期にある場合、その日付では登録できないので当期（未締め）へ振り替える。
    if not (request.json or {}).get('entry_date') and period_locked(conn, head['period_id']):
        cur_p = conn.execute('SELECT * FROM fiscal_periods WHERE is_current=1 AND is_locked=0').fetchone()
        if not cur_p:
            cur_p = conn.execute(
                'SELECT * FROM fiscal_periods WHERE is_locked=0 ORDER BY end_date DESC LIMIT 1').fetchone()
        if not cur_p:
            conn.close()
            return jsonify({'error': '赤伝を登録できる未締めの会計期間がありません。'}), 400
        today = datetime.now().strftime('%Y-%m-%d')
        rev_date = today if cur_p['start_date'] <= today <= cur_p['end_date'] else cur_p['end_date']

    desc = f"【赤伝】No.{eid} {head.get('description', '')}".strip()
    memo = f"仕訳No.{eid} の取消"
    period_id = detect_period(conn, rev_date)
    if period_locked(conn, period_id):
        conn.close()
        return jsonify({'error': '赤伝の登録先が締め済みの会計期間です。日付を未締めの期間にしてください。'}), 400
    total = sum(l['amount'] for l in debit)
    cur = conn.execute(
        '''INSERT INTO journal_entries
           (entry_date, description, debit_account_id, credit_account_id, amount,
            period_id, memo, debit_sub_account_id, credit_sub_account_id)
           VALUES (?,?,?,?,?,?,?,?,?)''',
        (rev_date, desc, debit[0]['account_id'], credit[0]['account_id'],
         total, period_id, memo, debit[0]['sub_account_id'], credit[0]['sub_account_id']))
    save_lines(conn, cur.lastrowid, debit, credit)
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok', 'reversed_from': eid, 'new_id': cur.lastrowid})


@bp.route('/api/deletion-log', methods=['GET'])
def get_deletion_log():
    conn = get_db()
    rows = [dict(r) for r in conn.execute(
        'SELECT * FROM deletion_log ORDER BY deleted_at DESC, id DESC').fetchall()]
    conn.close()
    return jsonify(rows)


@bp.route('/api/change-log', methods=['GET'])
def get_change_log():
    """変更（編集）と削除の証跡を時系列で1本にまとめて返す。"""
    conn = get_db()
    edits = [{**dict(r), 'kind': 'edit', 'at': r['edited_at']}
             for r in conn.execute('SELECT * FROM edit_log').fetchall()]
    dels = [{**dict(r), 'kind': 'delete', 'at': r['deleted_at']}
            for r in conn.execute('SELECT * FROM deletion_log').fetchall()]
    conn.close()
    merged = sorted(edits + dels, key=lambda x: (x['at'] or '', x['id']), reverse=True)
    return jsonify(merged)
