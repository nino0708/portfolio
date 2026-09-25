// モーダル・期間セレクタ・サイドバー・グローバル検索・お知らせ
// 読み込み順は templates/index.html の <script> の並び。トップレベルの const/let/function は全ファイルで共有される。

// ===== Modal helpers =====
window.closeModal = (id) => {
  document.getElementById(id).classList.remove('open');
  state.editingAccount = null; state.editingPeriod = null;
};
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) closeModal(e.target.id);
});

// ===== Period selector =====
document.getElementById('periodSelect').addEventListener('change', e => {
  state.currentPeriodId = e.target.value ? parseInt(e.target.value) : null;
  render(state.page);
  refreshIntegrity();
});

// ===== Sidebar navigation =====
document.querySelectorAll('#sidebar nav a[data-page]').forEach(a =>
  a.addEventListener('click', () => navigate(a.dataset.page)));

// ============================================================
//  グローバル検索（トップバー右上）
//  仕訳（摘要・メモ・科目・金額・日付・No.）とページ名を横断検索
// ============================================================
function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function highlight(text, q) {
  const esc = escapeHtml(text);
  if (!q) return esc;
  // 原文に素直に含まれるときだけ強調（ひらがな→漢字の読みヒット時は強調なしで素通り）
  const i = text.toLowerCase().indexOf(q.trim().toLowerCase());
  if (i < 0) return esc;
  const len = q.trim().length;
  return escapeHtml(text.slice(0, i)) + '<mark>' +
    escapeHtml(text.slice(i, i + len)) + '</mark>' + escapeHtml(text.slice(i + len));
}

// 連続入力でAPIを叩きすぎないよう数秒キャッシュ。期間変更時に破棄する。
let _searchCache = { ts: 0, entries: [] };
function clearSearchCache() { _searchCache = { ts: 0, entries: [] }; }
async function searchEntriesData() {
  if (Date.now() - _searchCache.ts < 5000 && _searchCache.entries.length) return _searchCache.entries;
  const entries = await api('/entries');
  _searchCache = { ts: Date.now(), entries };
  return entries;
}
function entryHaystack(e) {
  const names = [...e.debit_lines, ...e.credit_lines]
    .map(l => `${l.account_name || ''} ${l.sub_account_name || ''}`).join(' ');
  const raw = `${e.id} ${e.entry_date} ${e.description || ''} ${e.memo || ''} ${names} ${e.amount}`;
  return jaHaystack(raw);  // 原文＋読みがな（ひらがな検索対応）
}
function entrySummary(lines) {
  return lines.map(l => l.sub_account_name ? `${l.account_name}/${l.sub_account_name}` : l.account_name).join('＋');
}

const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const searchClear = document.getElementById('searchClear');
let _searchTimer = null;

function hideSearch() { searchResults.hidden = true; }
function showSearch() { if (searchResults.innerHTML) searchResults.hidden = false; }

async function runSearch(raw) {
  const q = raw.trim();
  searchClear.hidden = !raw;
  if (!q) { searchResults.innerHTML = ''; hideSearch(); return; }

  const pages = Object.entries(PAGE_TITLES)
    .filter(([k, v]) => jaMatch(jaHaystack(v + ' ' + k), q))
    .slice(0, 4);

  let entries = [];
  try {
    const all = await searchEntriesData();
    if (searchInput.value.trim() !== q) return;  // 入力が変わっていたら破棄
    entries = all.filter(e => jaMatch(entryHaystack(e), q)).slice().reverse();
  } catch (e) { /* 検索はベストエフォート */ }

  const entriesTop = entries.slice(0, 8);
  let html = '';
  if (pages.length) {
    html += '<div class="sr-group">ページ</div>' + pages.map(([k, v]) => `
      <div class="sr-item" onclick="openSearchPage('${k}')">
        <span class="material-symbols-rounded sr-ico">north_east</span>
        <div class="sr-body"><div class="sr-title">${highlight(v, q)}</div></div>
      </div>`).join('');
  }
  if (entriesTop.length) {
    html += `<div class="sr-group">仕訳 <span class="text-muted">(${entries.length}件)</span></div>` +
      entriesTop.map(e => `
      <div class="sr-item" onclick="openSearchEntry(${e.id})">
        <span class="material-symbols-rounded sr-ico">receipt_long</span>
        <div class="sr-body">
          <div class="sr-title">${highlight(entrySummary(e.debit_lines) + ' → ' + entrySummary(e.credit_lines), q)}</div>
          <div class="sr-sub">No.${e.id}・${e.entry_date}・${fmt(e.amount)}${e.description ? '・' + highlight(e.description, q) : ''}</div>
        </div>
      </div>`).join('');
  }
  if (!html) html = '<div class="sr-empty">該当する結果がありません</div>';
  searchResults.innerHTML = html;
  searchResults.hidden = false;
}

window.openSearchPage = (page) => { searchInput.value = ''; runSearch(''); navigate(page); };
window.openSearchEntry = (id) => { searchInput.value = ''; runSearch(''); editEntry(id); };

searchInput.addEventListener('input', e => {
  clearTimeout(_searchTimer);
  _searchTimer = setTimeout(() => runSearch(e.target.value), 180);
});
searchInput.addEventListener('focus', showSearch);
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') { searchInput.value = ''; runSearch(''); searchInput.blur(); }
  if (e.key === 'Enter') {
    const first = searchResults.querySelector('.sr-item');
    if (first) first.click();
  }
});
searchClear.addEventListener('click', () => { searchInput.value = ''; runSearch(''); searchInput.focus(); });
document.addEventListener('click', e => {
  if (!document.getElementById('globalSearch').contains(e.target)) hideSearch();
});

// ============================================================
//  お知らせ（ベル）
//  整合性・会計期間・データ状況から実データに基づく通知を生成
// ============================================================
async function buildNotifications() {
  const items = [];
  const qs = state.currentPeriodId ? `?period_id=${state.currentPeriodId}` : '';

  // ① 残高整合性のNG項目
  try {
    const r = await api(`/integrity${qs}`);
    r.checks.filter(c => !c.ok).forEach(c => items.push({
      level: 'error', icon: 'error', title: `不整合：${c.label}`,
      detail: c.detail, page: c.key === 'opening' ? 'opening' : c.key === 'bs' ? 'bs' : 'ledger',
    }));
  } catch (e) { /* 整合性が取れないときは通知を出さない */ }

  // ② 会計期間まわり
  const today = new Date().toISOString().slice(0, 10);
  const current = state.periods.find(p => p.is_current);
  if (!state.periods.length) {
    items.push({ level: 'warn', icon: 'event_busy', title: '会計期間が未設定です',
      detail: '最初に会計期間を登録してください', page: 'periods' });
  } else if (current && current.end_date < today && !current.is_locked) {
    items.push({ level: 'warn', icon: 'lock_clock', title: '当期の会計期間が終了しています',
      detail: `${current.name}（〜${current.end_date}）の締め処理を確認してください`, page: 'periods' });
  }

  // ③ データ状況
  try {
    const entries = await searchEntriesData();
    const scoped = state.currentPeriodId
      ? entries.filter(e => e.period_id === state.currentPeriodId) : entries;
    if (!scoped.length) {
      items.push({ level: 'info', icon: 'note_add', title: 'まだ仕訳がありません',
        detail: '仕訳入力から記帳を始めましょう', page: 'journal' });
    }
  } catch (e) { /* noop */ }

  return items;
}

// 通知内容のシグネチャ（既読判定用）。内容が変わるまでドットを再点灯しない。
function notifySignature(items) {
  return items.map(i => i.level + ':' + i.title + ':' + i.detail).join('|');
}

const notifyBtn = document.getElementById('notifyBtn');
const notifyPanel = document.getElementById('notifyPanel');
const notifyDot = document.getElementById('notifyDot');
let _notifyItems = [];

async function refreshNotifications() {
  _notifyItems = await buildNotifications();
  const actionable = _notifyItems.filter(i => i.level !== 'info').length;
  const sig = notifySignature(_notifyItems);
  const seen = localStorage.getItem('kaikei_notify_seen');
  notifyDot.hidden = !(actionable > 0 && sig !== seen);
  notifyDot.textContent = actionable > 9 ? '9+' : String(actionable);
  if (!notifyPanel.hidden) renderNotifyPanel();  // 開いていれば中身も更新
}

function renderNotifyPanel() {
  const levelLabel = { error: '要対応', warn: '確認', info: 'お知らせ' };
  const body = _notifyItems.length
    ? _notifyItems.map((i, idx) => `
        <div class="nt-item ${i.level}" onclick="openNotify(${idx})">
          <span class="material-symbols-rounded nt-ico">${i.icon}</span>
          <div class="nt-body">
            <div class="nt-title">${escapeHtml(i.title)} <span class="nt-tag">${levelLabel[i.level]}</span></div>
            <div class="nt-detail">${escapeHtml(i.detail)}</div>
          </div>
        </div>`).join('')
    : `<div class="nt-empty"><span class="material-symbols-rounded">check_circle</span>
         <div>問題は見つかりませんでした<br><small>帳簿は整合が取れています</small></div></div>`;
  notifyPanel.innerHTML = `
    <div class="nt-head">お知らせ</div>
    <div class="nt-list">${body}</div>`;
}

window.openNotify = (idx) => {
  const it = _notifyItems[idx];
  notifyPanel.hidden = true;
  if (it && it.page) navigate(it.page);
};

notifyBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const willOpen = notifyPanel.hidden;
  notifyPanel.hidden = !willOpen;
  if (willOpen) {
    renderNotifyPanel();
    localStorage.setItem('kaikei_notify_seen', notifySignature(_notifyItems));
    notifyDot.hidden = true;
  }
});
document.addEventListener('click', e => {
  if (!document.getElementById('notifyWrap').contains(e.target)) notifyPanel.hidden = true;
});

