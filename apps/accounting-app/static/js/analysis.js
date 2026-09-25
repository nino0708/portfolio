// 純資産変動計算書・月次推移・監査レポート・イベント収支
// 読み込み順は templates/index.html の <script> の並び。トップレベルの const/let/function は全ファイルで共有される。

// ===== 株主資本等変動計算書（純資産変動計算書） =====
// 純資産（剰余金）が期首からどう増減して期末残高になったかを示す。
// 当期正味財産増減額は「繰越剰余金」に相当する純資産科目へ計上する。
async function renderSS(el) {
  const qs = state.currentPeriodId ? `?period_id=${state.currentPeriodId}` : '';
  const [bs, pl] = await Promise.all([
    api(`/balance-sheet${qs}`),
    api(`/profit-loss${qs}`),
  ]);
  const t = pl.totals;
  const net = t['当期正味財産増減額'] || 0;            // 当期剰余金（活動による増減）
  const periodName = (state.periods.find(p => p.id == state.currentPeriodId) || {}).name || '全期間';

  // BSのequityのうち実科目のみ（当期増減の合成行 id=null は除く）
  const equityAccts = bs.equity.filter(e => e.id != null);

  // 当期剰余金を計上する繰越科目を1つ選ぶ（繰越・剰余を含む名前を優先）
  const target = equityAccts.find(e => /繰越|剰余/.test(e.name)) || equityAccts[0];

  // 列＝各純資産科目。科目が無ければ合成「繰越剰余金」列を1つ用意。
  let cols = equityAccts.map(e => ({
    name: e.name,
    opening: e.opening || 0,
    other: (e.balance || 0) - (e.opening || 0),       // 期中の純資産への直接記帳（通常は0）
    income: (target && e === target) ? net : 0,
  }));
  if (!cols.length) cols = [{ name: '繰越剰余金', opening: 0, other: 0, income: net }];

  const hasOther = cols.some(c => Math.abs(c.other) > 0.5);
  const colVar = (c) => c.other + c.income;            // 当期変動額合計
  const colEnd = (c) => c.opening + c.other + c.income;// 当期末残高
  const sum = (fn) => cols.reduce((a, c) => a + fn(c), 0);

  const cells = (fn) => cols.map(c => `<td class="text-right amount">${fmt(fn(c))}</td>`).join('');
  const dataRow = (label, fn, indent) =>
    `<tr><td style="${indent ? 'padding-left:28px;' : ''}">${label}</td>${cells(fn)}<td class="text-right amount">${fmt(sum(fn))}</td></tr>`;

  const colHeads = cols.map(c => `<th class="text-right">${c.name}</th>`).join('');
  const totalVar = sum(colVar);
  const mismatch = Math.abs(sum(colEnd) - (t['次期繰越正味財産'] || 0));

  el.innerHTML = `
  <div class="card">
    <div class="card-header">
      <h2>株主資本等変動計算書 <span class="text-muted text-sm">純資産（剰余金）変動計算書</span></h2>
      <button class="btn btn-secondary btn-sm" onclick="window.print()">印刷</button>
    </div>
    <p class="text-muted text-sm" style="margin:0 0 14px">
      <strong>${periodName}</strong> の純資産（剰余金）が、期首残高からどう増減して期末残高になったかを示します。
    </p>
    <table>
      <thead>
        <tr><th>変動事由</th>${colHeads}<th class="text-right">純資産合計</th></tr>
      </thead>
      <tbody>
        ${dataRow('当期首残高', c => c.opening)}
        <tr class="pl-group"><td colspan="${cols.length + 2}">当期変動額</td></tr>
        ${dataRow('当期剰余金（当期正味財産増減額）', c => c.income, true)}
        ${hasOther ? dataRow('その他純資産の変動', c => c.other, true) : ''}
        <tr class="pl-subtotal ${totalVar >= 0 ? 'pos' : 'neg'}">
          <td>当期変動額合計</td>${cells(colVar)}<td class="text-right amount">${fmt(totalVar)}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="total-row">
          <td>当期末残高</td>${cells(colEnd)}<td class="text-right amount">${fmt(sum(colEnd))}</td>
        </tr>
      </tfoot>
    </table>
    ${mismatch < 1 ? '' :
      `<div style="margin-top:14px;padding:10px 12px;background:var(--warning-bg);border-radius:8px;color:#8a4f00;font-size:13px">
        ※ 期中に純資産科目へ直接記帳された変動があるため、損益計算書の次期繰越額（${fmt(t['次期繰越正味財産'])}）と差が生じています。
      </div>`}
  </div>`;
}

// ===== 月次推移表 =====
async function renderMonthlyTrend(el) {
  const qs = state.currentPeriodId ? `?period_id=${state.currentPeriodId}` : '';
  const data = await api(`/monthly-trend${qs}`);
  const { months, rows } = data;
  const periodName = (state.periods.find(p => p.id == state.currentPeriodId) || {}).name || '全期間';

  if (!months.length || !rows.length) {
    el.innerHTML = `
    <div class="card">
      <div class="card-header"><h2>月次推移表</h2></div>
      <p class="text-muted">${periodName}に集計できる仕訳がありません。仕訳を入力すると、勘定科目ごとの月次推移がここに表示されます。</p>
    </div>`;
    return;
  }

  // 行を種別ごとにまとめる（収益→費用→資産→負債→正味財産）
  const order = ['revenue', 'expense', 'asset', 'liability', 'equity'];
  const byType = {};
  order.forEach(t => byType[t] = rows.filter(r => r.account_type === t));

  // ある行集合の、指定列の合計を返す（列＝'opening' | 'total' | 月キー）
  const colVal = (r, key) => key === 'opening' ? r.opening : key === 'total' ? r.total : (r.monthly[key] || 0);
  const sumOf = (rs, key) => rs.reduce((a, r) => a + colVal(r, key), 0);
  const cols = ['opening', ...months, 'total'];          // データ列の並び
  const monthLabel = (ym) => `${ym.slice(2, 4)}/${ym.slice(5, 7)}`;
  const colHead = (key) => key === 'opening' ? '期首' : key === 'total' ? '合計' : monthLabel(key);

  const cell = (v) => `<td class="text-right amount${v < 0 ? ' neg' : ''}">${v ? fmt(v) : '-'}</td>`;
  const dataRow = (r) =>
    `<tr><td class="mt-name" title="${r.code} ${r.name}">${r.name}</td>${cols.map(k => cell(colVal(r, k))).join('')}</tr>`;
  const subtotalRow = (label, rs, cls) =>
    `<tr class="${cls}"><td class="mt-name">${label}</td>${cols.map(k => `<td class="text-right amount">${fmt(sumOf(rs, k))}</td>`).join('')}</tr>`;
  // 任意の関数で1列ずつ値を出す合成行（当期正味財産増減額など）
  const calcRow = (label, fn, cls) =>
    `<tr class="${cls}"><td class="mt-name">${label}</td>${cols.map(k => { const v = fn(k); return `<td class="text-right amount${v < 0 ? ' neg' : ''}">${fmt(v)}</td>`; }).join('')}</tr>`;

  const groupBlock = (type) => {
    const rs = byType[type];
    if (!rs.length) return '';
    return `
      <tr class="pl-group"><td colspan="${cols.length + 1}">${typeLabel[type]}</td></tr>
      ${rs.map(dataRow).join('')}
      ${subtotalRow(`${typeLabel[type]} 計`, rs, 'pl-subtotal')}`;
  };

  const netFn = (k) => sumOf(byType.revenue, k) - sumOf(byType.expense, k);

  el.innerHTML = `
  <div class="card">
    <div class="card-header">
      <h2>月次推移表 <span class="text-muted text-sm">${periodName}</span></h2>
      <div class="btn-row">
        <button class="btn btn-secondary btn-sm" id="mtCsv">Excel(CSV)</button>
        <button class="btn btn-secondary btn-sm" onclick="window.print()">印刷</button>
      </div>
    </div>
    <p class="text-muted text-sm" style="margin:0 0 14px">
      各月は当月の純増減（フロー）、「期首」は期首残高、「合計」は期末残高（収益・費用は当期累計）です。横にスクロールできます。
    </p>
    <div class="table-wrapper">
      <table class="mt-table">
        <thead>
          <tr><th class="mt-name">勘定科目</th>${cols.map(k => `<th class="text-right${k === 'opening' || k === 'total' ? ' mt-edge' : ''}">${colHead(k)}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${groupBlock('revenue')}
          ${groupBlock('expense')}
          ${(byType.revenue.length || byType.expense.length)
            ? calcRow('当期正味財産増減額', netFn, 'total-row') : ''}
          ${groupBlock('asset')}
          ${groupBlock('liability')}
          ${groupBlock('equity')}
        </tbody>
      </table>
    </div>
  </div>`;

  // CSV（Excel）書き出し。BOM付きUTF-8でExcelの文字化けを防ぐ。
  document.getElementById('mtCsv').onclick = () => {
    const esc = (s) => `"${String(s).replace(/"/g, '""')}"`;
    const head = ['勘定科目', '期首', ...months.map(m => m.replace('-', '/')), '合計'];
    const lines = [head.map(esc).join(',')];
    const emit = (label, valFn) => lines.push([esc(label), ...cols.map(k => valFn(k))].join(','));
    order.forEach(type => {
      const rs = byType[type];
      if (!rs.length) return;
      rs.forEach(r => emit(r.name, k => Math.round(colVal(r, k))));
      emit(`${typeLabel[type]} 計`, k => Math.round(sumOf(rs, k)));
    });
    if (byType.revenue.length || byType.expense.length) emit('当期正味財産増減額', k => Math.round(netFn(k)));
    const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `月次推移表_${periodName}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
}

// ===== Audit Report =====
async function renderAudit(el) {
  const periodSelects = (id) => state.periods.map(p =>
    `<option value="${p.id}" ${p.id == id ? 'selected' : ''}>${p.name}</option>`).join('');
  const currentP = state.periods.find(p => p.is_current);
  const prevP = state.periods.filter(p => !p.is_current)[0];
  const today = new Date().toISOString().slice(0, 10);

  el.innerHTML = `
  <div class="card no-print">
    <div class="card-header"><h2>比較する会計期間を選択</h2></div>
    <div class="form-grid cols-3">
      <div class="form-group"><label>当期</label>
        <select id="auditCurr"><option value="">全期間</option>${periodSelects(currentP?.id)}</select></div>
      <div class="form-group"><label>前期</label>
        <select id="auditPrev"><option value="">全期間</option>${periodSelects(prevP?.id)}</select></div>
      <div class="form-group"><label>監査日</label>
        <input type="date" id="auditDate" value="${today}"></div>
    </div>
    <div class="form-actions mt-16">
      <button class="btn btn-primary" id="auditRunBtn">比較表を生成</button>
    </div>
  </div>
  <div id="auditResult"></div>`;

  document.getElementById('auditRunBtn').onclick = async () => {
    const curr = document.getElementById('auditCurr').value;
    const prev = document.getElementById('auditPrev').value;
    const date = document.getElementById('auditDate').value;
    const report = await api(`/audit-report?current_period_id=${curr}&prev_period_id=${prev}`);
    renderAuditTable(report, curr, prev, date);
  };
  if (currentP || prevP) document.getElementById('auditRunBtn').click();
}

// イベント関連（春/夏/忘年会など）を勘定科目名でまとめて1行に集約する。
// 同名科目（イベント運営費・イベント会費）が複数カテゴリに分かれているのを合算。
function consolidateEvents(report) {
  const map = new Map();
  report.forEach(r => {
    const k = r.account_type + '|' + r.name;
    if (!map.has(k)) {
      map.set(k, { ...r, _cats: new Set([r.category || '']) });
    } else {
      const m = map.get(k);
      m.current_balance += r.current_balance;
      m.prev_balance += r.prev_balance;
      m._cats.add(r.category || '');
    }
  });
  return [...map.values()].map(m => {
    const category = m._cats.size > 1 ? 'イベント' : (m.category || '');
    const change = m.current_balance - m.prev_balance;
    const change_pct = m.prev_balance ? change / m.prev_balance * 100 : null;
    return { ...m, category, change, change_pct };
  });
}

function renderAuditTable(rawReport, currId, prevId, reportDate) {
  const report = consolidateEvents(rawReport);
  const currName = state.periods.find(p => p.id == currId)?.name || '全期間';
  const prevName = state.periods.find(p => p.id == prevId)?.name || '全期間';
  const types = ['asset', 'liability', 'equity', 'revenue', 'expense'];
  const fmtChg = (v) => (v >= 0 ? '+' : '') + fmt(v);

  let html = `
  <div class="card">
    <div class="card-header">
      <h2>増減比較表</h2>
      <div class="flex gap-8 items-center">
        ${reportDate ? `<span class="text-muted text-sm">監査日: ${reportDate}</span>` : ''}
        <button class="btn btn-secondary btn-sm no-print" onclick="window.print()">印刷</button>
      </div>
    </div>
    ${reportDate ? `<p class="text-muted text-sm" style="margin-bottom:16px">監査日: ${reportDate}</p>` : ''}
    <table>
      <thead><tr>
        <th>大分類</th><th>中分類</th><th>勘定科目</th>
        <th class="text-right">当期（${currName}）</th>
        <th class="text-right">前期（${prevName}）</th>
        <th class="text-right">増減額</th><th class="text-right">増減率</th>
      </tr></thead>
      <tbody>`;

  types.forEach(type => {
    const typeRows = report.filter(r => r.account_type === type);
    if (!typeRows.length) return;
    const typeCurr = typeRows.reduce((s, r) => s + r.current_balance, 0);
    const typePrev = typeRows.reduce((s, r) => s + r.prev_balance, 0);
    const typeChg  = typeCurr - typePrev;
    const typePct  = typePrev ? typeChg / typePrev * 100 : null;
    const tCls = typeChg > 0 ? 'amount-inc' : typeChg < 0 ? 'amount-dec' : '';
    html += `<tr class="audit-type-row">
      <td colspan="3" style="padding:10px 12px">${typeLabel[type]}</td>
      <td class="text-right amount">${fmt(typeCurr)}</td>
      <td class="text-right amount">${fmt(typePrev)}</td>
      <td class="text-right amount ${tCls}">${fmtChg(typeChg)}</td>
      <td class="text-right ${tCls}">${fmtPct(typePct)}</td>
    </tr>`;

    const cats = [...new Set(typeRows.map(r => r.category || 'その他'))];
    cats.forEach(cat => {
      const catRows = typeRows.filter(r => (r.category || 'その他') === cat);
      const catCurr = catRows.reduce((s, r) => s + r.current_balance, 0);
      const catPrev = catRows.reduce((s, r) => s + r.prev_balance, 0);
      const catChg  = catCurr - catPrev;
      const catPct  = catPrev ? catChg / catPrev * 100 : null;
      const cCls = catChg > 0 ? 'amount-inc' : catChg < 0 ? 'amount-dec' : '';
      html += `<tr style="background:#f1f5f9">
        <td></td>
        <td colspan="2" style="font-weight:700;padding:8px 12px 8px 20px">${cat}</td>
        <td class="text-right amount font-bold">${fmt(catCurr)}</td>
        <td class="text-right amount font-bold">${fmt(catPrev)}</td>
        <td class="text-right amount font-bold ${cCls}">${fmtChg(catChg)}</td>
        <td class="text-right font-bold ${cCls}">${fmtPct(catPct)}</td>
      </tr>`;
      catRows.forEach(r => {
        const chgCls = r.change > 0 ? 'amount-inc' : r.change < 0 ? 'amount-dec' : '';
        html += `<tr>
          <td></td><td></td>
          <td style="padding-left:32px">${r.name}</td>
          <td class="text-right amount">${fmt(r.current_balance)}</td>
          <td class="text-right amount">${fmt(r.prev_balance)}</td>
          <td class="text-right amount ${chgCls}">${fmtChg(r.change)}</td>
          <td class="text-right ${chgCls}">${fmtPct(r.change_pct)}</td>
        </tr>`;
      });
    });
  });

  html += `</tbody></table>
    <p class="text-muted text-sm no-print" style="margin-top:12px">
      ※ イベント（春・夏・忘年会など）はまとめて表示しています。イベントごとの収支・人数・単価は「イベント収支」タブをご覧ください。
    </p>
  </div>`;
  document.getElementById('auditResult').innerHTML = html;
}

// ===== イベント収支タブ =====
// イベントカテゴリ（収益・費用の両方に使われているカテゴリ）ごとに収入・支出・収支・人数・単価を表示
window.updateEventPerson = (cat, val, inputEl) => {
  const pKey = 'expense:' + cat;
  const n = parseInt(val);
  if (n > 0) state.personCounts[pKey] = n;
  else { delete state.personCounts[pKey]; if (inputEl) inputEl.value = ''; }
  localStorage.setItem('personCounts', JSON.stringify(state.personCounts));
  const key = encodeURIComponent(cat);
  const ppEl = document.getElementById(`evPer_${key}`);
  if (ppEl) {
    const exp = parseFloat(ppEl.dataset.expense || 0);
    ppEl.textContent = n > 0 ? fmt(exp / n) : '—';
  }
};

async function renderEvents(el) {
  const qs = state.currentPeriodId ? `?period_id=${state.currentPeriodId}` : '';
  const rows = await api(`/trial-balance${qs}`);
  const periodName = (state.periods.find(p => p.id == state.currentPeriodId) || {}).name || '全期間';

  // イベントカテゴリ = 収益にも費用にも使われているカテゴリ（春イベント等）
  const revCats = new Set(state.accounts.filter(a => a.account_type === 'revenue' && a.category).map(a => a.category));
  const expCats = new Set(state.accounts.filter(a => a.account_type === 'expense' && a.category).map(a => a.category));
  const eventCats = [...revCats].filter(c => expCats.has(c));

  const events = eventCats.map(cat => {
    const income  = rows.filter(r => r.category === cat && r.account_type === 'revenue').reduce((s, r) => s + r.balance, 0);
    const expense = rows.filter(r => r.category === cat && r.account_type === 'expense').reduce((s, r) => s + r.balance, 0);
    return { cat, income, expense, net: income - expense };
  });

  if (!events.length) {
    el.innerHTML = `
    <div class="card">
      <div class="card-header"><h2>イベント収支 <span class="text-muted text-sm">${periodName}</span></h2></div>
      <div class="assist-empty" style="padding:40px">
        <span class="material-symbols-rounded">celebration</span>
        <p>イベントが見つかりませんでした。<br>勘定科目設定で、収益（会費）と費用（運営費）に同じ「中項目」を設定するとイベントとして集計されます。</p>
      </div>
    </div>`;
    return;
  }

  const totIncome = events.reduce((s, e) => s + e.income, 0);
  const totExpense = events.reduce((s, e) => s + e.expense, 0);
  const totNet = totIncome - totExpense;

  const rowsHtml = events.map(e => {
    const pKey = 'expense:' + e.cat;
    const pCount = state.personCounts[pKey];
    const key = encodeURIComponent(e.cat);
    const netCls = e.net > 0 ? 'amount-inc' : e.net < 0 ? 'amount-dec' : '';
    return `<tr>
      <td style="font-weight:600">${e.cat}</td>
      <td class="text-right amount">${fmt(e.income)}</td>
      <td class="text-right amount">${fmt(e.expense)}</td>
      <td class="text-right amount font-bold ${netCls}">${fmt(e.net)}</td>
      <td class="text-right no-print">
        <input type="number" min="1" placeholder="人数" value="${pCount || ''}"
          style="width:72px;padding:4px 6px;border:1px solid var(--border);border-radius:6px;text-align:right;font-size:13px"
          onchange="updateEventPerson('${e.cat.replace(/'/g, "\\'")}', this.value, this)">
      </td>
      <td class="text-right amount font-bold" id="evPer_${key}" data-expense="${e.expense}">${pCount ? fmt(e.expense / pCount) : '—'}</td>
    </tr>`;
  }).join('');

  el.innerHTML = `
  <div class="card">
    <div class="card-header">
      <h2>イベント収支 <span class="text-muted text-sm">${periodName}</span></h2>
      <button class="btn btn-secondary btn-sm no-print" onclick="window.print()">印刷</button>
    </div>
    <div class="table-wrapper">
      <table>
        <thead><tr>
          <th>イベント</th>
          <th class="text-right">収入（会費）</th>
          <th class="text-right">支出（運営費）</th>
          <th class="text-right">収支</th>
          <th class="text-right no-print" style="min-width:80px">人数</th>
          <th class="text-right" style="min-width:120px">1人あたり（運営費）</th>
        </tr></thead>
        <tbody>${rowsHtml}</tbody>
        <tfoot><tr class="total-row">
          <td>合計</td>
          <td class="text-right amount">${fmt(totIncome)}</td>
          <td class="text-right amount">${fmt(totExpense)}</td>
          <td class="text-right amount ${totNet > 0 ? 'amount-inc' : totNet < 0 ? 'amount-dec' : ''}">${fmt(totNet)}</td>
          <td colspan="2"></td>
        </tr></tfoot>
      </table>
    </div>
    <p class="text-muted text-sm no-print" style="margin-top:12px">
      ※「人数」を入力すると「1人あたり（運営費）＝運営費 ÷ 人数」が自動計算されます。入力値はブラウザに保存されます。<br>
      ※ 表示期間は左下の「表示期間」で切り替わります。
    </p>
  </div>`;
}
