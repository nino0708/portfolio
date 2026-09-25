// 仕訳帳・変更削除履歴・総勘定元帳・試算表
// 読み込み順は templates/index.html の <script> の並び。トップレベルの const/let/function は全ファイルで共有される。

// ===== Ledger (仕訳帳) =====
async function renderLedger(el) {
  const entries = await api(`/entries${state.currentPeriodId ? '?period_id=' + state.currentPeriodId : ''}`);
  const total = entries.reduce((s, e) => s + e.amount, 0);
  const lockedPeriods = new Set(state.periods.filter(p => p.is_locked).map(p => p.id));
  const isLocked = (e) => lockedPeriods.has(e.period_id);
  el.innerHTML = `
  <div class="card">
    <div class="card-header">
      <h2>仕訳帳 <span class="text-muted text-sm">(${entries.length}件)</span></h2>
      <div class="flex gap-8">
        <button class="btn btn-primary btn-sm" onclick="navigate('journal')">＋ 仕訳入力</button>
        <button class="btn btn-secondary btn-sm" onclick="window.print()">印刷</button>
      </div>
    </div>
    ${entries.length === 0 ? '<p class="text-muted">仕訳がありません</p>' : `
    <div class="table-wrapper">
      <table>
        <thead><tr><th>No.</th><th>日付</th><th>借方科目</th><th>貸方科目</th><th class="text-right">金額</th><th>摘要</th><th>メモ</th><th class="no-print">操作</th></tr></thead>
        <tbody>
          ${entries.map(e => `
          <tr>
            <td class="text-muted">${e.id}</td>
            <td>${e.entry_date}</td>
            <td class="cell-lines">${linesLabel(e.debit_lines)}</td>
            <td class="cell-lines">${linesLabel(e.credit_lines)}</td>
            <td class="text-right amount">${fmt(e.amount)}</td>
            <td>${e.description || ''}</td>
            <td class="text-muted text-sm">${e.memo || ''}</td>
            <td class="no-print">
              <div class="flex gap-8">
                ${isLocked(e)
                  ? `<span class="badge badge-delete" title="この期間は締め済みです。訂正は赤伝で行ってください"><span class="material-symbols-rounded" style="font-size:14px;vertical-align:-2px">lock</span> 締め済</span>
                     <button class="btn btn-icon btn-sm" title="赤伝（逆仕訳で取消）" onclick="reverseEntry(${e.id})">↩</button>`
                  : `<button class="btn btn-icon btn-sm" title="編集" onclick="editEntry(${e.id})">✎</button>
                     <button class="btn btn-icon btn-sm" title="赤伝（逆仕訳で取消）" onclick="reverseEntry(${e.id})">↩</button>
                     <button class="btn btn-icon btn-sm" style="color:var(--danger)" title="削除" onclick="deleteEntry(${e.id})">✕</button>`}
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
        <tfoot><tr class="total-row">
          <td colspan="4">合計</td>
          <td class="text-right amount">${fmt(total)}</td>
          <td colspan="3"></td>
        </tr></tfoot>
      </table>
    </div>`}
  </div>
  ${renderEntryModal()}`;
}

function renderEntryModal() {
  const periodOptions = state.periods.map(p =>
    `<option value="${p.id}">${p.name}</option>`).join('');
  return `
  <div class="modal-overlay" id="entryModal">
    <div class="modal modal-lg">
      <h3>仕訳を編集</h3>
      <form id="editEntryForm">
        <div class="form-grid cols-2">
          <div class="form-group"><label>日付</label><input type="date" name="entry_date" required></div>
          <div class="form-group"><label>摘要</label><input type="text" name="description"></div>
        </div>
        <div id="editCompound" style="margin-top:14px"></div>
        <div class="form-group" style="margin-top:12px"><label>メモ</label><input type="text" name="memo"></div>
        <div class="form-actions mt-16">
          <button type="button" class="btn btn-secondary" onclick="closeModal('entryModal')">キャンセル</button>
          <button type="submit" class="btn btn-primary" id="editSubmitBtn">保存</button>
        </div>
      </form>
    </div>
  </div>`;
}

window.editEntry = async (id) => {
  const entries = await api('/entries');
  const e = entries.find(x => x.id === id);
  if (!e) return;
  const form = document.getElementById('editEntryForm');
  form.entry_date.value = e.entry_date;
  form.description.value = e.description || '';
  form.memo.value = e.memo || '';

  const compound = document.getElementById('editCompound');
  compound.innerHTML = compoundBlock(e.debit_lines, e.credit_lines);
  const submitBtn = document.getElementById('editSubmitBtn');
  bindCompound(compound, balanced => { submitBtn.disabled = !balanced; });

  state.editingEntry = id;
  openModal('entryModal');

  form.onsubmit = async (ev) => {
    ev.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const lines = collectCompound(compound);
    const dSum = lines.debit_lines.reduce((s, l) => s + l.amount, 0);
    const cSum = lines.credit_lines.reduce((s, l) => s + l.amount, 0);
    if (!lines.debit_lines.length || !lines.credit_lines.length) {
      alert('借方・貸方をそれぞれ1行以上入力してください'); return;
    }
    if (Math.round((dSum - cSum) * 100) !== 0) {
      alert('借方合計と貸方合計が一致していません'); return;
    }
    await api(`/entries/${id}`, 'PUT', {
      entry_date: data.entry_date,
      description: data.description || '',
      memo: data.memo || '',
      ...lines,
    });
    closeModal('entryModal');
    await renderLedger(document.getElementById('content'));
    refreshIntegrity();
  };
};

window.deleteEntry = async (id) => {
  if (!confirm('この仕訳を削除しますか？\n（削除した内容は「変更・削除履歴」に記録されます）')) return;
  await api(`/entries/${id}`, 'DELETE');
  await renderLedger(document.getElementById('content'));
  refreshIntegrity();
};

window.reverseEntry = async (id) => {
  if (!confirm(`仕訳No.${id} の取消仕訳（赤伝）を作成します。\n借方・貸方を入れ替えた逆仕訳を当日付で新規登録し、元の仕訳はそのまま残します。よろしいですか？`)) return;
  try {
    const r = await api(`/entries/${id}/reverse`, 'POST', {});
    await renderLedger(document.getElementById('content'));
    refreshIntegrity();
    toast(`赤伝（No.${r.new_id}）を作成しました。元No.${id} を取り消しました`);
  } catch (e) { alert(e.message); }
};

// ===== 変更・削除履歴（監査証跡） =====
async function renderDeletionLog(el) {
  const logs = await api('/change-log');
  const editN = logs.filter(l => l.kind === 'edit').length;
  const delN = logs.filter(l => l.kind === 'delete').length;

  const kindBadge = (k) => k === 'edit'
    ? '<span class="badge badge-edit">変更</span>'
    : '<span class="badge badge-delete">削除</span>';

  // 仕訳内容セル：編集は 変更前→変更後、削除は内容そのまま
  const contentCell = (l) => l.kind === 'edit'
    ? `<div class="chg-diff">
         <div class="chg-before"><span>変更前</span>${l.before_detail || '-'}</div>
         <div class="chg-after"><span>変更後</span>${l.after_detail || '-'}</div>
       </div>`
    : `<span class="text-sm">${l.detail || ''}</span>`;

  el.innerHTML = `
  <div class="card">
    <div class="card-header">
      <h2>変更・削除履歴 <span class="text-muted text-sm">(変更 ${editN}件 ／ 削除 ${delN}件)</span></h2>
      <button class="btn btn-secondary btn-sm" onclick="window.print()">印刷</button>
    </div>
    <p class="text-muted text-sm" style="margin:0 0 12px">
      仕訳を編集・削除した記録です。編集は「変更前→変更後」、削除は消した内容が残ります。
      改ざん防止のため記録は消せません。訂正は赤伝（逆仕訳）でも行えます。
    </p>
    ${logs.length === 0 ? '<p class="text-muted">変更・削除された仕訳はありません</p>' : `
    <div class="table-wrapper">
      <table>
        <thead><tr>
          <th>日時</th><th>種別</th><th>元No.</th><th>取引日</th>
          <th>摘要</th><th class="text-right">金額</th><th>仕訳内容</th><th>メモ</th>
        </tr></thead>
        <tbody>
          ${logs.map(l => `
          <tr>
            <td class="text-muted text-sm">${(l.at || '').replace('T', ' ').slice(0, 16)}</td>
            <td>${kindBadge(l.kind)}</td>
            <td class="text-muted">${l.entry_id}</td>
            <td>${l.entry_date || ''}</td>
            <td>${l.description || ''}</td>
            <td class="text-right amount">${fmt(l.amount || 0)}</td>
            <td>${contentCell(l)}</td>
            <td class="text-muted text-sm">${l.memo || ''}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`}
  </div>`;
}

// ===== General Ledger (総勘定元帳) =====
async function renderGeneral(el) {
  const qs = state.currentPeriodId ? `?period_id=${state.currentPeriodId}` : '';
  const ledger = await api(`/general-ledger${qs}`);
  el.innerHTML = `
  <div class="card">
    <div class="card-header">
      <h2>総勘定元帳</h2>
      <button class="btn btn-secondary btn-sm" onclick="window.print()">印刷</button>
    </div>
    ${ledger.map(acc => `
    <div style="margin-bottom:28px">
      <div style="font-weight:700;font-size:15px;margin-bottom:8px;padding-bottom:6px;border-bottom:2px solid var(--border)">
        ${typeBadge(acc.account_type)} ${acc.name}
        <span style="float:right;font-size:13px;color:var(--text-muted)">残高: <strong>${fmt(acc.balance)}</strong></span>
      </div>
      <div class="table-wrapper">
        <table>
          <thead><tr><th>日付</th><th>摘要</th><th>相手科目</th><th class="text-right">借方</th><th class="text-right">貸方</th><th class="text-right">残高</th></tr></thead>
          <tbody>
            ${(() => {
              let balance = 0;
              const isDebitNorm = acc.account_type === 'asset' || acc.account_type === 'expense';
              return acc.entries.map(e => {
                const dr = e.side === 'debit' ? e.amount : 0;
                const cr = e.side === 'credit' ? e.amount : 0;
                balance += isDebitNorm ? (dr - cr) : (cr - dr);
                return `<tr>
                  <td>${e.entry_date}</td>
                  <td>${e.description || ''}</td>
                  <td class="text-muted text-sm">${e.counter_account_name || ''}</td>
                  <td class="text-right amount">${dr ? fmt(dr) : ''}</td>
                  <td class="text-right amount">${cr ? fmt(cr) : ''}</td>
                  <td class="text-right amount font-bold">${fmt(balance)}</td>
                </tr>`;
              }).join('');
            })()}
          </tbody>
          <tfoot><tr class="total-row">
            <td colspan="3">合計</td>
            <td class="text-right amount">${fmt(acc.total_debit)}</td>
            <td class="text-right amount">${fmt(acc.total_credit)}</td>
            <td class="text-right amount">${fmt(acc.balance)}</td>
          </tr></tfoot>
        </table>
      </div>
    </div>`).join('')}
  </div>`;
}

// ===== Trial Balance (試算表) =====
async function renderTrial(el) {
  const qs = state.currentPeriodId ? `?period_id=${state.currentPeriodId}` : '';
  const rows = await api(`/trial-balance${qs}`);
  const totDr = rows.reduce((s, r) => s + r.debit_total, 0);
  const totCr = rows.reduce((s, r) => s + r.credit_total, 0);
  el.innerHTML = `
  <div class="card">
    <div class="card-header">
      <h2>試算表</h2>
      <button class="btn btn-secondary btn-sm" onclick="window.print()">印刷</button>
    </div>
    <div class="table-wrapper">
      <table>
        <thead><tr><th>勘定科目</th><th>種別</th><th class="text-right">借方合計</th><th class="text-right">貸方合計</th><th class="text-right">残高</th></tr></thead>
        <tbody>
          ${rows.map(r => `<tr>
            <td>${r.name}</td>
            <td>${typeBadge(r.account_type)}</td>
            <td class="text-right amount">${fmt(r.debit_total)}</td>
            <td class="text-right amount">${fmt(r.credit_total)}</td>
            <td class="text-right amount font-bold">${fmt(r.balance)}</td>
          </tr>`).join('')}
        </tbody>
        <tfoot><tr class="total-row">
          <td colspan="2">合計</td>
          <td class="text-right amount">${fmt(totDr)}</td>
          <td class="text-right amount">${fmt(totCr)}</td>
          <td></td>
        </tr></tfoot>
      </table>
    </div>
  </div>`;
}
