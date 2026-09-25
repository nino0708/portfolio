"""会計アプリの共通部分（DB接続・初期化・定数・計算ヘルパー）。ルートは routes/ にある。"""
import sqlite3
import os
import sys
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
