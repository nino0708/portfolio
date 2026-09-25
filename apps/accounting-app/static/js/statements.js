// 期首残高・貸借対照表・活動計算書・予実分析
// 読み込み順は templates/index.html の <script> の並び。トップレベルの const/let/function は全ファイルで共有される。

// ===== 期首残高（期またぎ繰越） =====
async function renderOpening(el) {
  const pid = state.currentPeriodId;
  const periodName = (state.periods.find(p => p.id == pid) || {}).name || '全期間';

  if (!pid) {
    el.innerHTML = `<div class="card"><div class="empty-state">
      <span class="material-symbols-rounded">event_busy</span>
      <p>期首残高は会計期間ごとに設定します。<br>左下の「表示期間」で対象の年度を選んでください。</p>
    </div></div>`;
    return;
  }

  const rows = await api(`/periods/${pid}/opening-balances`);
  const TYPE_LABEL = { asset: '資産の部', liability: '負債の部', equity: '正味財産の部' };

  const equityAccounts = state.accounts.filter(a => a.account_type === 'equity');
  const equityOptions = equityAccounts.length
    ? equityAccounts.map(a => `<option value="${a.id}" ${a.is_carryover ? 'selected' : ''}>${a.name}</option>`).join('')
    : '<option value="">（正味財産科目がありません）</option>';

  const sectionHtml = (type) => {
    const items = rows.filter(r => r.account_type === type);
    if (!items.length) return '';
    return `<tr class="ob-section"><td colspan="2">${TYPE_LABEL[type]}</td></tr>` +
      items.map(r => `<tr>
        <td>${r.name}<span class="ob-code">${r.code}</span></td>
        <td class="text-right">
          <input type="number" class="ob-input" data-id="${r.id}" data-type="${r.account_type}"
                 value="${r.amount ? Math.round(r.amount) : ''}" placeholder="0" min="0" step="1">
        </td>
      </tr>`).join('');
  };

  el.innerHTML = `
  <div class="card">
    <div class="card-header">
      <h2>期首残高（期またぎ繰越）</h2>
      <button class="btn btn-secondary btn-sm" id="obCarry">
        <span class="material-symbols-rounded" style="font-size:18px;vertical-align:-4px">north_east</span>
        前期から繰越
      </button>
    </div>
    <p class="ob-lead">
      <strong>${periodName}</strong> の期首残高（資産・負債・正味財産）を入力します。
      前期がある場合は「前期から繰越」で自動セットできます。収益・費用は毎期リセットされるため対象外です。
    </p>

    <div class="ob-carryover">
      <label for="obCarrySel">繰越先の正味財産科目</label>
      <select id="obCarrySel">${equityOptions}</select>
      <span class="ob-hint">前期の正味財産増減額をこの科目に繰り越します</span>
    </div>

    <div class="ob-balance" id="obBalance"></div>

    <div class="table-wrapper" style="margin-top:12px">
      <table>
        <thead><tr><th>勘定科目</th><th class="text-right" style="width:200px">期首残高</th></tr></thead>
        <tbody>
          ${sectionHtml('asset')}
          ${sectionHtml('liability')}
          ${sectionHtml('equity')}
        </tbody>
      </table>
    </div>

    <div class="form-actions" style="margin-top:16px">
      <button type="button" class="btn btn-primary" id="obSave">期首残高を保存</button>
    </div>
  </div>`;

  const inputs = [...el.querySelectorAll('.ob-input')];
  const balanceBox = el.querySelector('#obBalance');

  const recalc = () => {
    let dr = 0, cr = 0;
    inputs.forEach(i => {
      const v = yen(i.value);
      if (i.dataset.type === 'asset') dr += v; else cr += v;
    });
    const ok = dr === cr;
    balanceBox.className = 'ob-balance ' + (ok ? 'ok' : 'ng');
    balanceBox.innerHTML = `
      <span class="material-symbols-rounded">${ok ? 'check_circle' : 'error'}</span>
      <span>資産期首 <b>${fmt(dr)}</b> ／ 負債＋正味財産期首 <b>${fmt(cr)}</b>
      ${ok ? '・貸借一致' : `・差額 ${fmt(Math.abs(dr - cr))}`}</span>`;
  };
  inputs.forEach(i => i.addEventListener('input', recalc));
  recalc();

  el.querySelector('#obSave').addEventListener('click', async () => {
    const balances = inputs.map(i => ({
      account_id: parseInt(i.dataset.id),
      amount: yen(i.value),
    }));
    try {
      await api(`/periods/${pid}/opening-balances`, 'PUT', { balances });
      refreshIntegrity();
      toast('期首残高を保存しました');
    } catch (e) { alert(e.message); }
  });

  const carrySel = el.querySelector('#obCarrySel');
  if (carrySel) {
    carrySel.addEventListener('change', async () => {
      const accountId = parseInt(carrySel.value);
      if (!accountId) return;
      try {
        await api('/carryover-account', 'POST', { account_id: accountId });
        await loadAccounts();
        toast('繰越先の正味財産科目を変更しました');
      } catch (e) { alert(e.message); }
    });
  }

  el.querySelector('#obCarry').addEventListener('click', async () => {
    if (!confirm(`前期の期末残高を ${periodName} の期首残高として取り込みます。\n現在の入力内容は上書きされます。よろしいですか？`)) return;
    try {
      const r = await api(`/periods/${pid}/carry-forward`, 'POST', {});
      refreshIntegrity();
      await renderOpening(el);
      toast(`前期から ${r.count} 科目を繰り越しました（正味財産増減額 ${fmt(r.net_change)}）`);
    } catch (e) { alert(e.message); }
  });
}

// ===== B/S =====
async function renderBS(el) {
  const qs = state.currentPeriodId ? `?period_id=${state.currentPeriodId}` : '';
  const d = await api(`/balance-sheet${qs}`);

  function bsRows(items) {
    const cats = [...new Set(items.map(i => i.category || ''))];
    return cats.map(cat => {
      const catItems = items.filter(i => (i.category || '') === cat);
      let html = '';
      if (cat) {
        html += `<tr class="bs-cat-row"><td colspan="2">${cat}</td></tr>`;
      }
      html += catItems.map(item => `<tr>
        <td style="padding-left:${cat ? 32 : 20}px">${item.name}</td>
        <td class="text-right amount">${fmt(item.balance)}</td>
      </tr>`).join('');
      return html;
    }).join('');
  }

  function bsSection(label, items, total) {
    return `${bsRows(items)}
    <tr class="total-row"><td>${label}合計</td><td class="text-right amount">${fmt(total)}</td></tr>`;
  }

  const balanced = Math.abs(d.total_assets - (d.total_liabilities + d.total_equity)) < 1;
  el.innerHTML = `
  <div class="card">
    <div class="card-header">
      <h2>貸借対照表（B/S）</h2>
      <button class="btn btn-secondary btn-sm" onclick="window.print()">印刷</button>
    </div>
    <div class="stats-row no-print" style="margin-bottom:20px">
      <div class="stat-card bs-assets"><div class="label">資産合計</div><div class="value">${fmt(d.total_assets)}</div></div>
      <div class="stat-card bs-liab"><div class="label">負債合計</div><div class="value">${fmt(d.total_liabilities)}</div></div>
      <div class="stat-card bs-equity"><div class="label">正味財産合計</div><div class="value">${fmt(d.total_equity)}</div></div>
      <div class="stat-card bs-balance"><div class="label">貸借バランス</div><div class="value" style="font-size:16px">${balanced ? '一致 ✓' : '不一致 !'}</div></div>
    </div>
    <div class="bs-layout">
      <div>
        <h3 class="bs-section-h3">資産の部</h3>
        <table>${bsSection('資産', d.assets, d.total_assets)}</table>
      </div>
      <div>
        <h3 class="bs-section-h3">負債・正味財産の部</h3>
        <table>
          ${d.liabilities.length ? `
          <tr class="bs-label-head"><td colspan="2">負債の部</td></tr>
          ${bsSection('負債', d.liabilities, d.total_liabilities)}
          <tr><td colspan="2" style="height:12px"></td></tr>` : ''}
          <tr class="bs-label-head"><td colspan="2">正味財産の部</td></tr>
          ${bsSection('正味財産', d.equity, d.total_equity)}
          <tr class="total-row"><td>負債・正味財産合計</td><td class="text-right amount">${fmt(d.total_liabilities + d.total_equity)}</td></tr>
        </table>
      </div>
    </div>
    ${balanced ? '' :
      `<div class="bs-mismatch">
        ⚠ 貸借が一致していません（差額: ${fmt(Math.abs(d.total_assets - d.total_liabilities - d.total_equity))}）
      </div>`}
  </div>`;
}

// ===== 活動計算書（正味財産増減計算書） =====
async function renderPL(el) {
  const qs = state.currentPeriodId ? `?period_id=${state.currentPeriodId}` : '';
  const d = await api(`/profit-loss${qs}`);
  const t = d.totals;
  const s = d.sections;
  const revSecs = d.revenue_sections || [];
  const expSecs = d.expense_sections || [];

  // 区分（受取会費・事業費 等）の明細＋区分合計を描く。中分類(category)があれば小見出しに。
  function plSection(sectionName, items) {
    if (!items || !items.length) return '';
    const cats = [...new Set(items.map(i => i.category || ''))];
    let html = `<tr class="pl-section-head">
      <td colspan="2">${sectionName}</td>
    </tr>`;
    cats.forEach(cat => {
      const catItems = items.filter(i => (i.category || '') === cat);
      if (cat) {
        html += `<tr class="pl-cat"><td colspan="2">${cat}</td></tr>`;
      }
      html += catItems.map(item => `<tr>
        <td style="padding-left:${cat ? 36 : 24}px">${item.name}</td>
        <td class="text-right amount">${fmt(item.balance)}</td>
      </tr>`).join('');
    });
    const total = items.reduce((a, i) => a + i.balance, 0);
    html += `<tr class="pl-section-total">
      <td>${sectionName}計</td>
      <td class="text-right amount">${fmt(total)}</td>
    </tr>`;
    return html;
  }

  // 段階損益（当期経常増減額・当期正味財産増減額 など）の強調行
  function subtotal(label, amount) {
    const cls = amount >= 0 ? 'pos' : 'neg';
    return `<tr class="pl-subtotal ${cls}">
      <td>${label}</td>
      <td class="text-right amount">${fmt(amount)}</td>
    </tr>`;
  }

  // 区分グループ見出し（Ⅰ経常収益 等）
  const groupHead = (label) => `<tr class="pl-group"><td colspan="2">${label}</td></tr>`;

  const revRows = revSecs.map(sec => plSection(sec, s[sec])).join('');
  const expRows = expSecs.map(sec => plSection(sec, s[sec])).join('');
  const eoRevRows = plSection('経常外収益', s['経常外収益']);
  const eoExpRows = plSection('経常外費用', s['経常外費用']);
  const hasEO = (s['経常外収益'] && s['経常外収益'].length) || (s['経常外費用'] && s['経常外費用'].length);

  el.innerHTML = `
  <div class="card">
    <div class="card-header">
      <h2>損益計算書（P/L）</h2>
      <button class="btn btn-secondary btn-sm" onclick="window.print()">印刷</button>
    </div>
    <div class="stats-row">
      <div class="stat-card"><div class="label">経常収益計</div><div class="value" style="color:var(--success)">${fmt(t['経常収益計'])}</div></div>
      <div class="stat-card"><div class="label">経常費用計</div><div class="value" style="color:var(--text)">${fmt(t['経常費用計'])}</div></div>
      <div class="stat-card"><div class="label">当期経常増減額</div><div class="value" style="color:${t['当期経常増減額']>=0?'var(--success)':'var(--danger)'}">${fmt(t['当期経常増減額'])}</div></div>
      <div class="stat-card"><div class="label">当期正味財産増減額</div><div class="value" style="color:${t['当期正味財産増減額']>=0?'var(--primary)':'var(--danger)'}">${fmt(t['当期正味財産増減額'])}</div></div>
    </div>
    <table>
      <tbody>
        ${groupHead('Ⅰ 経常収益')}
        ${revRows || `<tr><td style="padding-left:24px;color:var(--text-muted)">（収益なし）</td><td class="text-right amount">${fmt(0)}</td></tr>`}
        ${subtotal('経常収益計', t['経常収益計'])}
        ${groupHead('Ⅱ 経常費用')}
        ${expRows || `<tr><td style="padding-left:24px;color:var(--text-muted)">（費用なし）</td><td class="text-right amount">${fmt(0)}</td></tr>`}
        ${subtotal('経常費用計', t['経常費用計'])}
        ${subtotal('当期経常増減額', t['当期経常増減額'])}
        ${hasEO ? `
          ${groupHead('Ⅲ 経常外収益')}
          ${eoRevRows || ''}
          ${groupHead('Ⅳ 経常外費用')}
          ${eoExpRows || ''}
        ` : ''}
      </tbody>
      <tfoot>
        ${subtotal('当期正味財産増減額', t['当期正味財産増減額'])}
        <tr>
          <td style="padding-left:16px;color:var(--text-muted)">前期繰越正味財産</td>
          <td class="text-right amount" style="color:var(--text-muted)">${fmt(t['前期繰越正味財産'])}</td>
        </tr>
        <tr class="total-row">
          <td>次期繰越正味財産</td>
          <td class="text-right amount">${fmt(t['次期繰越正味財産'])}</td>
        </tr>
      </tfoot>
    </table>
  </div>`;
}

// ===== 予実分析（予算実績対比） =====
// 会計期間ごとに収益/費用科目の予算を入力し、実績（活動計算書の数値）と
// 差異・達成率を即時比較する。予算はその場で編集→集計が再計算される。
async function renderBudget(el) {
  const pid = state.currentPeriodId;
  if (!pid) {
    el.innerHTML = `<div class="card"><div class="empty-state">
      <span class="material-symbols-rounded">event_busy</span>
      <p>予実分析は会計期間ごとに行います。<br>左下の「表示期間」で対象の年度を選んでください。</p>
    </div></div>`;
    return;
  }
  const period = state.periods.find(p => p.id == pid) || {};
  const locked = !!period.is_locked;
  const d = await api(`/budget-actual?period_id=${pid}`);
  const s = d.sections;
  const revSecs = d.revenue_sections;
  const expSecs = d.expense_sections;
  const hasExtraRev = (s[d.extra_revenue] || []).length > 0;
  const hasExtraExp = (s[d.extra_expense] || []).length > 0;

  // 区分の明細＋区分計。kind: rev=収益(実績>予算が良) / exp=費用(予算>実績が良)
  function secBlock(secName, kind) {
    const items = s[secName] || [];
    if (!items.length) return '';
    let html = `<tr class="bg-section-head"><td colspan="5">${secName}</td></tr>`;
    html += items.map(it => `<tr>
        <td style="padding-left:24px">${it.name}${it.category ? `<span class="bg-cat">${it.category}</span>` : ''}</td>
        <td class="text-right"><input type="number" class="bg-input" data-id="${it.id}"
            data-kind="${kind}" data-section="${secName}" data-actual="${it.actual}"
            value="${it.budget ? Math.round(it.budget) : ''}" placeholder="0" min="0" step="1"
            ${locked ? 'disabled' : ''}></td>
        <td class="text-right amount">${fmt(it.actual)}</td>
        <td class="text-right bg-var" data-id="${it.id}">-</td>
        <td class="text-right bg-rate" data-id="${it.id}">-</td>
      </tr>`).join('');
    html += `<tr class="bg-section-total" data-sectot="${secName}">
        <td>${secName}計</td>
        <td class="text-right bg-st-budget"></td>
        <td class="text-right bg-st-actual"></td>
        <td class="text-right bg-st-var"></td>
        <td class="text-right bg-st-rate"></td>
      </tr>`;
    return html;
  }
  const groupHead = (label) => `<tr class="bg-group"><td colspan="5">${label}</td></tr>`;
  const groupTotal = (id, label) => `<tr class="bg-group-total" id="${id}">
      <td>${label}</td>
      <td class="text-right bg-gt-budget"></td>
      <td class="text-right bg-gt-actual"></td>
      <td class="text-right bg-gt-var"></td>
      <td class="text-right bg-gt-rate"></td>
    </tr>`;
  const surplusRow = (id, label) => `<tr class="bg-surplus" id="${id}">
      <td>${label}</td>
      <td class="text-right bg-gt-budget"></td>
      <td class="text-right bg-gt-actual"></td>
      <td class="text-right bg-gt-var"></td>
      <td class="text-right bg-gt-rate"></td>
    </tr>`;

  const revRows = revSecs.map(sec => secBlock(sec, 'rev')).join('');
  const expRows = expSecs.map(sec => secBlock(sec, 'exp')).join('');

  // 年度プルダウン（締め済みは「（締）」を付す）。左下「表示期間」と連動する。
  const periodOpts = state.periods.map(p =>
    `<option value="${p.id}" ${p.id == pid ? 'selected' : ''}>${p.name}${p.is_locked ? '（締）' : ''}</option>`).join('');

  el.innerHTML = `
  <div class="card">
    <div class="card-header">
      <h2>予実分析（予算実績対比）</h2>
      <div style="display:flex;align-items:center;gap:12px">
        <div class="bg-period">
          <label for="bgPeriodSelect">対象年度</label>
          <select id="bgPeriodSelect">${periodOpts}</select>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="window.print()">印刷</button>
      </div>
    </div>
    <p class="ob-lead">
      <strong>${period.name || ''}</strong> の予算を入力すると、損益計算書の実績と比べた
      差異・達成率がその場で計算されます。収益は<b>達成率</b>（実績÷予算）、費用は<b>執行率</b>として表示します。
      ${locked ? '<br><span style="color:var(--danger)">この期間は締め済みのため予算は編集できません。</span>' : ''}
    </p>
    <div class="stats-row">
      <div class="stat-card"><div class="label">経常収益計（実績）</div>
        <div class="value" id="sumRevActual" style="color:var(--success)">-</div>
        <div class="stat-sub" id="sumRev">予算 - ・ 達成率 -</div></div>
      <div class="stat-card"><div class="label">経常費用計（実績）</div>
        <div class="value" id="sumExpActual">-</div>
        <div class="stat-sub" id="sumExp">予算 - ・ 執行率 -</div></div>
      <div class="stat-card"><div class="label">当期正味財産増減額（実績）</div>
        <div class="value" id="sumNetActual">-</div>
        <div class="stat-sub" id="sumNet">予算 - ・ 差異 -</div></div>
    </div>
    <div class="table-wrapper">
      <table class="bg-table">
        <thead><tr>
          <th>勘定科目</th>
          <th class="text-right" style="width:140px">予算</th>
          <th class="text-right" style="width:140px">実績</th>
          <th class="text-right" style="width:130px">差異</th>
          <th class="text-right" style="width:110px">達成率/執行率</th>
        </tr></thead>
        <tbody>
          ${groupHead('Ⅰ 経常収益')}
          ${revRows || `<tr><td colspan="5" style="padding-left:24px;color:var(--text-muted)">（該当なし）</td></tr>`}
          ${groupTotal('gtRev', '経常収益計')}
          ${groupHead('Ⅱ 経常費用')}
          ${expRows || `<tr><td colspan="5" style="padding-left:24px;color:var(--text-muted)">（該当なし）</td></tr>`}
          ${groupTotal('gtExp', '経常費用計')}
          ${surplusRow('gtKeijo', '当期経常増減額')}
          ${hasExtraRev ? groupHead('Ⅲ 経常外収益') + secBlock(d.extra_revenue, 'rev') : ''}
          ${hasExtraExp ? groupHead('Ⅳ 経常外費用') + secBlock(d.extra_expense, 'exp') : ''}
        </tbody>
        <tfoot>
          ${surplusRow('gtNet', '当期正味財産増減額')}
        </tfoot>
      </table>
    </div>
    <div class="form-actions" style="margin-top:16px">
      <button type="button" class="btn btn-primary" id="bgSave" ${locked ? 'disabled' : ''}>予算を保存</button>
    </div>
  </div>`;

  const inputs = [...el.querySelectorAll('.bg-input')];

  // 画面内の年度プルダウン。左下「表示期間」と state を共有し、切替で再描画する。
  el.querySelector('#bgPeriodSelect').addEventListener('change', e => {
    state.currentPeriodId = e.target.value ? parseInt(e.target.value) : null;
    const main = document.getElementById('periodSelect');
    if (main) main.value = e.target.value;
    render('budget');
    refreshIntegrity();
  });

  // 差異セルの表示（kind により「有利」の向きが逆）と着色
  function setVar(cell, budget, actual, kind) {
    if (!cell) return;
    if (!budget && !actual) { cell.textContent = '-'; cell.className = 'text-right bg-var'; return; }
    const fav = kind === 'rev' ? actual - budget : budget - actual;  // 正=有利
    cell.textContent = (fav >= 0 ? '+' : '−') + fmt(Math.abs(fav));
    cell.className = 'text-right bg-var ' + (fav >= 0 ? 'fav' : 'unfav');
  }
  function setRate(cell, budget, actual, kind) {
    if (!cell) return;
    if (!budget) { cell.textContent = '-'; cell.className = 'text-right bg-rate'; return; }
    const rate = actual / budget * 100;
    cell.textContent = rate.toFixed(0) + '%';
    // 収益は100%以上が良、費用は100%以下が良
    const good = kind === 'rev' ? rate >= 100 : rate <= 100;
    cell.className = 'text-right bg-rate ' + (good ? 'fav' : 'unfav');
  }

  function calc() {
    const sec = {};   // section -> {b,a,kind}
    inputs.forEach(inp => {
      const id = inp.dataset.id, kind = inp.dataset.kind, section = inp.dataset.section;
      const b = yen(inp.value), a = yen(inp.dataset.actual);
      setVar(el.querySelector(`.bg-var[data-id="${id}"]`), b, a, kind);
      setRate(el.querySelector(`.bg-rate[data-id="${id}"]`), b, a, kind);
      const g = sec[section] || (sec[section] = { b: 0, a: 0, kind });
      g.b += b; g.a += a;
    });
    // 区分計
    el.querySelectorAll('.bg-section-total').forEach(row => {
      const g = sec[row.dataset.sectot] || { b: 0, a: 0, kind: 'rev' };
      row.querySelector('.bg-st-budget').textContent = fmt(g.b);
      row.querySelector('.bg-st-actual').textContent = fmt(g.a);
      setVar(row.querySelector('.bg-st-var'), g.b, g.a, g.kind);
      setRate(row.querySelector('.bg-st-rate'), g.b, g.a, g.kind);
    });
    // 区分グループ合計
    const sum = (secs) => secs.reduce((acc, n) => {
      const g = sec[n]; if (g) { acc.b += g.b; acc.a += g.a; } return acc;
    }, { b: 0, a: 0 });
    const rev = sum(revSecs), exp = sum(expSecs);
    const eoRev = sec[d.extra_revenue] || { b: 0, a: 0 };
    const eoExp = sec[d.extra_expense] || { b: 0, a: 0 };
    const keijo = { b: rev.b - exp.b, a: rev.a - exp.a };
    const net = { b: keijo.b + eoRev.b - eoExp.b, a: keijo.a + eoRev.a - eoExp.a };

    const fillGroup = (id, g, kind) => {
      const row = el.querySelector('#' + id);
      row.querySelector('.bg-gt-budget').textContent = fmt(g.b);
      row.querySelector('.bg-gt-actual').textContent = fmt(g.a);
      setVar(row.querySelector('.bg-gt-var'), g.b, g.a, kind);
      setRate(row.querySelector('.bg-gt-rate'), g.b, g.a, kind);
    };
    fillGroup('gtRev', rev, 'rev');
    fillGroup('gtExp', exp, 'exp');
    fillGroup('gtKeijo', keijo, 'rev');   // 増減額は多いほど有利
    fillGroup('gtNet', net, 'rev');

    // サマリーカード
    const pct = (g) => g.b ? (g.a / g.b * 100).toFixed(0) + '%' : '-';
    el.querySelector('#sumRevActual').textContent = fmt(rev.a);
    el.querySelector('#sumRev').textContent = `予算 ${fmt(rev.b)} ・ 達成率 ${pct(rev)}`;
    el.querySelector('#sumExpActual').textContent = fmt(exp.a);
    el.querySelector('#sumExp').textContent = `予算 ${fmt(exp.b)} ・ 執行率 ${pct(exp)}`;
    const netEl = el.querySelector('#sumNetActual');
    netEl.textContent = fmt(net.a);
    netEl.style.color = net.a >= 0 ? 'var(--primary)' : 'var(--danger)';
    const diff = net.a - net.b;
    el.querySelector('#sumNet').textContent =
      `予算 ${fmt(net.b)} ・ 差異 ${diff >= 0 ? '+' : '−'}${fmt(Math.abs(diff))}`;
  }

  inputs.forEach(i => i.addEventListener('input', calc));
  calc();

  const saveBtn = el.querySelector('#bgSave');
  if (saveBtn && !locked) {
    saveBtn.addEventListener('click', async () => {
      const budgets = inputs.map(i => ({ account_id: parseInt(i.dataset.id), amount: yen(i.value) }));
      try {
        await api(`/periods/${pid}/budgets`, 'PUT', { budgets });
        toast('予算を保存しました');
      } catch (e) { alert(e.message); }
    });
  }
}
