"""2026年度（period_id=36）にダミーの予算・実績を投入する一回限りのスクリプト。
- 既に2026年度に仕訳がある場合は安全のため実績投入をスキップ（重複防止）。
- 予算は UNIQUE(period_id,account_id) で upsert なので何度でも実行可。
- 仕訳はすべて複式（借方=貸方）で入れるため貸借対照表は自動的に均衡する。
"""
import sqlite3

DB = 'data/accounting.db'
PID = 36  # 2026年度（2026-04-01〜2027-03-31）

# --- アクティブ科目ID（DB実体に合わせる） ---
CASH = 40        # 現金
RECV = 62        # 未収入金
PREPAID = 63     # 前払金
EQUITY = 66      # 剰余金（繰越）

# 収益
IEC_FEE = 45     # IEC会費
EV_SPRING = 47   # イベント会費（春）
EV_SUMMER = 51   # イベント会費（夏）
EV_YEAREND = 52  # イベント会費（忘年会）
EV_SUPPORT = 53  # イベント会費（会社支援金）
OTHER_REV = 60   # その他利益（経常外）

# 費用
OP_SPRING = 54   # イベント運営費（春）
OP_SUMMER = 55   # イベント運営費（夏）
OP_YEAREND = 56  # イベント運営費（忘年会）
TRANSPORT = 57   # 交通費（管理）
MEETING = 58     # 会議費（管理）
MISC_EXP = 59    # 諸経費（管理）
OTHER_EXP = 61   # その他費用（経常外）

# --- 予算（年間目標） ---
BUDGETS = {
    IEC_FEE: 360000,
    EV_SPRING: 450000,
    EV_SUMMER: 500000,
    EV_YEAREND: 800000,
    EV_SUPPORT: 100000,
    OTHER_REV: 20000,
    OP_SPRING: 400000,
    OP_SUMMER: 480000,
    OP_YEAREND: 750000,
    TRANSPORT: 120000,
    MEETING: 80000,
    MISC_EXP: 100000,
    OTHER_EXP: 30000,
}

# --- 実績仕訳（date, description, debit_id, credit_id, amount） ---
# 予算の90〜110%付近に着地させ、達成率・差異が意味を持つようにする。
ENTRIES = [
    # 期首：会社支援金（現金注入）
    ('2026-04-05', 'IEC 年度会社支援金', CASH, EV_SUPPORT, 100000),
    # IEC会費（合計 372,000）
    ('2026-04-10', 'IEC年次会費 幹部', CASH, IEC_FEE, 108000),
    ('2026-04-10', 'IEC年次会費 社員', CASH, IEC_FEE, 216000),
    ('2026-05-12', 'IEC追加会費', CASH, IEC_FEE, 48000),
    # 管理費（交通費 / 会議費 / 諸経費）
    ('2026-04-20', '定例会 交通費', TRANSPORT, CASH, 9500),
    ('2026-06-18', '定例会 交通費', TRANSPORT, CASH, 11200),
    ('2026-09-14', '幹部会 交通費', TRANSPORT, CASH, 38000),
    ('2026-11-22', '出張 交通費', TRANSPORT, CASH, 56300),
    ('2026-05-09', '5月度 会議費', MEETING, CASH, 18000),
    ('2026-08-08', '8月度 会議費', MEETING, CASH, 22000),
    ('2026-12-05', '年末 会議費', MEETING, CASH, 36000),
    ('2026-04-25', '銀行振込手数料ほか 諸経費', MISC_EXP, CASH, 12400),
    ('2026-07-30', '事務用品 諸経費', MISC_EXP, CASH, 41600),
    ('2026-10-18', '通信・郵送 諸経費', MISC_EXP, CASH, 54000),
    # 春イベント（収益 432,000 / 費用 395,000）
    ('2026-05-15', '春イベント 会場手付金', PREPAID, CASH, 120000),
    ('2026-05-25', '春イベント 参加費（未収）', RECV, EV_SPRING, 432000),
    ('2026-06-02', '春イベント 参加費 入金', CASH, RECV, 432000),
    ('2026-06-05', '春イベント 会場残金', OP_SPRING, PREPAID, 120000),
    ('2026-06-05', '春イベント 会場残金支払', OP_SPRING, CASH, 95000),
    ('2026-06-06', '春イベント 景品・記念品', OP_SPRING, CASH, 180000),
    # 夏イベント（収益 510,000 / 費用 492,000）
    ('2026-07-20', '夏イベント 参加費', CASH, EV_SUMMER, 510000),
    ('2026-08-22', '夏イベント 会場費', OP_SUMMER, CASH, 240000),
    ('2026-08-22', '夏イベント 景品・消耗品', OP_SUMMER, CASH, 252000),
    # 忘年会（収益 790,000 / 費用 738,000）
    ('2026-12-10', '忘年会 参加費（未収）', RECV, EV_YEAREND, 790000),
    ('2026-12-20', '忘年会 参加費 入金', CASH, RECV, 790000),
    ('2026-12-20', '忘年会 会場・飲食', OP_YEAREND, CASH, 520000),
    ('2026-12-21', '忘年会 景品・記念品', OP_YEAREND, CASH, 218000),
    # 経常外
    ('2026-09-30', '受取利息', CASH, OTHER_REV, 8500),
    ('2027-01-15', 'キャンセル料収入', CASH, OTHER_REV, 10000),
    ('2026-07-10', '慶弔費', OTHER_EXP, CASH, 20000),
    ('2027-02-28', '銀行手数料ほか', OTHER_EXP, CASH, 8600),
]


def main():
    conn = sqlite3.connect(DB)
    cur = conn.cursor()

    # 予算 upsert
    for aid, amt in BUDGETS.items():
        cur.execute(
            '''INSERT INTO budgets (period_id, account_id, amount) VALUES (?,?,?)
               ON CONFLICT(period_id, account_id) DO UPDATE SET amount=excluded.amount''',
            (PID, aid, amt))
    print(f'予算: {len(BUDGETS)}科目を設定')

    # 実績：既に仕訳があればスキップ（重複防止）
    n = cur.execute('SELECT COUNT(*) FROM journal_entries WHERE period_id=?', (PID,)).fetchone()[0]
    if n:
        print(f'2026年度に既に{n}件の仕訳あり → 実績投入はスキップ')
    else:
        for date, desc, dr, crd, amt in ENTRIES:
            cur.execute(
                '''INSERT INTO journal_entries
                   (entry_date, description, debit_account_id, credit_account_id, amount, period_id)
                   VALUES (?,?,?,?,?,?)''',
                (date, desc, dr, crd, amt, PID))
            eid = cur.lastrowid
            cur.execute(
                'INSERT INTO entry_lines (entry_id, side, account_id, amount, line_order) VALUES (?,?,?,?,0)',
                (eid, 'debit', dr, amt))
            cur.execute(
                'INSERT INTO entry_lines (entry_id, side, account_id, amount, line_order) VALUES (?,?,?,?,0)',
                (eid, 'credit', crd, amt))
        print(f'実績: {len(ENTRIES)}件の仕訳を投入')

    conn.commit()
    conn.close()


if __name__ == '__main__':
    main()
