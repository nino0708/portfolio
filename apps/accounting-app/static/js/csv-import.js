// CSV取込（自動仕訳）と起動
// 読み込み順は templates/index.html の <script> の並び。トップレベルの const/let/function は全ファイルで共有される。

// ===== CSV取込（自動仕訳） =====
// デビットカード履歴を「お金の動き」の正本にし、Amazon購入履歴で商品名・科目を補強する。
// 取り込み→自動で仕訳候補を生成→この画面でレビュー→一括登録、の順で安全に登録する。
const csvState = { debit: null, amazon: null, rows: [], existing: new Set() };

// --- 文字コード判定つきデコード（銀行CSVはShift_JISが多い） ---
function csvDecode(buf) {
  const utf8 = new TextDecoder('utf-8').decode(buf);
  if (utf8.includes('�')) {
    try { return new TextDecoder('shift_jis').decode(buf); } catch (e) { return utf8; }
  }
  return utf8;
}

// --- CSVパーサ（ダブルクオート対応） ---
function parseCSV(text) {
  text = text.replace(/^﻿/, '');
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; }
      else cur += ch;
    } else {
      if (ch === '"') q = true;
      else if (ch === ',') { row.push(cur); cur = ''; }
      else if (ch === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
      else if (ch === '\r') { /* skip */ }
      else cur += ch;
    }
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
  return rows.filter(r => r.some(c => (c || '').trim() !== ''));
}

function normalizeDate(s) {
  s = (s || '').trim();
  if (!s) return '';
  let m = s.match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);            // 2026/6/5, 2026年6月5日
  if (m) return `${m[1]}-${String(m[2]).padStart(2,'0')}-${String(m[3]).padStart(2,'0')}`;
  m = s.match(/^(\d{4})(\d{2})(\d{2})$/);                          // 20260605
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  return '';
}
function parseAmount(s) {
  if (s == null) return 0;
  s = String(s).replace(/[,¥￥円\s"]/g, '');
  const neg = /^\(.*\)$/.test(s) || /^-/.test(s) || /^▲|^△/.test(s);
  s = s.replace(/[()\-▲△]/g, '');
  const n = parseFloat(s);
  return isNaN(n) ? 0 : (neg ? -n : n);
}
function daysBetween(a, b) {
  return Math.abs((new Date(a) - new Date(b)) / 86400000);
}

// --- 列の自動マッピング ---
function findCol(header, patterns) {
  for (let i = 0; i < header.length; i++) {
    const h = (header[i] || '').toLowerCase();
    if (patterns.some(p => p.test(h))) return i;
  }
  return -1;
}
function detectHeaderRow(rows) {
  for (let i = 0; i < Math.min(rows.length, 15); i++) {
    if (findCol(rows[i], [/日付|年月日|取引日|date|ご利用日|注文日/]) >= 0) return i;
  }
  return 0;
}

// --- 科目の自動推定（過去の仕訳履歴＋汎用キーワード辞書。科目は決め打ちしない） ---
const CSV_KW = [
  { re: /交通|jr|電車|バス|タクシー|suica|pasmo|メトロ|鉄道|railway|高速|etc|ガソリン/, name: /交通|旅費|車/ },
  { re: /amazon|アマゾン|楽天|ヨドバシ|文具|事務|印刷|コピー|stationery/, name: /消耗|事務|備品|諸経費|雑費/ },
  { re: /コンビニ|セブン|ローソン|ファミマ|スーパー|食|飲|レストラン|カフェ|スタバ|starbucks|うどん|弁当/, name: /会議|交際|食|諸経費|雑費/ },
  { re: /電気|ガス|水道|電力|でんき/, name: /水道光熱|諸経費/ },
  { re: /携帯|docomo|au|softbank|通信|wifi|ネット|プロバイダ/, name: /通信|諸経費/ },
  { re: /会費|年会費|サブスク|subscription|プライム|prime/, name: /会費|諸経費|雑費/ },
];
function guessAccount(text, type, hist) {
  text = (text || '').toLowerCase();
  const pool = state.accounts.filter(a => a.account_type === type && a.is_active !== 0);
  if (!pool.length) return null;
  // ① 過去の仕訳履歴：摘要のトークンが一致する仕訳の相手科目を採用
  let best = null, bestScore = 0;
  (hist || []).forEach(h => {
    if (h.type !== type) return;
    const tokens = (h.desc || '').toLowerCase().split(/[\s　,、・/]+/).filter(t => t.length >= 2);
    let score = 0;
    tokens.forEach(t => { if (text.includes(t)) score += t.length; });
    if (score > bestScore) { bestScore = score; best = h.accId; }
  });
  if (best && pool.some(a => a.id === best)) return best;
  // ② キーワード辞書：該当する名前パターンの科目があれば採用
  for (const k of CSV_KW) {
    if (k.re.test(text)) {
      const hit = pool.find(a => k.name.test(a.name));
      if (hit) return hit.id;
    }
  }
  // ③ フォールバック：費用なら「諸経費/雑費」優先、無ければ先頭
  const misc = pool.find(a => /諸経費|雑費|その他/.test(a.name));
  return (misc || pool[0]).id;
}

// 過去の1対1仕訳から {desc, accId, type} の履歴を作る（科目推定の学習元）
function buildAccountHistory(entries) {
  const hist = [];
  (entries || []).forEach(e => {
    if (!(e.debit_lines && e.debit_lines.length === 1 && e.credit_lines && e.credit_lines.length === 1)) return;
    const d = e.debit_lines[0], c = e.credit_lines[0];
    const dt = (acById(d.account_id) || {}).account_type;
    const ct = (acById(c.account_id) || {}).account_type;
    if (dt === 'expense') hist.push({ desc: e.description || '', accId: d.account_id, type: 'expense' });
    if (ct === 'revenue') hist.push({ desc: e.description || '', accId: c.account_id, type: 'revenue' });
  });
  return hist;
}

// 決済科目（デビット引落元）の既定値を "accountId:subId" で返す。
// 「預金/銀行/口座」という補助科目を持つ資産科目を最優先（小口・現金は避ける）。
// 同名科目が複数期ぶん存在することがあるため、補助科目の有無で当たりを引く。
function defaultMoneySel() {
  const actives = state.accounts.filter(a => a.is_active !== 0 && a.account_type === 'asset');
  for (const a of actives) {
    const sub = (state.subAccounts[a.id] || []).find(s => /預金|口座|銀行|普通/.test(s.name));
    if (sub) return `${a.id}:${sub.id}`;
  }
  const acc = actives.find(a => /普通預金/.test(a.name))
           || actives.find(a => /現金|預金/.test(a.name))
           || actives[0];
  return acc ? `${acc.id}:` : '';
}

// --- 画面 ---
async function renderCsvImport(el) {
  // 重複登録の検知用に、既存仕訳の「日付|金額」セットを用意
  csvState.existing = new Set();
  try {
    const ex = await api('/entries');
    ex.forEach(e => csvState.existing.add(`${e.entry_date}|${Math.round(e.amount)}`));
  } catch (e) {}
  el.innerHTML = `
  <div class="card">
    <div class="card-header"><h2>CSV取込（自動仕訳）</h2></div>
    <p class="text-muted text-sm" style="margin:0 0 16px">
      デビットカード履歴を「お金の動き」の正本にし、Amazon購入履歴で商品名・科目を補強します。
      取り込み後に下のレビュー表で科目・金額を確認・修正してから一括登録します（いきなり本登録はしません）。
    </p>
    <div class="csv-uploads">
      <div class="csv-up">
        <label class="csv-label"><span class="material-symbols-rounded">credit_card</span> デビットカード履歴 CSV <b>（必須）</b></label>
        <input type="file" id="csvDebit" accept=".csv,text/csv">
      </div>
      <div class="csv-up">
        <label class="csv-label"><span class="material-symbols-rounded">shopping_cart</span> Amazon購入履歴 CSV <span class="text-muted">（任意・商品名の補強用）</span></label>
        <input type="file" id="csvAmazon" accept=".csv,text/csv">
      </div>
    </div>
    <div class="csv-opts">
      <label>決済科目（デビット引落元）
        <select id="csvMoney">${(() => { const m = parseAccountSel(defaultMoneySel()); return buildAccountOptions(m.account_id, m.sub_account_id); })()}</select>
      </label>
      <label>Amazon照合の日付許容差
        <select id="csvTol"><option value="0">±0日</option><option value="1">±1日</option><option value="3" selected>±3日</option><option value="7">±7日</option></select>
      </label>
      <button class="btn btn-primary" id="csvParseBtn">解析して仕訳候補を作る</button>
    </div>
    <div id="csvMsg" class="text-sm" style="margin-top:10px"></div>
  </div>
  <div id="csvReview"></div>`;

  document.getElementById('csvParseBtn').addEventListener('click', csvParse);
}

async function csvParse() {
  const msg = document.getElementById('csvMsg');
  const debitFile = document.getElementById('csvDebit').files[0];
  const amazonFile = document.getElementById('csvAmazon').files[0];
  if (!debitFile) { msg.innerHTML = '<span style="color:var(--danger)">デビットカード履歴CSVを選んでください</span>'; return; }
  msg.textContent = '解析中…';
  const moneySel = document.getElementById('csvMoney').value; // "accountId:subId"
  const tol = parseInt(document.getElementById('csvTol').value);

  let entries = [];
  try { entries = await api('/entries'); } catch (e) {}
  const hist = buildAccountHistory(entries);

  // --- デビットCSV ---
  const dbuf = await debitFile.arrayBuffer();
  const drows = parseCSV(csvDecode(dbuf));
  const dh = detectHeaderRow(drows);
  const dHeader = drows[dh];
  const cDate = findCol(dHeader, [/日付|年月日|取引日|date|ご利用日/]);
  const cOut = findCol(dHeader, [/出金|支払|お引出|引落|ご利用金額|withdraw|debit/]);
  const cIn = findCol(dHeader, [/入金|お預入|預入|deposit|credit/]);
  const cAmt = findCol(dHeader, [/金額|amount|total/]);
  const cDesc = findCol(dHeader, [/摘要|内容|お取引内容|description|備考|notes|memo|店名|加盟店/]);
  if (cDate < 0) { msg.innerHTML = '<span style="color:var(--danger)">日付の列が見つかりませんでした。CSVの形式を確認してください</span>'; return; }

  const cand = [];
  for (let i = dh + 1; i < drows.length; i++) {
    const r = drows[i];
    const date = normalizeDate(r[cDate]);
    if (!date) continue;
    let out = cOut >= 0 ? parseAmount(r[cOut]) : 0;
    let inc = cIn >= 0 ? parseAmount(r[cIn]) : 0;
    if (cOut < 0 && cIn < 0 && cAmt >= 0) { const v = parseAmount(r[cAmt]); if (v < 0) out = -v; else inc = v; }
    const desc = (cDesc >= 0 ? (r[cDesc] || '') : '').trim();
    if (out > 0) {
      cand.push({ date, amount: out, desc, debitSel: `${guessAccount(desc, 'expense', hist)}:`, creditSel: moneySel, dir: 'expense', src: 'デビット', amazon: '' });
    } else if (inc > 0) {
      cand.push({ date, amount: inc, desc, debitSel: moneySel, creditSel: `${guessAccount(desc, 'revenue', hist)}:`, dir: 'income', src: 'デビット', amazon: '' });
    }
  }

  // --- Amazon CSV（任意・補強） ---
  let amazonUnmatched = 0, amazonTotal = 0;
  if (amazonFile) {
    const abuf = await amazonFile.arrayBuffer();
    const arows = parseCSV(csvDecode(abuf));
    const ah = detectHeaderRow(arows);
    const aHeader = arows[ah];
    const aDate = findCol(aHeader, [/注文日|order date|日付|date/]);
    const aName = findCol(aHeader, [/商品名|product name|product|title|item|品名/]);
    const aAmt = findCol(aHeader, [/total owed|item total|金額|amount|price|合計|owed|total/]);
    const amz = [];
    for (let i = ah + 1; i < arows.length; i++) {
      const r = arows[i];
      const date = normalizeDate(r[aDate]);
      const amount = aAmt >= 0 ? Math.abs(parseAmount(r[aAmt])) : 0;
      const name = (aName >= 0 ? (r[aName] || '') : '').trim();
      if (!date || !amount) continue;
      amz.push({ date, amount, name, used: false });
    }
    amazonTotal = amz.length;
    // デビットの各出金に、金額一致＆日付が近いAmazon注文を割り当てて商品名で補強
    cand.forEach(c => {
      if (c.dir !== 'expense') return;
      let pick = null;
      amz.forEach(a => {
        if (a.used) return;
        if (Math.round(a.amount) !== Math.round(c.amount)) return;
        if (daysBetween(a.date, c.date) > tol) return;
        if (!pick || daysBetween(a.date, c.date) < daysBetween(pick.date, c.date)) pick = a;
      });
      if (pick) {
        pick.used = true;
        c.amazon = pick.name;
        c.src = 'デビット＋Amazon補強';
        if (pick.name) { c.desc = pick.name; c.debitSel = `${guessAccount(pick.name, 'expense', hist)}:`; }
      }
    });
    amazonUnmatched = amz.filter(a => !a.used).length;
  }

  // 重複登録の可能性をフラグ（同じ日付・金額が既に登録済み）
  cand.forEach(c => { c.dup = csvState.existing.has(`${c.date}|${Math.round(c.amount)}`); });
  csvState.rows = cand;

  const warn = [];
  if (amazonUnmatched) warn.push(`Amazon ${amazonUnmatched}/${amazonTotal} 件はデビット出金と一致せず（クレカ払い等の可能性）。重複防止のため登録対象外です。`);
  const dupCount = cand.filter(c => c.dup).length;
  if (dupCount) warn.push(`${dupCount} 件は既に登録済みの可能性があるため、チェックを外しています。`);
  msg.innerHTML = `仕訳候補 <b>${cand.length}</b> 件を作成しました。${warn.length ? '<br><span style="color:var(--warning,#b7791f)">⚠️ ' + warn.join('<br>⚠️ ') + '</span>' : ''}`;
  renderCsvReview();
}

function renderCsvReview() {
  const box = document.getElementById('csvReview');
  const rows = csvState.rows;
  if (!rows.length) { box.innerHTML = '<div class="card"><p class="text-muted">登録できる候補がありませんでした</p></div>'; return; }
  box.innerHTML = `
  <div class="card">
    <div class="card-header">
      <h2>仕訳候補のレビュー <span class="text-muted text-sm">(${rows.length}件)</span></h2>
      <button class="btn btn-primary" id="csvCommitBtn">チェックした仕訳を一括登録</button>
    </div>
    <div class="table-wrapper">
      <table>
        <thead><tr>
          <th><input type="checkbox" id="csvAll"></th>
          <th>日付</th><th>摘要</th><th>借方科目</th><th>貸方科目</th>
          <th class="text-right">金額</th><th>出所</th>
        </tr></thead>
        <tbody>
          ${rows.map((c, i) => `
          <tr class="csv-row ${c.dup ? 'csv-dup' : ''}" data-idx="${i}">
            <td><input type="checkbox" class="csv-inc" ${c.dup ? '' : 'checked'}></td>
            <td><input type="date" class="csv-date" value="${c.date}"></td>
            <td><input type="text" class="csv-desc" value="${(c.desc || '').replace(/"/g, '&quot;')}"></td>
            <td><select class="csv-debit">${(() => { const p = parseAccountSel(c.debitSel); return buildAccountOptions(p.account_id, p.sub_account_id); })()}</select></td>
            <td><select class="csv-credit">${(() => { const p = parseAccountSel(c.creditSel); return buildAccountOptions(p.account_id, p.sub_account_id); })()}</select></td>
            <td class="text-right"><input type="number" class="csv-amt text-right" value="${c.amount}" min="1" step="1"></td>
            <td class="text-sm text-muted">${c.src}${c.dup ? ' <span style="color:var(--danger)">／重複?</span>' : ''}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
  document.getElementById('csvAll').addEventListener('change', (e) => {
    box.querySelectorAll('.csv-inc').forEach(c => { c.checked = e.target.checked; });
  });
  document.getElementById('csvCommitBtn').addEventListener('click', csvCommit);
}

async function csvCommit() {
  const box = document.getElementById('csvReview');
  const entries = [];
  box.querySelectorAll('.csv-row').forEach(tr => {
    if (!tr.querySelector('.csv-inc').checked) return;
    const date = tr.querySelector('.csv-date').value;
    const desc = tr.querySelector('.csv-desc').value;
    const debit = parseAccountSel(tr.querySelector('.csv-debit').value);
    const credit = parseAccountSel(tr.querySelector('.csv-credit').value);
    const amount = yen(tr.querySelector('.csv-amt').value);
    if (!date || !amount || !debit.account_id || !credit.account_id) return;
    entries.push({
      entry_date: date, description: desc, memo: 'CSV取込',
      debit_lines: [{ account_id: debit.account_id, sub_account_id: debit.sub_account_id, amount }],
      credit_lines: [{ account_id: credit.account_id, sub_account_id: credit.sub_account_id, amount }],
    });
  });
  if (!entries.length) { alert('登録対象がありません（チェックを確認してください）'); return; }
  if (!confirm(`${entries.length} 件の仕訳を登録します。よろしいですか？`)) return;
  const r = await api('/entries/bulk', 'POST', { entries });
  let msg = `${r.saved} 件を登録しました。`;
  if (r.errors && r.errors.length) msg += `\n${r.errors.length} 件は登録できませんでした（貸借不一致など）。`;
  alert(msg);
  refreshIntegrity();
  navigate('ledger');
}

// 全スクリプトの読み込み後に起動する（他ファイルの関数を使うため最後に置く）
init();
