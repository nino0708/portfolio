require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const cron = require('node-cron');
const { sendLine } = require('./line');
const { advanceTasks } = require('./tasks');
const {
  generateMorningBrief,
  generateEveningCheck,
  generateNightBrief,
  generateWeeklyReview,
} = require('./brief');

const log = (msg) => console.log(`[${new Date().toLocaleString('ja-JP')}] ${msg}`);

console.log('🤖 Friday スケジューラー起動');
console.log('━'.repeat(44));
console.log('⏰ 平日 08:00 - 朝のブリーフィング');
console.log('⏰ 平日 19:00 - 夕方の確認');
console.log('⏰ 平日 22:00 - 明日の準備');
console.log('⏰ 金曜 21:00 - 週次レビュー');
console.log('━'.repeat(44));

// 朝8時（平日）: 朝のブリーフィング
cron.schedule('0 8 * * 1-5', async () => {
  log('朝のブリーフィング実行');
  const n = advanceTasks();
  if (n > 0) log(`  ${n}件のタスクを「今日」に昇格`);
  await sendLine(generateMorningBrief()).catch(console.error);
}, { timezone: 'Asia/Tokyo' });

// 夜19時（平日）: 夕方確認
cron.schedule('0 19 * * 1-5', async () => {
  log('夕方の確認実行');
  await sendLine(generateEveningCheck()).catch(console.error);
}, { timezone: 'Asia/Tokyo' });

// 夜22時（平日）: 明日の準備
cron.schedule('0 22 * * 1-5', async () => {
  log('夜のブリーフィング実行');
  await sendLine(generateNightBrief()).catch(console.error);
}, { timezone: 'Asia/Tokyo' });

// 金曜21時: 週次レビュー
cron.schedule('0 21 * * 5', async () => {
  log('週次レビュー実行');
  await sendLine(generateWeeklyReview()).catch(console.error);
}, { timezone: 'Asia/Tokyo' });

// --test フラグ: 今すぐ朝のブリーフィングを実行してテスト
if (process.argv.includes('--test')) {
  console.log('\n🧪 テスト実行中...\n');
  advanceTasks();
  sendLine(generateMorningBrief())
    .then(() => console.log('テスト完了'))
    .catch(console.error);
}
