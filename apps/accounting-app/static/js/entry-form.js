// 仕訳入力フォーム・複合仕訳・かんたん入力アシスタント・あいまい検索
// 読み込み順は templates/index.html の <script> の並び。トップレベルの const/let/function は全ファイルで共有される。

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
