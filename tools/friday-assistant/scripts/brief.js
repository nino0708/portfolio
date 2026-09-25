const { getTodayTasks, getVipTasks, getUpcomingTasks, getAllActive } = require('./tasks');

const DAYS = ['日', '月', '火', '水', '木', '金', '土'];
const P_ICON = { high: '🔴', medium: '🟡', low: '🟢' };

function fmtDate(d) {
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日(${DAYS[d.getDay()]})`;
}

function taskLine(t) {
  const icon = P_ICON[t.priority] || '⚪';
  const due = t.dueDate ? ` [${t.dueDate}]` : '';
  return `  ${icon} ${t.title}${due}`;
}

function generateMorningBrief() {
  const today = getTodayTasks().sort((a, b) => {
    return ({ high: 0, medium: 1, low: 2 }[a.priority] || 1) -
           ({ high: 0, medium: 1, low: 2 }[b.priority] || 1);
  });
  const vip = getVipTasks();
  const dateStr = fmtDate(new Date());

  let msg = `🌅 おはようございます！\n【${dateStr}】\n`;

  if (vip.length > 0) {
    msg += `\n⭐ VIPタスク:\n` + vip.map(taskLine).join('\n') + '\n';
  }

  if (today.length === 0) {
    msg += `\n✅ 今日のタスク: なし\nゆっくりスタートしましょう！`;
  } else {
    msg += `\n📋 今日のタスク (${today.length}件):\n` + today.map(taskLine).join('\n');
    msg += `\n\n今日も頑張りましょう！💪`;
  }

  return msg;
}

function generateEveningCheck() {
  const remaining = getTodayTasks();
  const dateStr = fmtDate(new Date());

  let msg = `🌆 夕方の確認\n【${dateStr}】\n`;

  if (remaining.length === 0) {
    msg += `\n🎉 今日のタスクは全完了！\nお疲れ様でした。`;
  } else {
    msg += `\n⏳ 未完了: ${remaining.length}件\n` + remaining.map(taskLine).join('\n');
    msg += `\n\n残りもあと少し！`;
  }

  return msg;
}

function generateNightBrief() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tmrStr = tomorrow.toISOString().split('T')[0];
  const dateStr = fmtDate(tomorrow);

  const tmrTasks = getUpcomingTasks().filter(t => t.dueDate === tmrStr);

  let msg = `🌙 明日の準備\n【${dateStr}】\n`;

  if (tmrTasks.length > 0) {
    msg += `\n📋 明日の予定タスク (${tmrTasks.length}件):\n` + tmrTasks.map(taskLine).join('\n');
  } else {
    msg += `\n明日の予定タスクはありません。`;
  }

  msg += `\n\nゆっくり休んでください 😴`;
  return msg;
}

function generateWeeklyReview() {
  const all = getAllActive();
  const high = all.filter(t => t.priority === 'high');
  const medium = all.filter(t => t.priority === 'medium');

  let msg = `📊 週次レビュー\n`;
  msg += `アクティブタスク: ${all.length}件\n`;
  msg += `  🔴 高優先度: ${high.length}件\n`;
  msg += `  🟡 中優先度: ${medium.length}件\n`;

  if (high.length > 0) {
    msg += `\n🔴 要対応タスク:\n` + high.slice(0, 5).map(taskLine).join('\n');
  }

  msg += `\n\n今週もお疲れ様でした！`;
  return msg;
}

module.exports = { generateMorningBrief, generateEveningCheck, generateNightBrief, generateWeeklyReview };
