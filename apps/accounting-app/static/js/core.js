// 状態・API呼び出し・共通ユーティリティ・初期化・画面遷移
// 読み込み順は templates/index.html の <script> の並び。トップレベルの const/let/function は全ファイルで共有される。

// ===== State =====
const state = {
  page: 'journal',
  accounts: [],
  periods: [],
  currentPeriodId: null,
  editingEntry: null,
  editingAccount: null,
  editingPeriod: null,
  subAccounts: {},
  editingSubAccount: null,
  subAccountParentId: null,
  personCounts: JSON.parse(localStorage.getItem('personCounts') || '{}'),
  assist: localStorage.getItem('kaikei_assist') === '1',  // かんたん入力アシスタント（既定OFF）
};

// ===== API helpers =====
async function api(path, method = 'GET', body = null) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch('/api' + path, opts);
  if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'エラーが発生しました'); }
  return res.json();
}

// ===== 残高整合性チェッカー（サイドバー左下に常時表示） =====
async function refreshIntegrity() {
  const box = document.getElementById('integrityBadge');
  if (!box) return;
  const text = box.querySelector('.integrity-text');
  const detail = box.querySelector('.integrity-detail');
  try {
    const qs = state.currentPeriodId ? `?period_id=${state.currentPeriodId}` : '';
    const r = await api(`/integrity${qs}`);
    box.classList.toggle('ok', r.ok);
    box.classList.toggle('ng', !r.ok);
    text.textContent = r.ok ? '残高整合 OK' : '不整合あり';
    detail.innerHTML = r.checks.map(c => `
      <div class="integrity-row ${c.ok ? 'ok' : 'ng'}">
        <span class="material-symbols-rounded">${c.ok ? 'check_circle' : 'error'}</span>
        <div class="ir-body"><div class="ir-label">${c.label}</div><div class="ir-detail">${c.detail}</div></div>
      </div>`).join('');
  } catch (e) {
    box.classList.remove('ok'); box.classList.add('ng');
    text.textContent = 'チェック失敗';
    detail.innerHTML = `<div class="integrity-row ng"><span class="material-symbols-rounded">error</span><div class="ir-body">${e.message}</div></div>`;
  }
  // データが変わったらお知らせと検索キャッシュも更新（refreshIntegrity は各操作後に呼ばれる）
  if (typeof clearSearchCache === 'function') clearSearchCache();
  if (typeof refreshNotifications === 'function') refreshNotifications();
}
window.toggleIntegrity = () => document.getElementById('integrityBadge').classList.toggle('open');

const fmt = (n) => n == null ? '-' : Number(n).toLocaleString('ja-JP') + ' 円';
// 金額は円単位の整数で扱う（保存・検算とも丸めてから行う）
const yen = (n) => Math.round(Number(n) || 0);
const fmtPct = (n) => n == null ? '-' : (n >= 0 ? '+' : '') + n.toFixed(1) + '%';
const typeLabel = { asset: '資産', liability: '負債', equity: '正味財産', revenue: '収益', expense: '費用' };
const typeBadge = (t) => `<span class="badge badge-${t}">${typeLabel[t]}</span>`;

// 画面右下に数秒だけ出る軽い通知
function toast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3200);
}

// ===== Init =====
async function init() {
  await Promise.all([loadAccounts(), loadPeriods(), loadSubAccounts()]);
  const hash = location.hash.replace('#', '');
  if (hash) state.page = hash;            // #monthly 等でページ直接指定（ブックマーク用）
  const pq = new URLSearchParams(location.search).get('period');
  if (pq && state.periods.some(p => p.id == pq)) {  // ?period=NN で表示期間を指定
    state.currentPeriodId = Number(pq);
    renderPeriodSelector();
  }
  navigate(state.page);
  refreshIntegrity();
}
async function loadAccounts() { state.accounts = await api('/accounts'); }
async function loadPeriods() {
  state.periods = await api('/periods');
  const current = state.periods.find(p => p.is_current);
  if (current && !state.currentPeriodId) state.currentPeriodId = current.id;
  renderPeriodSelector();
}
async function loadSubAccounts() {
  const all = await api('/sub-accounts');
  state.subAccounts = {};
  all.forEach(sa => {
    if (!state.subAccounts[sa.account_id]) state.subAccounts[sa.account_id] = [];
    state.subAccounts[sa.account_id].push(sa);
  });
}

function renderPeriodSelector() {
  const sel = document.getElementById('periodSelect');
  sel.innerHTML = '<option value="">全期間</option>';
  state.periods.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id; opt.textContent = p.name;
    if (p.id == state.currentPeriodId) opt.selected = true;
    sel.appendChild(opt);
  });
}

// ===== 科目選択ドロップダウン（補助科目をoptgroupで統合） =====
// value は "accountId:subAccountId" or "accountId:" (補助科目なし)
function buildAccountOptions(selAccountId = null, selSubId = null) {
  const types = ['asset', 'liability', 'equity', 'revenue', 'expense'];
  return types.flatMap(type => {
    const typeAccounts = state.accounts.filter(a => a.account_type === type);
    if (!typeAccounts.length) return [];

    // 中項目でグループ化
    const cats = [...new Set(typeAccounts.map(a => a.category || 'その他'))];
    return cats.map(cat => {
      const catAccounts = typeAccounts.filter(a => (a.category || 'その他') === cat);
      const options = catAccounts.map(a => {
        const subs = state.subAccounts[a.id] || [];
        if (subs.length > 0) {
          return subs.map(s => {
            const val = `${a.id}:${s.id}`;
            const sel = (a.id == selAccountId && s.id == selSubId) ? 'selected' : '';
            return `<option value="${val}" ${sel}>${a.name}　${s.name}</option>`;
          }).join('');
        } else {
          const val = `${a.id}:`;
          const sel = (a.id == selAccountId && !selSubId) ? 'selected' : '';
          return `<option value="${val}" ${sel}>${a.name}</option>`;
        }
      }).join('');
      const label = cat === 'その他' ? typeLabel[type] : `${typeLabel[type]}　▶　${cat}`;
      return `<optgroup label="${label}">${options}</optgroup>`;
    });
  }).join('');
}

function parseAccountSel(val) {
  if (!val) return { account_id: null, sub_account_id: null };
  const [aid, sid] = val.split(':');
  return {
    account_id: aid ? parseInt(aid) : null,
    sub_account_id: sid ? parseInt(sid) : null,
  };
}

// ===== Navigation =====
const PAGE_TITLES = {
  journal: '仕訳入力', ledger: '仕訳帳', general: '総勘定元帳',
  trial: '試算表', bs: '貸借対照表', pl: '損益計算書（P/L）',
  ss: '株主資本等変動計算書（純資産変動計算書）',
  monthly: '月次推移表', budget: '予実分析（予算実績対比）',
  audit: '監査資料（増減比較表）', events: 'イベント収支',
  accounts: '勘定科目設定', opening: '期首残高（期またぎ繰越）',
  periods: '会計期間設定', data: 'データ管理', deletion: '変更・削除履歴',
  csvimport: 'CSV取込（自動仕訳）'
};

function navigate(page) {
  state.page = page;
  document.querySelectorAll('#sidebar nav a').forEach(a =>
    a.classList.toggle('active', a.dataset.page === page));
  document.getElementById('pageTitle').textContent = PAGE_TITLES[page] || '';
  render(page);
}

async function render(page) {
  const el = document.getElementById('content');
  el.innerHTML = '<div class="page-loading">読み込み中…</div>';
  try {
    switch (page) {
      case 'journal':  el.innerHTML = renderJournal(); bindJournal(); break;
      case 'ledger':   await renderLedger(el); break;
      case 'general':  await renderGeneral(el); break;
      case 'trial':    await renderTrial(el); break;
      case 'bs':       await renderBS(el); break;
      case 'pl':       await renderPL(el); break;
      case 'ss':       await renderSS(el); break;
      case 'monthly':  await renderMonthlyTrend(el); break;
      case 'budget':   await renderBudget(el); break;
      case 'audit':    await renderAudit(el); break;
      case 'events':   await renderEvents(el); break;
      case 'accounts': el.innerHTML = renderAccountsPage(); bindAccountsPage(); break;
      case 'opening':  await renderOpening(el); break;
      case 'periods':  el.innerHTML = renderPeriodsPage(); bindPeriodsPage(); break;
      case 'data':     el.innerHTML = renderDataPage(); bindDataPage(); break;
      case 'deletion': await renderDeletionLog(el); break;
      case 'csvimport': await renderCsvImport(el); break;
    }
  } catch (e) {
    el.innerHTML = `<div class="page-error">${e.message}</div>`;
  }
}
