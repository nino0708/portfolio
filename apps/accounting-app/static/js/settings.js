// 勘定科目・補助科目・会計期間・データ管理の画面
// 読み込み順は templates/index.html の <script> の並び。トップレベルの const/let/function は全ファイルで共有される。

// ===== Accounts Page =====
function renderAccountsPage() {
  const accountOptions = (selected) => ['asset', 'liability', 'equity', 'revenue', 'expense']
    .map(t => `<option value="${t}" ${t === selected ? 'selected' : ''}>${typeLabel[t]}</option>`).join('');

  return `
  <div class="card">
    <div class="card-header">
      <h2>勘定科目設定</h2>
      <button class="btn btn-primary btn-sm" onclick="openNewAccountModal()">＋ 新規追加</button>
    </div>
    <div class="table-wrapper">
      <table>
        <thead><tr><th>科目名</th><th>種別</th><th>中分類</th><th>P/L区分</th><th>補助科目</th><th>表示順</th><th class="no-print">操作</th></tr></thead>
        <tbody>
          ${['asset', 'liability', 'equity', 'revenue', 'expense'].flatMap(type =>
            state.accounts.filter(a => a.account_type === type).map(a => {
              const subs = state.subAccounts[a.id] || [];
              return `
              <tr>
                <td>${a.name}</td>
                <td>${typeBadge(a.account_type)}</td>
                <td class="text-muted">${a.category || ''}</td>
                <td class="text-muted text-sm">${['revenue','expense'].includes(a.account_type) ? (a.pl_section || '—') : ''}</td>
                <td>
                  ${subs.length > 0
                    ? `<span class="badge" style="background:#e0f2fe;color:#0369a1">${subs.length}件</span>`
                    : '<span class="text-muted text-sm">—</span>'}
                  <button class="btn btn-sm" style="margin-left:6px;font-size:11px;padding:2px 8px;background:#f1f5f9;border:1px solid var(--border)"
                    onclick="manageSubAccounts(${a.id}, '${a.name.replace(/'/g, "\\'")}')">補助科目</button>
                </td>
                <td>${a.display_order}</td>
                <td class="no-print">
                  <div class="flex gap-8">
                    <button class="btn btn-icon btn-sm" onclick="editAccount(${a.id})">✎</button>
                    <button class="btn btn-icon btn-sm" style="color:var(--danger)" onclick="deleteAccount(${a.id}, '${a.name.replace(/'/g, "\\'")}')">✕</button>
                  </div>
                </td>
              </tr>`;
            })
          ).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <!-- 勘定科目 追加/編集モーダル -->
  <div class="modal-overlay" id="accountModal">
    <div class="modal" style="max-width:600px">
      <h3 id="accountModalTitle">勘定科目を追加</h3>
      <form id="accountForm">
        <div class="form-grid cols-2">
          <div class="form-group"><label>科目名 *</label><input name="name" required placeholder="例: 現金"></div>
          <div class="form-group"><label>種別 *</label>
            <select name="account_type" id="accountTypeSelect" onchange="onAccountTypeChange(this.value)">${accountOptions('asset')}</select>
          </div>
          <div class="form-group"><label>中分類</label><input name="category" placeholder="例: 流動資産"></div>
          <div class="form-group"><label>表示順</label><input type="number" name="display_order" value="0"></div>
          <div class="form-group" id="plSectionGroup" style="display:none;grid-column:1/3">
            <label>P/L 区分（損益計算書での分類）</label>
            <select name="pl_section" id="plSectionSelect">
              <optgroup label="経常収益">
                <option value="受取会費">受取会費</option>
                <option value="受取寄付金">受取寄付金</option>
                <option value="受取助成金等">受取助成金等</option>
                <option value="事業収益">事業収益</option>
                <option value="その他収益">その他収益</option>
              </optgroup>
              <optgroup label="経常費用">
                <option value="事業費">事業費</option>
                <option value="管理費">管理費</option>
              </optgroup>
              <optgroup label="経常外">
                <option value="経常外収益">経常外収益</option>
                <option value="経常外費用">経常外費用</option>
              </optgroup>
            </select>
          </div>
        </div>

        <!-- 補助科目セクション（新規追加時のみ表示） -->
        <div id="subAccountSection" style="margin-top:20px;border-top:1px solid var(--border);padding-top:16px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            <label style="font-weight:600;font-size:14px">補助科目（任意）</label>
            <button type="button" class="btn btn-sm"
              style="font-size:12px;padding:4px 10px;background:#e0f2fe;color:#0369a1;border:1px solid #bae6fd"
              onclick="addSubRow()">＋ 補助科目を追加</button>
          </div>
          <div id="subRowsContainer"></div>
          <p class="text-muted text-sm" style="margin-top:6px">勘定科目の保存と同時に補助科目も登録されます。</p>
        </div>

        <div class="form-actions mt-16">
          <button type="button" class="btn btn-secondary" onclick="closeModal('accountModal')">キャンセル</button>
          <button type="submit" class="btn btn-primary" id="accountSubmitBtn">追加</button>
        </div>
      </form>
    </div>
  </div>

  <!-- 補助科目管理モーダル -->
  <div class="modal-overlay" id="subAccountModal">
    <div class="modal" style="max-width:480px">
      <h3>補助科目の管理 — <span id="subModalParentName"></span></h3>
      <div id="subAccountList" style="margin-bottom:16px"></div>
      <hr style="margin:12px 0">
      <h4 style="margin-bottom:8px" id="subFormTitle">補助科目を追加</h4>
      <form id="subAccountForm">
        <div class="form-grid">
          <div class="form-group"><label>補助科目名 *</label><input name="name" required placeholder="例: 本社口座"></div>
          <div class="form-group"><label>表示順</label><input type="number" name="display_order" value="0"></div>
        </div>
        <div class="form-actions mt-16">
          <button type="button" class="btn btn-secondary" onclick="resetSubForm()">キャンセル</button>
          <button type="submit" class="btn btn-primary" id="subSubmitBtn">追加</button>
        </div>
      </form>
      <div style="margin-top:16px;text-align:right">
        <button class="btn btn-secondary" onclick="closeModal('subAccountModal')">閉じる</button>
      </div>
    </div>
  </div>`;
}

function bindAccountsPage() {
  const form = document.getElementById('accountForm');
  form.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    // codeフィールドは廃止済み。空文字で送る
    data.code = data.name.trim().substring(0, 20);
    try {
      if (state.editingAccount) {
        await api(`/accounts/${state.editingAccount}`, 'PUT', data);
      } else {
        const res = await api('/accounts', 'POST', data);
        const newAccountId = res.id;
        const rows = document.querySelectorAll('#subRowsContainer .sub-row');
        for (const row of rows) {
          const name = row.querySelector('.sub-name').value.trim();
          if (name) {
            await api(`/accounts/${newAccountId}/sub-accounts`, 'POST', { name, display_order: 0 });
          }
        }
      }
      await loadAccounts();
      await loadSubAccounts();
      closeModal('accountModal');
      navigate('accounts');
    } catch (err) { alert(err.message); }
  };
}

window.addSubRow = () => {
  const container = document.getElementById('subRowsContainer');
  const row = document.createElement('div');
  row.className = 'sub-row';
  row.style.cssText = 'display:flex;gap:8px;margin-bottom:8px;align-items:center';
  row.innerHTML = `
    <input class="sub-name" placeholder="補助科目名 例: 本社口座"
      style="flex:1;padding:8px;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:inherit;font-size:13px">
    <button type="button" onclick="removeSubRow(this)"
      style="background:none;border:none;color:var(--danger);cursor:pointer;font-size:16px;padding:0 4px">✕</button>`;
  container.appendChild(row);
  row.querySelector('.sub-name').focus();
};
window.removeSubRow = (btn) => btn.closest('.sub-row').remove();

window.onAccountTypeChange = (type) => {
  const show = type === 'revenue' || type === 'expense';
  document.getElementById('plSectionGroup').style.display = show ? 'block' : 'none';
  if (show) {
    const sel = document.getElementById('plSectionSelect');
    const revOpts = ['受取会費', '受取寄付金', '受取助成金等', '事業収益', 'その他収益', '経常外収益'];
    const expOpts = ['事業費', '管理費', '経常外費用'];
    const current = sel.value;
    const validOpts = type === 'revenue' ? revOpts : expOpts;
    if (!validOpts.includes(current)) {
      sel.value = type === 'revenue' ? '事業収益' : '管理費';
    }
  }
};

window.openNewAccountModal = () => {
  state.editingAccount = null;
  document.getElementById('accountModalTitle').textContent = '勘定科目を追加';
  document.getElementById('accountSubmitBtn').textContent = '追加';
  document.getElementById('accountForm').reset();
  document.getElementById('subRowsContainer').innerHTML = '';
  document.getElementById('subAccountSection').style.display = 'block';
  document.getElementById('plSectionGroup').style.display = 'none';
  openModal('accountModal');
};

window.editAccount = (id) => {
  const acc = state.accounts.find(a => a.id === id);
  if (!acc) return;
  state.editingAccount = id;
  document.getElementById('accountModalTitle').textContent = '勘定科目を編集';
  document.getElementById('accountSubmitBtn').textContent = '保存';
  document.getElementById('subAccountSection').style.display = 'none';
  const form = document.getElementById('accountForm');
  form.name.value = acc.name;
  form.account_type.value = acc.account_type;
  form.category.value = acc.category || '';
  form.display_order.value = acc.display_order;
  const isPL = acc.account_type === 'revenue' || acc.account_type === 'expense';
  document.getElementById('plSectionGroup').style.display = isPL ? 'block' : 'none';
  if (isPL) document.getElementById('plSectionSelect').value = acc.pl_section || '';
  openModal('accountModal');
};

window.deleteAccount = async (id, name) => {
  if (!confirm(`「${name}」を削除しますか？`)) return;
  await api(`/accounts/${id}`, 'DELETE');
  await loadAccounts();
  navigate('accounts');
};

// ===== Sub-accounts management =====
window.manageSubAccounts = (accountId, accountName) => {
  state.subAccountParentId = accountId;
  state.editingSubAccount = null;
  document.getElementById('subModalParentName').textContent = accountName;
  renderSubAccountList();
  resetSubForm();
  openModal('subAccountModal');
};

function renderSubAccountList() {
  const subs = state.subAccounts[state.subAccountParentId] || [];
  const el = document.getElementById('subAccountList');
  if (!subs.length) {
    el.innerHTML = '<p class="text-muted text-sm">補助科目はまだ登録されていません</p>';
    return;
  }
  el.innerHTML = `<table style="width:100%;font-size:13px">
    <thead><tr><th>補助科目名</th><th>表示順</th><th>操作</th></tr></thead>
    <tbody>
      ${subs.map(s => `<tr>
        <td>${s.name}</td>
        <td>${s.display_order}</td>
        <td><div class="flex gap-8">
          <button class="btn btn-icon btn-sm" onclick="editSubAccount(${s.id})">✎</button>
          <button class="btn btn-icon btn-sm" style="color:var(--danger)" onclick="deleteSubAccount(${s.id}, '${s.name.replace(/'/g, "\\'")}')">✕</button>
        </div></td>
      </tr>`).join('')}
    </tbody>
  </table>`;
}

function bindSubForm() {
  const form = document.getElementById('subAccountForm');
  if (!form || form._bound) return;
  form._bound = true;
  form.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    try {
      if (state.editingSubAccount) {
        await api(`/sub-accounts/${state.editingSubAccount}`, 'PUT', data);
      } else {
        await api(`/accounts/${state.subAccountParentId}/sub-accounts`, 'POST', data);
      }
      await loadSubAccounts();
      renderSubAccountList();
      resetSubForm();
    } catch (err) { alert(err.message); }
  };
}

window.openModal = (id) => {
  document.getElementById(id).classList.add('open');
  if (id === 'subAccountModal') bindSubForm();
};

window.resetSubForm = () => {
  state.editingSubAccount = null;
  document.getElementById('subFormTitle').textContent = '補助科目を追加';
  document.getElementById('subSubmitBtn').textContent = '追加';
  document.getElementById('subAccountForm').reset();
};

window.editSubAccount = (id) => {
  const s = (state.subAccounts[state.subAccountParentId] || []).find(x => x.id === id);
  if (!s) return;
  state.editingSubAccount = id;
  document.getElementById('subFormTitle').textContent = '補助科目を編集';
  document.getElementById('subSubmitBtn').textContent = '保存';
  const form = document.getElementById('subAccountForm');
  form.name.value = s.name;
  form.display_order.value = s.display_order;
  form.name.focus();
};

window.deleteSubAccount = async (id, name) => {
  if (!confirm(`「${name}」を削除しますか？`)) return;
  await api(`/sub-accounts/${id}`, 'DELETE');
  await loadSubAccounts();
  renderSubAccountList();
};

// ===== Periods Page =====
function renderPeriodsPage() {
  return `
  <div class="card">
    <div class="card-header">
      <h2>会計期間設定</h2>
      <button class="btn btn-primary btn-sm" onclick="openNewPeriodModal()">＋ 新規追加</button>
    </div>
    <div class="table-wrapper">
      <table>
        <thead><tr><th>期間名</th><th>開始日</th><th>終了日</th><th>状態</th><th>締め</th><th class="no-print">操作</th></tr></thead>
        <tbody>
          ${state.periods.map(p => `
          <tr>
            <td>${p.name}</td><td>${p.start_date}</td><td>${p.end_date}</td>
            <td>${p.is_current ? '<span class="badge badge-revenue">当期</span>' : '<span class="badge" style="background:#f1f5f9;color:#64748b">過去</span>'}</td>
            <td>${p.is_locked
                ? '<span class="badge badge-delete"><span class="material-symbols-rounded" style="font-size:14px;vertical-align:-2px">lock</span> 締め済</span>'
                : '<span class="badge badge-revenue"><span class="material-symbols-rounded" style="font-size:14px;vertical-align:-2px">lock_open</span> 編集可</span>'}</td>
            <td class="no-print"><div class="flex gap-8">
              <button class="btn btn-secondary btn-sm" onclick="togglePeriodLock(${p.id}, ${p.is_locked ? 0 : 1}, '${p.name}')">
                ${p.is_locked ? '締めを解除' : '締める'}
              </button>
              <button class="btn btn-icon btn-sm" title="編集" onclick="editPeriod(${p.id})">✎</button>
              <button class="btn btn-icon btn-sm" style="color:var(--danger)" title="削除" onclick="deletePeriod(${p.id}, '${p.name}')">✕</button>
            </div></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <p class="text-muted text-sm" style="margin-top:12px">
      「締める」と、その会計期間の仕訳は追加・編集・削除ができなくなります（決算確定後の改ざん防止）。
      締めた期間の訂正は、仕訳帳の <b>↩ 赤伝</b> で当期に逆仕訳を立てて行います。誤って締めた場合は「締めを解除」できます。
    </p>
  </div>
  <div class="modal-overlay" id="periodModal">
    <div class="modal">
      <h3 id="periodModalTitle">会計期間を追加</h3>
      <form id="periodForm">
        <div class="form-grid">
          <div class="form-group"><label>期間名 *</label><input name="name" required placeholder="例: 2024年度"></div>
          <div class="form-group"><label>開始日 *</label><input type="date" name="start_date" required></div>
          <div class="form-group"><label>終了日 *</label><input type="date" name="end_date" required></div>
          <div class="form-group"><label><input type="checkbox" name="is_current" value="1"> 当期として設定</label></div>
        </div>
        <div class="form-actions mt-16">
          <button type="button" class="btn btn-secondary" onclick="closeModal('periodModal')">キャンセル</button>
          <button type="submit" class="btn btn-primary">保存</button>
        </div>
      </form>
    </div>
  </div>`;
}

function bindPeriodsPage() {
  document.getElementById('periodForm').onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    data.is_current = fd.has('is_current') ? 1 : 0;
    try {
      if (state.editingPeriod) {
        await api(`/periods/${state.editingPeriod}`, 'PUT', data);
      } else {
        await api('/periods', 'POST', data);
      }
      await loadPeriods();
      closeModal('periodModal');
      navigate('periods');
    } catch (err) { alert(err.message); }
  };
}

window.openNewPeriodModal = () => {
  state.editingPeriod = null;
  document.getElementById('periodModalTitle').textContent = '会計期間を追加';
  document.getElementById('periodForm').reset();
  openModal('periodModal');
};
window.editPeriod = (id) => {
  const p = state.periods.find(x => x.id === id);
  if (!p) return;
  state.editingPeriod = id;
  document.getElementById('periodModalTitle').textContent = '会計期間を編集';
  const form = document.getElementById('periodForm');
  form.name.value = p.name; form.start_date.value = p.start_date;
  form.end_date.value = p.end_date; form.is_current.checked = !!p.is_current;
  openModal('periodModal');
};
window.deletePeriod = async (id, name) => {
  if (!confirm(`「${name}」を削除しますか？`)) return;
  await api(`/periods/${id}`, 'DELETE');
  await loadPeriods(); navigate('periods');
};
window.togglePeriodLock = async (id, locked, name) => {
  const msg = locked
    ? `「${name}」を締めますか？\n締めると、この期間の仕訳は追加・編集・削除ができなくなります（訂正は赤伝で行います）。`
    : `「${name}」の締めを解除しますか？\nこの期間の仕訳を再び編集できるようになります。`;
  if (!confirm(msg)) return;
  try {
    await api(`/periods/${id}/lock`, 'POST', { locked: !!locked });
    await loadPeriods();
    navigate('periods');
    refreshIntegrity();
    toast(locked ? `「${name}」を締めました` : `「${name}」の締めを解除しました`);
  } catch (e) { alert(e.message); }
};

// ===== Data Management =====
function renderDataPage() {
  return `
  <div class="card">
    <div class="card-header"><h2>データ管理</h2></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div style="padding:20px;border:1px solid var(--border);border-radius:12px">
        <h3 style="margin-bottom:8px">エクスポート</h3>
        <p class="text-muted text-sm" style="margin-bottom:16px">全データをJSONファイルとしてダウンロードします。</p>
        <button class="btn btn-primary" onclick="exportData()">データをエクスポート</button>
      </div>
      <div style="padding:20px;border:1px solid var(--border);border-radius:12px">
        <h3 style="margin-bottom:8px">インポート</h3>
        <p class="text-muted text-sm" style="margin-bottom:16px">エクスポートしたJSONファイルを読み込みます。</p>
        <input type="file" id="importFile" accept=".json" style="display:none" onchange="importData(this)">
        <button class="btn btn-secondary" onclick="document.getElementById('importFile').click()">ファイルを選択してインポート</button>
      </div>
    </div>
    <div id="dataMsg" class="mt-16"></div>
  </div>`;
}
function bindDataPage() {}
window.exportData = async () => {
  const data = await api('/export');
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `accounting_export_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
};
window.importData = async (input) => {
  const file = input.files[0];
  if (!file) return;
  const text = await file.text();
  const data = JSON.parse(text);
  const res = await api('/import', 'POST', data);
  document.getElementById('dataMsg').innerHTML =
    `<div style="padding:12px;background:#f0fdf4;border-radius:8px;color:#166534">${res.imported}件の仕訳をインポートしました。</div>`;
  refreshIntegrity();
};
