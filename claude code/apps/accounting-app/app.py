from flask import Flask, jsonify, request, render_template
import sqlite3
import os
import sys
import threading
import webbrowser
from datetime import datetime


def resource_path(rel):
    """同梱リソース（templates/static）の絶対パス。
       PyInstaller実行時は展開先(_MEIPASS)、開発時はこのファイルの場所を基準にする。"""
    base = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base, rel)


def app_data_dir():
    """DB等の書き込み先。exe化したらバンドル内は書けない/消えるので実行ファイルの隣に置く。
       開発時はこのプロジェクト直下。data/ 配下に accounting.db を作る。"""
    if getattr(sys, 'frozen', False):
        base = os.path.dirname(sys.executable)   # 実行ファイルと同じ場所（ポータブル運用）
    else:
        base = os.path.dirname(os.path.abspath(__file__))
    return base


app = Flask(__name__,
            template_folder=resource_path('templates'),
            static_folder=resource_path('static'))
DATABASE = os.path.join(app_data_dir(), 'data', 'accounting.db')

# ===== NPO法人会計基準：活動計算書の区分 =====
# 経常収益・経常費用・経常外の区分。pl_section にこのいずれかを入れる。
PL_REVENUE_SECTIONS = ['受取会費', '受取寄付金', '受取助成金等', '事業収益', 'その他収益']
PL_EXPENSE_SECTIONS = ['事業費', '管理費']
PL_EXTRA_REVENUE = '経常外収益'
PL_EXTRA_EXPENSE = '経常外費用'
PL_ALL_REVENUE = PL_REVENUE_SECTIONS + [PL_EXTRA_REVENUE]
PL_ALL_EXPENSE = PL_EXPENSE_SECTIONS + [PL_EXTRA_EXPENSE]

# 旧（営利向け）区分名。これらは活動計算書の区分へ移行する。
OLD_PL_SECTIONS = {'売上高', '営業外収益', '特別利益',
                   '売上原価', '販売費及び一般管理費', '営業外費用', '特別損失'}


def npo_pl_section(account_type, name, current=''):
    """営利向け区分・空欄を、科目名のヒントを使って活動計算書の区分へ割り当てる。
       初期割り当てなので、最終的な区分はユーザーが勘定科目設定で変更できる。"""
    name = name or ''
    if account_type == 'revenue':
        if '会費' in name:
            return '受取会費'
        if '寄付' in name or '寄附' in name:
            return '受取寄付金'
        if '助成' in name or '補助金' in name:
            return '受取助成金等'
        if current in ('営業外収益', '特別利益'):
            return PL_EXTRA_REVENUE
        return '事業収益'
    if account_type == 'expense':
        if current in ('営業外費用', '特別損失'):
            return PL_EXTRA_EXPENSE
        if current == '売上原価' or 'イベント' in name or '事業' in name:
            return '事業費'
        return '管理費'
    return ''


def get_db():
    os.makedirs(os.path.dirname(DATABASE), exist_ok=True)
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.executescript('''
        CREATE TABLE IF NOT EXISTS fiscal_periods (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            start_date TEXT NOT NULL,
            end_date TEXT NOT NULL,
            is_current INTEGER DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            account_type TEXT NOT NULL,
            category TEXT DEFAULT '',
            display_order INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1
        );
        CREATE TABLE IF NOT EXISTS sub_accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            account_id INTEGER NOT NULL,
            code TEXT NOT NULL,
            name TEXT NOT NULL,
            display_order INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1,
            FOREIGN KEY (account_id) REFERENCES accounts(id)
        );
        CREATE TABLE IF NOT EXISTS journal_entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            entry_date TEXT NOT NULL,
            description TEXT DEFAULT '',
            debit_account_id INTEGER NOT NULL,
            credit_account_id INTEGER NOT NULL,
            amount REAL NOT NULL,
            period_id INTEGER,
            memo TEXT DEFAULT '',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (debit_account_id) REFERENCES accounts(id),
            FOREIGN KEY (credit_account_id) REFERENCES accounts(id),
            FOREIGN KEY (period_id) REFERENCES fiscal_periods(id)
        );
    ''')

    # 明細行テーブル（複合仕訳対応）。1伝票に借方・貸方を複数行持てる
    conn.execute('''
        CREATE TABLE IF NOT EXISTS entry_lines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            entry_id INTEGER NOT NULL,
            side TEXT NOT NULL,
            account_id INTEGER NOT NULL,
            sub_account_id INTEGER,
            amount REAL NOT NULL,
            line_order INTEGER DEFAULT 0,
            FOREIGN KEY (entry_id) REFERENCES journal_entries(id),
            FOREIGN KEY (account_id) REFERENCES accounts(id),
            FOREIGN KEY (sub_account_id) REFERENCES sub_accounts(id)
        )
    ''')
    # 削除ログ（監査証跡）。仕訳を物理削除する前に、消した内容のスナップショットを残す。
    # entry_id は欠番になる元の伝票番号。後から「何を・いつ消したか」を追える。
    conn.execute('''
        CREATE TABLE IF NOT EXISTS deletion_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            entry_id INTEGER NOT NULL,
            entry_date TEXT,
            description TEXT DEFAULT '',
            memo TEXT DEFAULT '',
            amount REAL,
            detail TEXT DEFAULT '',
            deleted_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    # 変更ログ（監査証跡）。仕訳を上書き編集する前後の内容を残す。
    # before_detail＝変更前、after_detail＝変更後。あとから「何をどう直したか」を追える。
    conn.execute('''
        CREATE TABLE IF NOT EXISTS edit_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            entry_id INTEGER NOT NULL,
            entry_date TEXT,
            description TEXT DEFAULT '',
            memo TEXT DEFAULT '',
            amount REAL,
            before_detail TEXT DEFAULT '',
            after_detail TEXT DEFAULT '',
            edited_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    # 期首残高（期またぎ繰越）。ストック科目（資産・負債・正味財産）の期首残高を
    # 自然残高（資産=借方正 / 負債・正味財産=貸方正、いずれも正の値）で保持する。
    # 収益・費用はフロー科目なので期首残高を持たない。
    conn.execute('''
        CREATE TABLE IF NOT EXISTS opening_balances (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            period_id INTEGER NOT NULL,
            account_id INTEGER NOT NULL,
            amount REAL NOT NULL DEFAULT 0,
            UNIQUE(period_id, account_id),
            FOREIGN KEY (period_id) REFERENCES fiscal_periods(id),
            FOREIGN KEY (account_id) REFERENCES accounts(id)
        )
    ''')
    # 予実分析：会計期間ごと・収益/費用科目ごとの予算額
    conn.execute('''
        CREATE TABLE IF NOT EXISTS budgets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            period_id INTEGER NOT NULL,
            account_id INTEGER NOT NULL,
            amount REAL NOT NULL DEFAULT 0,
            UNIQUE(period_id, account_id),
            FOREIGN KEY (period_id) REFERENCES fiscal_periods(id),
            FOREIGN KEY (account_id) REFERENCES accounts(id)
        )
    ''')
    conn.commit()

    # migrations
    for ddl in [
        "ALTER TABLE accounts ADD COLUMN category TEXT DEFAULT ''",
        "ALTER TABLE journal_entries ADD COLUMN debit_sub_account_id INTEGER",
        "ALTER TABLE journal_entries ADD COLUMN credit_sub_account_id INTEGER",
        "ALTER TABLE accounts ADD COLUMN pl_section TEXT DEFAULT ''",
        # 期またぎ繰越の振替先となる正味財産科目を1つだけ指定するフラグ
        "ALTER TABLE accounts ADD COLUMN is_carryover INTEGER DEFAULT 0",
        # 会計期間の締め（ロック）。1=締め済みで仕訳の追加・編集・削除を禁止
        "ALTER TABLE fiscal_periods ADD COLUMN is_locked INTEGER DEFAULT 0",
    ]:
        try:
            conn.execute(ddl)
            conn.commit()
        except sqlite3.OperationalError:
            pass

    # NPO法人会計基準：営利向けの「繰越利益剰余金」を「前期繰越正味財産」に置き換える
    # （名前は後からユーザーが変更可能）。
    conn.execute(
        "UPDATE accounts SET name='前期繰越正味財産' WHERE code='3020' AND name='繰越利益剰余金'")
    # 繰越先（is_carryover）が「有効な正味財産科目」に付いていなければ自動指定する。
    # 無効科目に付いた印は当てにならないので一旦クリアしてから選び直す。
    if not conn.execute('SELECT id FROM accounts WHERE is_carryover=1 AND is_active=1').fetchone():
        conn.execute('UPDATE accounts SET is_carryover=0')
        row = conn.execute(
            "SELECT id FROM accounts WHERE account_type='equity' AND is_active=1 "
            "ORDER BY (name LIKE '%繰越%') DESC, (name LIKE '%正味財産%') DESC, "
            "(name LIKE '%剰余金%') DESC, display_order LIMIT 1").fetchone()
        if row:
            conn.execute('UPDATE accounts SET is_carryover=1 WHERE id=?', (row['id'],))
    conn.commit()

    # 既存の1対1仕訳を明細行へ移行（entry_lines が空のときだけ1回実行）
    has_old = conn.execute('SELECT COUNT(*) FROM journal_entries').fetchone()[0]
    has_new = conn.execute('SELECT COUNT(*) FROM entry_lines').fetchone()[0]
    if has_old and not has_new:
        for e in conn.execute('SELECT * FROM journal_entries').fetchall():
            e = dict(e)
            conn.execute(
                'INSERT INTO entry_lines (entry_id, side, account_id, sub_account_id, amount, line_order) VALUES (?,?,?,?,?,0)',
                (e['id'], 'debit', e['debit_account_id'], e.get('debit_sub_account_id'), e['amount']))
            conn.execute(
                'INSERT INTO entry_lines (entry_id, side, account_id, sub_account_id, amount, line_order) VALUES (?,?,?,?,?,0)',
                (e['id'], 'credit', e['credit_account_id'], e.get('credit_sub_account_id'), e['amount']))
        conn.commit()

    # NPO法人会計基準：pl_section を活動計算書の区分へ割り当て／移行する。
    # 旧（営利）区分名・空欄を新区分へ寄せる。既に新区分のものは触らない（冪等）。
    for r in conn.execute(
            "SELECT id, name, account_type, pl_section FROM accounts "
            "WHERE account_type IN ('revenue','expense')").fetchall():
        cur = r['pl_section'] or ''
        if cur == '' or cur in OLD_PL_SECTIONS:
            conn.execute('UPDATE accounts SET pl_section=? WHERE id=?',
                         (npo_pl_section(r['account_type'], r['name'], cur), r['id']))
    conn.commit()

    # 金額は円単位の整数で扱う。既存データに小数の端数があれば四捨五入で整数化（冪等）。
    for tbl in ('journal_entries', 'entry_lines', 'opening_balances'):
        conn.execute(f'UPDATE {tbl} SET amount=ROUND(amount) WHERE amount <> ROUND(amount)')
    conn.commit()

    count = conn.execute('SELECT COUNT(*) FROM accounts').fetchone()[0]
    if count == 0:
        # NPO法人会計基準向けの初期勘定科目（code, name, type, category, order, pl_section）
        defaults = [
            ('1010', '現金',              'asset',   '流動資産', 10,  ''),
            ('1020', '普通預金',           'asset',   '流動資産', 20,  ''),
            ('1110', '未収会費',           'asset',   '流動資産', 40,  ''),
            ('1120', '未収入金',           'asset',   '流動資産', 50,  ''),
            ('1130', '前払費用',           'asset',   '流動資産', 60,  ''),
            ('1300', '建物',               'asset',   '固定資産', 80,  ''),
            ('1320', '備品',               'asset',   '固定資産', 100, ''),
            ('2010', '未払金',             'liability', '流動負債', 210, ''),
            ('2030', '前受会費',           'liability', '流動負債', 220, ''),
            ('2040', '預り金',             'liability', '流動負債', 230, ''),
            ('2100', '短期借入金',          'liability', '流動負債', 240, ''),
            ('3020', '前期繰越正味財産',    'equity',  '正味財産', 310, ''),
            ('4010', '受取会費',           'revenue', '', 400, '受取会費'),
            ('4020', '受取寄付金',          'revenue', '', 410, '受取寄付金'),
            ('4030', '受取助成金等',        'revenue', '', 420, '受取助成金等'),
            ('4040', '事業収益',           'revenue', '', 430, '事業収益'),
            ('4050', '受取利息',           'revenue', '', 440, '経常外収益'),
            ('4060', '雑収入',             'revenue', '', 450, 'その他収益'),
            ('5010', '事業費',             'expense', '', 500, '事業費'),
            ('5020', '給料手当',           'expense', '', 510, '管理費'),
            ('5030', '法定福利費',          'expense', '', 520, '管理費'),
            ('5040', '地代家賃',           'expense', '', 530, '管理費'),
            ('5050', '水道光熱費',          'expense', '', 540, '管理費'),
            ('5060', '通信費',             'expense', '', 550, '管理費'),
            ('5070', '旅費交通費',          'expense', '', 560, '管理費'),
            ('5080', '消耗品費',           'expense', '', 570, '管理費'),
            ('5090', '会議費',             'expense', '', 580, '管理費'),
            ('5100', '支払手数料',          'expense', '', 590, '管理費'),
            ('5110', '減価償却費',          'expense', '', 600, '管理費'),
            ('5120', '雑費',               'expense', '', 610, '管理費'),
        ]
        conn.executemany(
            'INSERT INTO accounts (code, name, account_type, category, display_order, pl_section) VALUES (?,?,?,?,?,?)',
            defaults
        )
        # 繰越先（前期繰越正味財産）に印を付ける
        conn.execute("UPDATE accounts SET is_carryover=1 WHERE code='3020'")
        conn.commit()
    else:
        category_map = {
            '1010': '流動資産', '1020': '流動資産', '1030': '流動資産',
            '1110': '流動資産', '1120': '流動資産', '1130': '流動資産', '1200': '流動資産',
            '1300': '固定資産', '1310': '固定資産', '1320': '固定資産',
            '1330': '固定資産', '1340': '固定資産',
            '2010': '流動負債', '2020': '流動負債', '2030': '流動負債',
            '2040': '流動負債', '2100': '流動負債',
            '2200': '固定負債',
            '3010': '正味財産', '3020': '正味財産',
        }
        for code, cat in category_map.items():
            conn.execute(
                "UPDATE accounts SET category=? WHERE code=? AND (category='' OR category IS NULL)",
                (cat, code))

    today = datetime.now()
    current_fy = today.year if today.month >= 4 else today.year - 1
    existing_names = {r[0] for r in conn.execute('SELECT name FROM fiscal_periods').fetchall()}
    for y in range(2016, current_fy + 1):
        name = f'{y}年度'
        if name not in existing_names:
            conn.execute(
                'INSERT INTO fiscal_periods (name, start_date, end_date, is_current) VALUES (?,?,?,?)',
                (name, f'{y}-04-01', f'{y+1}-03-31', 0)
            )
    if not conn.execute('SELECT id FROM fiscal_periods WHERE is_current=1').fetchone():
        conn.execute(
            'UPDATE fiscal_periods SET is_current=1 WHERE name=?', (f'{current_fy}年度',)
        )
    conn.commit()
    conn.close()


def get_balances_for_period(period_id):
    conn = get_db()
    where = 'WHERE je.period_id = ?' if period_id else ''
    params = [period_id] if period_id else []
    dr = {r['account_id']: r['t'] for r in conn.execute(
        f"SELECT el.account_id, SUM(el.amount) t FROM entry_lines el JOIN journal_entries je ON el.entry_id = je.id {where} {'AND' if where else 'WHERE'} el.side='debit' GROUP BY el.account_id", params)}
    cr = {r['account_id']: r['t'] for r in conn.execute(
        f"SELECT el.account_id, SUM(el.amount) t FROM entry_lines el JOIN journal_entries je ON el.entry_id = je.id {where} {'AND' if where else 'WHERE'} el.side='credit' GROUP BY el.account_id", params)}
    # 期首残高をストック科目の借方/貸方合計に織り込む（資産=借方、負債・正味財産=貸方）。
    # こうすると残高計算・試算表の貸借平均・BS均衡がそのまま期首込みで成立する。
    opening = {}
    if period_id:
        opening = {r['account_id']: r['amount'] for r in conn.execute(
            'SELECT account_id, amount FROM opening_balances WHERE period_id=?', [period_id])}
    accounts = conn.execute('SELECT * FROM accounts WHERE is_active=1 ORDER BY display_order, code').fetchall()
    conn.close()
    result = {}
    for acc in accounts:
        a = dict(acc)
        d = dr.get(a['id'], 0)
        c = cr.get(a['id'], 0)
        ob = opening.get(a['id'], 0)
        if ob:
            if a['account_type'] == 'asset':
                d += ob
            elif a['account_type'] in ('liability', 'equity'):
                c += ob
        balance = d - c if a['account_type'] in ('asset', 'expense') else c - d
        result[a['id']] = {**a, 'balance': balance, 'total_debit': d, 'total_credit': c,
                           'opening': ob}
    return result


# ===== Fiscal Periods =====

@app.route('/api/periods', methods=['GET'])
def get_periods():
    conn = get_db()
    rows = conn.execute('SELECT * FROM fiscal_periods ORDER BY start_date DESC').fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route('/api/periods', methods=['POST'])
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


@app.route('/api/periods/<int:pid>', methods=['PUT'])
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


@app.route('/api/periods/<int:pid>', methods=['DELETE'])
def delete_period(pid):
    conn = get_db()
    conn.execute('DELETE FROM fiscal_periods WHERE id=?', (pid,))
    conn.execute('DELETE FROM opening_balances WHERE period_id=?', (pid,))
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok'})


@app.route('/api/periods/<int:pid>/lock', methods=['POST'])
def set_period_lock(pid):
    """会計期間を締める / 締めを解除する。"""
    locked = 1 if (request.json or {}).get('locked') else 0
    conn = get_db()
    conn.execute('UPDATE fiscal_periods SET is_locked=? WHERE id=?', (locked, pid))
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok', 'locked': bool(locked)})


# ===== 期締めロック =====

LOCK_MSG = 'この日付は締め済みの会計期間です。訂正は赤伝（逆仕訳）で行ってください。'


def period_locked(conn, period_id):
    """period_id（None可）が締め済みかを返す。"""
    if not period_id:
        return False
    row = conn.execute('SELECT is_locked FROM fiscal_periods WHERE id=?', (period_id,)).fetchone()
    return bool(row and row['is_locked'])


# ===== Opening Balances / Carry Forward =====

STOCK_TYPES = ('asset', 'liability', 'equity')
FLOW_TYPES = ('revenue', 'expense')


@app.route('/api/carryover-account', methods=['POST'])
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


@app.route('/api/periods/<int:pid>/opening-balances', methods=['GET'])
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


def _upsert_openings(conn, pid, items):
    """items: [{account_id, amount}]。ストック科目のみ・正の値のみ保存し、0は削除。"""
    valid = {a['id'] for a in conn.execute(
        "SELECT id FROM accounts WHERE account_type IN (?,?,?)", STOCK_TYPES)}
    for it in items:
        aid = it.get('account_id')
        if aid not in valid:
            continue
        amt = to_yen(it.get('amount') or 0)
        if amt:
            conn.execute(
                '''INSERT INTO opening_balances (period_id, account_id, amount) VALUES (?,?,?)
                   ON CONFLICT(period_id, account_id) DO UPDATE SET amount=excluded.amount''',
                (pid, aid, amt))
        else:
            conn.execute('DELETE FROM opening_balances WHERE period_id=? AND account_id=?', (pid, aid))


@app.route('/api/periods/<int:pid>/opening-balances', methods=['PUT'])
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


@app.route('/api/periods/<int:pid>/carry-forward', methods=['POST'])
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


# ===== Accounts =====

@app.route('/api/accounts', methods=['GET'])
def get_accounts():
    conn = get_db()
    rows = conn.execute('SELECT * FROM accounts WHERE is_active=1 ORDER BY display_order, code').fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route('/api/accounts', methods=['POST'])
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


@app.route('/api/accounts/<int:aid>', methods=['PUT'])
def update_account(aid):
    d = request.json
    conn = get_db()
    conn.execute(
        'UPDATE accounts SET name=?, account_type=?, category=?, display_order=?, pl_section=? WHERE id=?',
        (d['name'], d['account_type'], d.get('category', ''), d.get('display_order', 0), d.get('pl_section', ''), aid))
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok'})


@app.route('/api/accounts/<int:aid>', methods=['DELETE'])
def delete_account(aid):
    conn = get_db()
    conn.execute('UPDATE accounts SET is_active=0 WHERE id=?', (aid,))
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok'})


# ===== Sub Accounts =====

@app.route('/api/sub-accounts', methods=['GET'])
def get_all_sub_accounts():
    conn = get_db()
    rows = conn.execute(
        'SELECT * FROM sub_accounts WHERE is_active=1 ORDER BY account_id, display_order, code'
    ).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route('/api/accounts/<int:aid>/sub-accounts', methods=['GET'])
def get_sub_accounts(aid):
    conn = get_db()
    rows = conn.execute(
        'SELECT * FROM sub_accounts WHERE account_id=? AND is_active=1 ORDER BY display_order, code',
        (aid,)
    ).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route('/api/accounts/<int:aid>/sub-accounts', methods=['POST'])
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


@app.route('/api/sub-accounts/<int:sid>', methods=['PUT'])
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


@app.route('/api/sub-accounts/<int:sid>', methods=['DELETE'])
def delete_sub_account(sid):
    conn = get_db()
    conn.execute('UPDATE sub_accounts SET is_active=0 WHERE id=?', (sid,))
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok'})


# ===== Journal Entries =====

LINE_SELECT = '''
    SELECT el.id, el.entry_id, el.side, el.account_id, el.sub_account_id,
           el.amount, el.line_order,
           a.name account_name, a.code account_code,
           sa.name sub_account_name
    FROM entry_lines el
    JOIN accounts a ON el.account_id = a.id
    LEFT JOIN sub_accounts sa ON el.sub_account_id = sa.id
'''


def fetch_lines_by_entry(conn, entry_ids):
    """entry_id -> {'debit': [...], 'credit': [...]} を返す"""
    if not entry_ids:
        return {}
    ph = ','.join('?' * len(entry_ids))
    rows = conn.execute(
        f'{LINE_SELECT} WHERE el.entry_id IN ({ph}) ORDER BY el.side DESC, el.line_order, el.id',
        list(entry_ids)).fetchall()
    out = {}
    for r in rows:
        r = dict(r)
        bucket = out.setdefault(r['entry_id'], {'debit': [], 'credit': []})
        bucket[r['side']].append(r)
    return out


def serialize_entries(conn, headers):
    """journal_entries 行のリストに明細行をぶら下げて返す"""
    by_entry = fetch_lines_by_entry(conn, [h['id'] for h in headers])
    result = []
    for h in headers:
        h = dict(h)
        lines = by_entry.get(h['id'], {'debit': [], 'credit': []})
        debit_lines, credit_lines = lines['debit'], lines['credit']
        result.append({
            'id': h['id'], 'entry_date': h['entry_date'],
            'description': h.get('description', ''), 'memo': h.get('memo', ''),
            'period_id': h.get('period_id'), 'created_at': h.get('created_at'),
            'debit_lines': debit_lines, 'credit_lines': credit_lines,
            'amount': sum(l['amount'] for l in debit_lines),
        })
    return result


@app.route('/api/entries', methods=['GET'])
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


def detect_period(conn, entry_date):
    row = conn.execute(
        'SELECT id FROM fiscal_periods WHERE start_date <= ? AND end_date >= ? ORDER BY is_current DESC LIMIT 1',
        (entry_date, entry_date)
    ).fetchone()
    return row['id'] if row else None


def to_yen(x):
    """金額を円単位の整数に丸める（四捨五入・0からの距離で対称）。
       通貨を浮動小数点で持つと丸め誤差が出るため、保存・計算は常に整数円で扱う。"""
    x = float(x or 0)
    return int(x + 0.5) if x >= 0 else -int(-x + 0.5)


def normalize_lines(d):
    """借方・貸方の明細行を取り出して検証する。(debit_lines, credit_lines) を返す。
       金額は円単位の整数に正規化する。不正なら ValueError を投げる。"""
    def clean(items):
        out = []
        for it in (items or []):
            aid = it.get('account_id')
            amt = it.get('amount')
            if not aid or amt in (None, '', 0):
                continue
            amt = to_yen(amt)
            if amt <= 0:
                continue
            out.append({
                'account_id': int(aid),
                'sub_account_id': int(it['sub_account_id']) if it.get('sub_account_id') else None,
                'amount': amt,
            })
        return out

    debit = clean(d.get('debit_lines'))
    credit = clean(d.get('credit_lines'))
    if not debit or not credit:
        raise ValueError('借方・貸方をそれぞれ1行以上入力してください')
    if sum(l['amount'] for l in debit) != sum(l['amount'] for l in credit):
        raise ValueError('借方合計と貸方合計が一致していません')
    return debit, credit


def save_lines(conn, entry_id, debit, credit):
    conn.execute('DELETE FROM entry_lines WHERE entry_id=?', (entry_id,))
    for side, lines in (('debit', debit), ('credit', credit)):
        for i, l in enumerate(lines):
            conn.execute(
                'INSERT INTO entry_lines (entry_id, side, account_id, sub_account_id, amount, line_order) VALUES (?,?,?,?,?,?)',
                (entry_id, side, l['account_id'], l['sub_account_id'], l['amount'], i))


def entry_detail_text(conn, entry_id):
    """仕訳の明細を「借: 科目 金額 + … / 貸: …」の1行テキストにする（監査証跡用）。"""
    lines = conn.execute(
        f'{LINE_SELECT} WHERE el.entry_id=? ORDER BY el.side DESC, el.line_order, el.id', (entry_id,)).fetchall()

    def fmt_side(side):
        parts = [f"{r['account_name']}{('/' + r['sub_account_name']) if r['sub_account_name'] else ''} {r['amount']:,.0f}"
                 for r in lines if r['side'] == side]
        return ' + '.join(parts) if parts else '-'

    total = sum(r['amount'] for r in lines if r['side'] == 'debit')
    return f"借: {fmt_side('debit')} / 貸: {fmt_side('credit')}", total


@app.route('/api/entries', methods=['POST'])
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


@app.route('/api/entries/bulk', methods=['POST'])
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


@app.route('/api/entries/<int:eid>', methods=['PUT'])
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


@app.route('/api/entries/<int:eid>', methods=['DELETE'])
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


@app.route('/api/entries/<int:eid>/reverse', methods=['POST'])
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


@app.route('/api/deletion-log', methods=['GET'])
def get_deletion_log():
    conn = get_db()
    rows = [dict(r) for r in conn.execute(
        'SELECT * FROM deletion_log ORDER BY deleted_at DESC, id DESC').fetchall()]
    conn.close()
    return jsonify(rows)


@app.route('/api/change-log', methods=['GET'])
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


# ===== General Ledger =====

@app.route('/api/general-ledger', methods=['GET'])
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

@app.route('/api/trial-balance', methods=['GET'])
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

@app.route('/api/balance-sheet', methods=['GET'])
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

@app.route('/api/profit-loss', methods=['GET'])
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


# ===== 予実分析（予算実績対比） =====

def _flow_section(account_type, pl_section):
    """収益/費用科目を活動計算書の区分（経常収益/費用＋経常外）に割り当てる。
       get_profit_loss と同じ寄せ方で、未設定は事業収益/管理費に寄せる。"""
    sec = pl_section or ''
    if account_type == 'revenue':
        return sec if sec in PL_ALL_REVENUE else '事業収益'
    return sec if sec in PL_ALL_EXPENSE else '管理費'


def _upsert_budgets(conn, pid, items):
    """items: [{account_id, amount}]。収益/費用科目のみ・正の値のみ保存し、0は削除。"""
    valid = {a['id'] for a in conn.execute(
        "SELECT id FROM accounts WHERE account_type IN (?,?)", FLOW_TYPES)}
    for it in items:
        aid = it.get('account_id')
        if aid not in valid:
            continue
        amt = to_yen(it.get('amount') or 0)
        if amt:
            conn.execute(
                '''INSERT INTO budgets (period_id, account_id, amount) VALUES (?,?,?)
                   ON CONFLICT(period_id, account_id) DO UPDATE SET amount=excluded.amount''',
                (pid, aid, amt))
        else:
            conn.execute('DELETE FROM budgets WHERE period_id=? AND account_id=?', (pid, aid))


@app.route('/api/periods/<int:pid>/budgets', methods=['PUT'])
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


@app.route('/api/budget-actual', methods=['GET'])
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


# ===== 月次推移表 =====

def _enum_months(start_ym, end_ym):
    """'YYYY-MM' 〜 'YYYY-MM' を月単位で列挙する（両端含む）。"""
    if not start_ym or not end_ym:
        return []
    sy, sm = int(start_ym[:4]), int(start_ym[5:7])
    ey, em = int(end_ym[:4]), int(end_ym[5:7])
    months = []
    y, m = sy, sm
    while (y, m) <= (ey, em) and len(months) < 120:  # 上限10年で暴走防止
        months.append(f'{y:04d}-{m:02d}')
        m += 1
        if m > 12:
            m = 1
            y += 1
    return months


@app.route('/api/monthly-trend', methods=['GET'])
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

@app.route('/api/audit-report', methods=['GET'])
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

@app.route('/api/integrity', methods=['GET'])
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


# ===== Export / Import =====

@app.route('/api/export', methods=['GET'])
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


@app.route('/api/import', methods=['POST'])
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


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/manual')
def manual():
    return render_template('manual.html')


def main():
    init_db()
    url = 'http://localhost:5050'
    print(f'Kaikei 会計管理 を起動しました → {url}')
    print('終了するにはこのウィンドウを閉じてください。')
    print(f'データの保存先: {DATABASE}')
    # use_reloader=False: exe化したときに自分自身を再起動して多重起動するのを防ぐ
    threading.Timer(1.2, lambda: webbrowser.open(url)).start()
    app.run(debug=False, port=5050, use_reloader=False)


if __name__ == '__main__':
    main()
