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
  el.innerHTML = '<div style="text-align:center;padding:40px;color:#94a3b8">読み込み中...</div>';
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
    el.innerHTML = `<div style="color:red;padding:20px">${e.message}</div>`;
  }
}

// ===== Journal Entry Form =====
// ===== 複合仕訳の明細行UI（借方・貸方を最大5行まで） =====
const MAX_LINES = 5;

function jLineRow(side, line) {
  const amt = line && line.amount ? line.amount : '';
  return `<div class="jline">
    <select class="jline-acc">
      <option value="">科目を選択</option>${buildAccountOptions(line ? line.account_id : null, line ? line.sub_account_id : null)}
    </select>
    <input class="jline-amt" type="number" min="1" step="1" placeholder="0" value="${amt}">
    <button type="button" class="jline-del" title="この行を削除">✕</button>
  </div>`;
}

function jSide(side, label, lines) {
  const src = (lines && lines.length) ? lines : [null];
  const rows = src.map(l => jLineRow(side, l)).join('');
  return `<div class="jside" data-side="${side}">
    <div class="jside-head">
      <span class="jside-label jside-${side}">${label}</span>
      <span class="jside-total" data-total>0 円</span>
    </div>
    <div class="jlines">${rows}</div>
    <button type="button" class="jline-add btn btn-secondary btn-sm">＋ ${label}を追加</button>
  </div>`;
}

function compoundBlock(debitLines, creditLines) {
  return `<div class="compound">
    <div class="compound-grid">
      ${jSide('debit', '借方', debitLines)}
      ${jSide('credit', '貸方', creditLines)}
    </div>
    <div class="balance-bar">
      <span class="bb-item">借方合計 <strong data-sum-debit>0 円</strong></span>
      <span class="bb-item">貸方合計 <strong data-sum-credit>0 円</strong></span>
      <span class="balance-diff" data-diff>差額 0 円</span>
    </div>
  </div>`;
}

function bindCompound(root, onChange) {
  function recompute() {
    const sums = { debit: 0, credit: 0 };
    root.querySelectorAll('.jside').forEach(sd => {
      let t = 0;
      sd.querySelectorAll('.jline-amt').forEach(i => { t += yen(i.value); });
      sums[sd.dataset.side] = t;
      sd.querySelector('[data-total]').textContent = fmt(t);
    });
    root.querySelector('[data-sum-debit]').textContent = fmt(sums.debit);
    root.querySelector('[data-sum-credit]').textContent = fmt(sums.credit);
    const diff = sums.debit - sums.credit;
    const balanced = diff === 0 && sums.debit > 0;
    const diffEl = root.querySelector('[data-diff]');
    diffEl.textContent = balanced ? '貸借一致 ✓' : `差額 ${fmt(Math.abs(diff))}`;
    diffEl.classList.toggle('ok', balanced);
    diffEl.classList.toggle('ng', !balanced);
    if (onChange) onChange(balanced);
  }
  root.addEventListener('input', e => {
    if (e.target.classList.contains('jline-amt')) recompute();
  });
  root.addEventListener('click', e => {
    const addBtn = e.target.closest('.jline-add');
    if (addBtn) {
      const sd = addBtn.closest('.jside');
      const lines = sd.querySelector('.jlines');
      if (lines.querySelectorAll('.jline').length >= MAX_LINES) {
        alert(`${sd.dataset.side === 'debit' ? '借方' : '貸方'}は最大${MAX_LINES}行までです`);
        return;
      }
      lines.insertAdjacentHTML('beforeend', jLineRow(sd.dataset.side, null));
      recompute();
      return;
    }
    const delBtn = e.target.closest('.jline-del');
    if (delBtn) {
      const sd = delBtn.closest('.jside');
      const lines = sd.querySelector('.jlines');
      const row = delBtn.closest('.jline');
      if (lines.querySelectorAll('.jline').length <= 1) {
        row.querySelector('.jline-acc').value = '';
        row.querySelector('.jline-amt').value = '';
      } else {
        row.remove();
      }
      recompute();
    }
  });
  recompute();
}

function collectCompound(root) {
  const out = { debit_lines: [], credit_lines: [] };
  root.querySelectorAll('.jside').forEach(sd => {
    const key = sd.dataset.side + '_lines';
    sd.querySelectorAll('.jline').forEach(row => {
      const sel = parseAccountSel(row.querySelector('.jline-acc').value);
      const amt = yen(row.querySelector('.jline-amt').value);
      if (sel.account_id && amt > 0) {
        out[key].push({ account_id: sel.account_id, sub_account_id: sel.sub_account_id, amount: amt });
      }
    });
  });
  return out;
}

// ===== かんたん入力アシスタント（簿記知識ゼロ向け） =====
// 借方/貸方の代わりに「何があったか」を選ぶだけ。あなたの勘定科目と仕訳履歴から
// サジェストを自動生成するので、どんな科目構成にも自動で適応する。
function acById(id) { return state.accounts.find(a => a.id === id); }
function accLabel(a) { return a && a.category ? `${a.name}（${a.category}）` : (a ? a.name : ''); }

// 「お金の入口/出口」になりやすい資産科目（現金・預金など）
function moneyAccounts() {
  const assets = state.accounts.filter(a => a.account_type === 'asset');
  const money = assets.filter(a => /現金|預金|口座|当座|普通|cash|bank/i.test(a.name));
  return (money.length ? money : assets);
}
function defaultMoneyId() {
  const m = moneyAccounts();
  const cash = m.find(a => /現金/.test(a.name));
  return (cash || m[0] || {}).id || null;
}

// 借方・貸方の科目タイプから自然な言い回しを生成
function suggMeta(debitId, creditId) {
  const d = acById(debitId), c = acById(creditId);
  if (!d || !c) return null;
  const dt = d.account_type, ct = c.account_type;
  // dir: 'in'＝お金が入る（緑・下向き矢印） / 'out'＝お金が出る（赤・上向き矢印） / 'move'＝移動 / null＝その他
  if (dt === 'expense' && ct !== 'expense')
    return { icon: 'arrow_circle_up', dir: 'out', label: `${accLabel(d)}を支払う`, eff: `「${d.name}」の費用として記録します` };
  if (ct === 'revenue' && dt !== 'revenue')
    return { icon: 'arrow_circle_down', dir: 'in', label: `${accLabel(c)}を受け取る`, eff: `「${c.name}」の収入として記録します` };
  if (dt === 'asset' && ct === 'asset')
    return { icon: 'swap_horiz', dir: 'move', label: `${c.name} → ${d.name} へ移す`, eff: '資金の移動として記録します' };
  if (dt === 'asset' && ct === 'liability')
    return { icon: 'arrow_circle_down', dir: 'in', label: `${accLabel(c)}で受け取る・借りる`, eff: `「${c.name}」が増えます` };
  if (dt === 'liability' && ct === 'asset')
    return { icon: 'arrow_circle_up', dir: 'out', label: `${accLabel(d)}を返済・支払う`, eff: `「${d.name}」が減ります` };
  if (dt === 'expense' && ct === 'liability')
    return { icon: 'arrow_circle_up', dir: 'out', label: `${accLabel(d)}を後払いで計上`, eff: `あとで払う「${c.name}」として記録します` };
  return { icon: 'receipt_long', dir: null, label: `${d.name} ／ ${c.name}`, eff: `借方「${d.name}」・貸方「${c.name}」` };
}

// 履歴・科目からサジェスト候補（{debit_id, credit_id, fund}）を生成
function buildSuggestions(entries) {
  const money = defaultMoneyId();
  // ① よく使う取引（過去の1対1仕訳の頻度トップ）
  const freq = {};
  (entries || []).forEach(e => {
    if (e.debit_lines && e.debit_lines.length === 1 && e.credit_lines && e.credit_lines.length === 1) {
      const d = e.debit_lines[0].account_id, c = e.credit_lines[0].account_id;
      const k = d + '>' + c;
      (freq[k] = freq[k] || { debit_id: d, credit_id: c, n: 0 }).n++;
    }
  });
  const history = Object.values(freq).sort((a, b) => b.n - a.n).slice(0, 8)
    .map(f => ({ debit_id: f.debit_id, credit_id: f.credit_id, fund: null }));
  // ② 支払い・経費（費用科目ごと、相手はお金＝選択可）
  const expense = state.accounts.filter(a => a.account_type === 'expense')
    .map(a => ({ debit_id: a.id, credit_id: money, fund: 'credit' }));
  // ③ 入金・収益（収益科目ごと、相手はお金＝選択可）
  const revenue = state.accounts.filter(a => a.account_type === 'revenue')
    .map(a => ({ debit_id: money, credit_id: a.id, fund: 'debit' }));
  return { history, expense, revenue };
}

function suggCardHtml(s, idx, section) {
  const meta = suggMeta(s.debit_id, s.credit_id);
  if (!meta) return '';
  return `<button type="button" class="assist-card" data-sec="${section}" data-idx="${idx}">
    <span class="material-symbols-rounded ac-ico${meta.dir ? ' ac-ico--' + meta.dir : ''}">${meta.icon}</span>
    <span class="ac-label">${meta.label}</span>
    <span class="ac-eff">${meta.eff}</span>
  </button>`;
}

// ===== 日本語あいまい検索ヘルパー =====
// ひらがな入力でも漢字・カタカナの科目にヒットさせるための正規化。
// ① jaFold: 全半角・カタカナ→ひらがな・記号/空白除去・小文字化
// ② KANJI_YOMI/jaReadings: 会計でよく使う漢字の読みから「読みがな」を生成（複数読みは直積で列挙）
function jaFold(s) {
  return String(s == null ? '' : s)
    .normalize('NFKC')                                  // 全角英数・半角カナを正規化
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60))  // カタカナ→ひらがな
    .replace(/[ー・〜～\s　.,，、。／/\-－]/g, '');  // 長音・中黒・空白・区切りを除去
}

// 会計＆画面でよく使う漢字の読み（あいまい検索用の簡易辞書。複数読みは配列で持つ）
const KANJI_YOMI = {
  会:['かい'],費:['ひ'],現:['げん'],金:['きん','がね'],預:['よ'],貯:['ちょ'],普:['ふ'],通:['つう'],当:['とう'],座:['ざ'],口:['くち','こう'],
  売:['うり','ばい'],上:['あげ','じょう'],仕:['し'],入:['いれ','にゅう'],高:['だか','こう'],卸:['おろし'],
  給:['きゅう'],料:['りょう'],賞:['しょう'],与:['よ'],報:['ほう'],酬:['しゅう'],役:['やく'],員:['いん'],厚:['こう'],生:['せい'],
  家:['や','か'],賃:['ちん'],地:['ち'],代:['だい'],水:['すい'],道:['どう'],光:['こう'],熱:['ねつ'],電:['でん'],気:['き'],信:['しん'],
  交:['こう'],際:['さい'],接:['せっ'],待:['たい'],議:['ぎ'],旅:['りょ'],宿:['しゅく'],泊:['はく'],出:['しゅっ','で'],張:['ちょう'],
  消:['しょう'],耗:['もう'],品:['ひん'],事:['じ'],務:['む'],用:['よう'],雑:['ざつ'],広:['こう'],告:['こく'],宣:['せん'],伝:['でん'],
  租:['そ'],税:['ぜい'],公:['こう'],課:['か'],保:['ほ'],険:['けん'],減:['げん'],価:['か'],償:['しょう'],却:['きゃく'],
  支:['し'],払:['はらい','ばらい'],受:['うけ','じゅ'],取:['とり'],利:['り'],息:['そく'],配:['はい'],寄:['き'],付:['ふ'],損:['そん'],益:['えき'],
  資:['し'],本:['ほん','もと'],繰:['くり'],越:['こし'],純:['じゅん'],別:['べつ'],途:['と'],積:['つみ'],立:['たて'],
  建:['たて'],物:['もの','ぶつ'],備:['び'],機:['き'],械:['かい'],装:['そう'],車:['しゃ'],両:['りょう'],運:['うん'],搬:['ぱん'],具:['ぐ'],工:['こう'],
  土:['と'],商:['しょう'],製:['せい'],材:['ざい'],蔵:['ぞう'],店:['てん'],
  貸:['かし'],借:['かり'],負:['ふ'],債:['さい'],産:['さん'],流:['りゅう'],固:['こ'],定:['じょう','てい'],
  原:['げん'],販:['はん'],管:['かん'],理:['り'],営:['えい'],業:['ぎょう'],経:['けい'],常:['じょう'],特:['とく'],
  未:['み'],収:['しゅう'],納:['のう'],済:['ずみ'],替:['かえ','がえ'],仮:['かり'],前:['まえ','ぜん'],
  試:['し'],算:['さん'],表:['ひょう'],訳:['わけ'],帳:['ちょう'],元:['もと','げん'],勘:['かん'],照:['しょう'],対:['たい'],
  監:['かん'],査:['さ'],予:['よ'],実:['じつ'],分:['ぶん'],析:['せき'],月:['げつ','つき'],次:['じ'],推:['すい'],移:['い'],比:['ひ'],較:['かく'],増:['ぞう'],
  株:['かぶ'],主:['しゅ','ぬし'],変:['へん'],動:['どう'],計:['けい'],書:['しょ'],期:['き'],首:['しゅ'],残:['ざん'],設:['せつ'],
  宴:['えん'],酒:['さけ','しゅ'],飲:['いん'],食:['しょく'],部:['ぶ'],門:['もん'],科:['か'],目:['もく'],
};
function jaReadings(s) {
  // 各文字の読み候補の直積で、考えられる読みがなを列挙（科目名は短いので現実的）
  let combos = [''];
  for (const ch of String(s || '')) {
    const ys = KANJI_YOMI[ch];
    if (ys) {
      const next = [];
      for (const base of combos) for (const y of ys) next.push(base + y);
      combos = next.length > 256 ? [next[0]] : next;   // 念のため打ち切り
    } else {
      combos = combos.map(b => b + ch);                // 非漢字はそのまま連結（後でjaFoldで畳む）
    }
  }
  return combos;
}
// テキストから検索用の干し草（原文＋読みがな）を作る
function jaHaystack(text) {
  return jaFold(text) + ' ' + jaReadings(text).map(jaFold).join(' ');
}
// q のトークンが干し草に含まれるか（部分一致、ダメなら部分列でさらに緩く）
function jaMatch(haystack, q) {
  const tokens = String(q || '').trim().split(/\s+/).map(jaFold).filter(Boolean);
  if (!tokens.length) return true;
  return tokens.every(t => haystack.includes(t) || isSubseq(haystack, t));
}
// 部分列（タイプミス・送り仮名揺れ救済）。ただし文字飛ばしは少しだけ許容し、
// 語をまたいだ無関係なヒットを防ぐためスパンを制限する。
function isSubseq(hay, t) {
  if (!t) return true;
  const maxSpan = t.length + 3;
  for (let start = 0; start <= hay.length - t.length; start++) {
    if (hay[start] !== t[0]) continue;
    let i = 1, j = start + 1;
    while (j < hay.length && i < t.length && j - start <= maxSpan) {
      if (hay[j] === t[i]) i++;
      j++;
    }
    if (i === t.length) return true;
  }
  return false;
}

function matchSugg(s, q) {
  if (!q || !q.trim()) return true;
  const d = acById(s.debit_id), c = acById(s.credit_id), meta = suggMeta(s.debit_id, s.credit_id);
  const raw = [d && d.name, d && d.category, c && c.name, c && c.category, meta && meta.label]
    .filter(Boolean).join(' ');
  return jaMatch(jaHaystack(raw), q);
}

function assistPatternsHtml(q) {
  const sug = state._assistSug || { history: [], expense: [], revenue: [] };
  const sections = [
    ['history', 'よく使う取引'],
    ['revenue', '入金・収益'],
    ['expense', '支払い・経費'],
  ];
  let html = '';
  sections.forEach(([key, title]) => {
    const items = sug[key].map((s, i) => [s, i]).filter(([s]) => matchSugg(s, q));
    if (!items.length) return;
    html += `<div class="assist-cat">${title}</div><div class="assist-grid">
      ${items.map(([s, i]) => suggCardHtml(s, i, key)).join('')}</div>`;
  });
  if (!html) return `
    <div class="assist-empty">
      <span class="material-symbols-rounded">search_off</span>
      <p>「${q}」に近い取引が見つかりませんでした。<br>別の言葉で探すか、右上をオフにして詳細入力に切り替えられます。</p>
    </div>`;
  return html;
}

function assistConfirmHtml(s) {
  const meta = suggMeta(s.debit_id, s.credit_id);
  const d = acById(s.debit_id), c = acById(s.credit_id);
  let fundField = '';
  if (s.fund) {
    const label = s.fund === 'credit' ? 'お金の出どころ' : '入金先';
    const sel = s.fund === 'credit' ? s.credit_id : s.debit_id;
    const opts = moneyAccounts().map(a =>
      `<option value="${a.id}" ${a.id === sel ? 'selected' : ''}>${a.name}</option>`).join('');
    fundField = `<div class="form-group" style="grid-column:1/3"><label>${label}</label><select id="acFund">${opts}</select></div>`;
  }
  return `
    <button type="button" class="assist-back" id="assistBack"><span class="material-symbols-rounded">arrow_back</span> 別の取引を選ぶ</button>
    <div class="ac-chosen">
      <span class="material-symbols-rounded ac-ico${meta.dir ? ' ac-ico--' + meta.dir : ''}">${meta.icon}</span>
      <div><div class="ac-chosen-label">${meta.label}</div><div class="ac-chosen-eff">${meta.eff}</div></div>
    </div>
    <div class="form-grid cols-2" style="margin-top:14px">
      <div class="form-group"><label>日付 *</label><input type="date" id="acDate" required value="${new Date().toISOString().slice(0,10)}"></div>
      <div class="form-group"><label>金額 *</label><input type="number" id="acAmount" min="1" step="1" placeholder="0" required></div>
      ${fundField}
      <div class="form-group" style="grid-column:1/3"><label>摘要</label><input type="text" id="acDesc" value="${meta.label}"></div>
      <div class="form-group" style="grid-column:1/3"><label>メモ（任意）</label><input type="text" id="acMemo" placeholder="補足があれば"></div>
    </div>
    <div class="ac-tech"><span class="material-symbols-rounded">info</span> 簿記の記録：<b>借方</b> <span id="acTechD">${d.name}</span> ／ <b>貸方</b> <span id="acTechC">${c.name}</span></div>
    <div class="form-actions" style="margin-top:14px">
      <button type="button" class="btn btn-primary" id="acSubmit">この内容で記録する</button>
    </div>`;
}

function renderAssistant() {
  return `
  <div class="assist">
    <p class="assist-lead">「何があったか」を選ぶだけ。借方・貸方は自動で設定します。</p>
    <div class="assist-search">
      <span class="material-symbols-rounded">search</span>
      <input type="text" id="assistSearch" placeholder="科目名や取引で検索（例：会費、交通費、イベント）" autocomplete="off">
    </div>
    <div id="assistPatterns"><div class="assist-empty"><span class="material-symbols-rounded">hourglass_top</span><p>読み込み中…</p></div></div>
    <div id="assistConfirm" class="assist-confirm" hidden></div>
  </div>`;
}

function renderManualForm() {
  return `
    <form id="entryForm">
      <div class="form-grid cols-2">
        <div class="form-group">
          <label>日付 *</label>
          <input type="date" name="entry_date" required value="${new Date().toISOString().slice(0,10)}">
        </div>
        <div class="form-group">
          <label>摘要</label>
          <input type="text" name="description" placeholder="取引の内容">
        </div>
      </div>
      <div id="journalCompound" style="margin-top:16px">${compoundBlock()}</div>
      <div class="form-group" style="margin-top:12px">
        <label>メモ</label>
        <input type="text" name="memo" placeholder="補足メモ">
      </div>
      <div class="form-actions" style="margin-top:16px">
        <button type="button" class="btn btn-primary" id="entrySubmitBtn">＋ 仕訳を登録</button>
      </div>
    </form>`;
}

function renderJournal() {
  const now = new Date();
  const hour = now.getHours();
  const greet = hour < 11 ? 'おはようございます' : hour < 18 ? 'こんにちは' : 'お疲れさまです';
  const dateStr = now.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
  const periodName = (state.periods.find(p => p.id == state.currentPeriodId) || {}).name || '全期間';
  return `
  <div class="hero">
    <div class="hero-text">
      <span class="hero-eyebrow"><span class="material-symbols-rounded">auto_awesome</span> Kaikei 会計ダッシュボード</span>
      <h2>${greet} 👋</h2>
      <p>${dateStr} ・ 表示期間 <strong>${periodName}</strong></p>
    </div>
    <div class="hero-actions">
      <button class="hero-chip" data-jump="ledger"><span class="material-symbols-rounded">menu_book</span> 仕訳帳</button>
      <button class="hero-chip" data-jump="trial"><span class="material-symbols-rounded">calculate</span> 試算表</button>
      <button class="hero-chip" data-jump="pl"><span class="material-symbols-rounded">trending_up</span> 損益計算書</button>
      <button class="hero-chip" data-jump="bs"><span class="material-symbols-rounded">balance</span> 貸借対照表</button>
    </div>
  </div>
  <div class="card">
    <div class="card-header">
      <h2>仕訳入力</h2>
      <label class="switch" title="簿記が分からなくても、取引を選ぶだけで入力できます">
        <span class="switch-label"><span class="material-symbols-rounded">assistant</span> かんたん入力</span>
        <input type="checkbox" id="assistToggle" ${state.assist ? 'checked' : ''} onchange="toggleAssist(this.checked)">
        <span class="switch-track"><span class="switch-thumb"></span></span>
      </label>
    </div>
    ${state.assist ? renderAssistant() : renderManualForm()}
  </div>
  <div class="card" id="recentCard">
    <div class="card-header">
      <h2>直近の仕訳</h2>
      <button class="btn btn-secondary btn-sm" onclick="navigate('ledger')">仕訳帳を見る →</button>
    </div>
    <div id="recentEntries" class="table-wrapper">読み込み中...</div>
  </div>`;
}

window.toggleAssist = (checked) => {
  state.assist = checked;
  localStorage.setItem('kaikei_assist', checked ? '1' : '0');
  render('journal');
};

function bindJournal() {
  loadRecentEntries();
  document.querySelectorAll('.hero-chip[data-jump]').forEach(b =>
    b.addEventListener('click', () => navigate(b.dataset.jump)));
  if (state.assist) bindAssistant();
  else bindManual();
}

async function bindAssistant() {
  const search = document.getElementById('assistSearch');
  const patterns = document.getElementById('assistPatterns');
  const confirm = document.getElementById('assistConfirm');
  const searchBox = search.closest('.assist-search');

  // あなたの科目構成と仕訳履歴からサジェストを生成
  let entries = [];
  try { entries = await api('/entries'); } catch (e) { /* 履歴なしでも科目から提案 */ }
  state._assistSug = buildSuggestions(entries);
  patterns.innerHTML = assistPatternsHtml('');

  search.addEventListener('input', () => { patterns.innerHTML = assistPatternsHtml(search.value); });

  patterns.addEventListener('click', e => {
    const card = e.target.closest('.assist-card');
    if (!card) return;
    const sec = card.dataset.sec, idx = parseInt(card.dataset.idx);
    const s = (state._assistSug[sec] || [])[idx];
    if (!s) return;
    const meta = suggMeta(s.debit_id, s.credit_id);
    confirm.innerHTML = assistConfirmHtml(s);
    confirm.hidden = false; patterns.hidden = true; searchBox.hidden = true;
    const amt = document.getElementById('acAmount');
    if (amt) amt.focus();

    // お金の出どころ/入金先を変えたら借方/貸方の表示も更新
    const fund = document.getElementById('acFund');
    if (fund) {
      fund.addEventListener('change', () => {
        const id = parseInt(fund.value);
        const techD = document.getElementById('acTechD'), techC = document.getElementById('acTechC');
        if (s.fund === 'credit') techC.textContent = (acById(id) || {}).name || '';
        else techD.textContent = (acById(id) || {}).name || '';
      });
    }

    document.getElementById('assistBack').addEventListener('click', () => {
      confirm.hidden = true; patterns.hidden = false; searchBox.hidden = false;
    });
    document.getElementById('acSubmit').addEventListener('click', async () => {
      const date = document.getElementById('acDate').value;
      const amount = yen(document.getElementById('acAmount').value);
      const desc = document.getElementById('acDesc').value;
      const memo = document.getElementById('acMemo').value;
      if (!date) { alert('日付を入力してください'); return; }
      if (!(amount > 0)) { alert('金額を入力してください'); return; }
      let debitId = s.debit_id, creditId = s.credit_id;
      if (fund) {
        const id = parseInt(fund.value);
        if (s.fund === 'credit') creditId = id; else debitId = id;
      }
      if (!acById(debitId) || !acById(creditId)) { alert('勘定科目が見つかりません'); return; }
      try {
        await api('/entries', 'POST', {
          entry_date: date, description: desc || meta.label, memo: memo || '',
          debit_lines: [{ account_id: debitId, amount }],
          credit_lines: [{ account_id: creditId, amount }],
        });
        confirm.innerHTML = `
          <div class="assist-done">
            <span class="material-symbols-rounded">check_circle</span>
            <span>「${meta.label}」を記録しました！</span>
            <button type="button" class="btn btn-primary btn-sm" id="acAgain">続けて入力する</button>
          </div>`;
        document.getElementById('acAgain').addEventListener('click', () => render('journal'));
        loadRecentEntries();
        refreshIntegrity();
      } catch (err) { alert(err.message); }
    });
  });
}

function bindManual() {
  const form = document.getElementById('entryForm');
  form.addEventListener('keydown', e => { if (e.key === 'Enter') e.preventDefault(); });

  const compound = document.getElementById('journalCompound');
  const submitBtn = document.getElementById('entrySubmitBtn');
  bindCompound(compound, balanced => {
    submitBtn.disabled = !balanced;
    submitBtn.title = balanced ? '' : '借方合計と貸方合計を一致させてください';
  });

  submitBtn.addEventListener('click', async () => {
    if (!form.reportValidity()) return;
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    const lines = collectCompound(compound);
    if (!lines.debit_lines.length || !lines.credit_lines.length) {
      alert('借方・貸方をそれぞれ1行以上入力してください');
      return;
    }
    const dSum = lines.debit_lines.reduce((s, l) => s + l.amount, 0);
    const cSum = lines.credit_lines.reduce((s, l) => s + l.amount, 0);
    if (Math.round((dSum - cSum) * 100) !== 0) {
      alert('借方合計と貸方合計が一致していません');
      return;
    }
    try {
      await api('/entries', 'POST', {
        entry_date: data.entry_date,
        description: data.description || '',
        memo: data.memo || '',
        ...lines,
      });
      // フォームをリセット（明細UIも初期状態に戻す）
      form.reset();
      form.entry_date.value = new Date().toISOString().slice(0, 10);
      compound.innerHTML = compoundBlock();
      bindCompound(compound, balanced => {
        submitBtn.disabled = !balanced;
        submitBtn.title = balanced ? '' : '借方合計と貸方合計を一致させてください';
      });
      loadRecentEntries();
      refreshIntegrity();
    } catch (err) { alert(err.message); }
  });
}

// 明細行リストを「科目 / 補助 ¥金額」の改行付きテキストにする
function linesLabel(lines) {
  if (!lines || !lines.length) return '';
  return lines.map(l => {
    const name = l.sub_account_name ? `${l.account_name} / ${l.sub_account_name}` : l.account_name;
    return `<div class="line-item"><span>${name}</span><span class="amount">${fmt(l.amount)}</span></div>`;
  }).join('');
}

async function loadRecentEntries() {
  const entries = await api(`/entries${state.currentPeriodId ? '?period_id=' + state.currentPeriodId : ''}`);
  const recent = entries.slice(-10).reverse();
  const el = document.getElementById('recentEntries');
  if (!el) return;
  if (!recent.length) { el.innerHTML = '<p class="text-muted" style="padding:16px">仕訳がありません</p>'; return; }
  el.innerHTML = `<table>
    <thead><tr><th>日付</th><th>借方</th><th>貸方</th><th class="text-right">金額</th><th>摘要</th></tr></thead>
    <tbody>${recent.map(e => `
      <tr>
        <td>${e.entry_date}</td>
        <td class="cell-lines">${linesLabel(e.debit_lines)}</td>
        <td class="cell-lines">${linesLabel(e.credit_lines)}</td>
        <td class="text-right amount">${fmt(e.amount)}</td>
        <td class="text-muted">${e.description || ''}</td>
      </tr>`).join('')}
    </tbody>
  </table>`;
}

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
        html += `<tr style="background:#f8fafc">
          <td colspan="2" style="padding:5px 8px 3px 16px;font-weight:600;font-size:13px;color:#64748b">${cat}</td>
        </tr>`;
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

  el.innerHTML = `
  <div class="card">
    <div class="card-header">
      <h2>貸借対照表（B/S）</h2>
      <button class="btn btn-secondary btn-sm" onclick="window.print()">印刷</button>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
      <div>
        <h3 style="margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid var(--border)">資産の部</h3>
        <table>${bsSection('資産', d.assets, d.total_assets)}</table>
      </div>
      <div>
        <h3 style="margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid var(--border)">負債・正味財産の部</h3>
        <table>
          ${d.liabilities.length ? `
          <tr><td colspan="2" style="font-weight:700;padding:6px 0 4px;font-size:14px">負債の部</td></tr>
          ${bsSection('負債', d.liabilities, d.total_liabilities)}
          <tr><td colspan="2" style="height:12px"></td></tr>` : ''}
          <tr><td colspan="2" style="font-weight:700;padding:6px 0 4px;font-size:14px">正味財産の部</td></tr>
          ${bsSection('正味財産', d.equity, d.total_equity)}
          <tr class="total-row"><td>負債・正味財産合計</td><td class="text-right amount">${fmt(d.total_liabilities + d.total_equity)}</td></tr>
        </table>
      </div>
    </div>
    ${Math.abs(d.total_assets - (d.total_liabilities + d.total_equity)) < 1 ? '' :
      `<div style="margin-top:16px;padding:12px;background:#fef2f2;border-radius:8px;color:var(--danger)">
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

init();

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
