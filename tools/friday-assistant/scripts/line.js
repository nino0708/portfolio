const https = require('https');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

function sendLine(message) {
  return new Promise((resolve, reject) => {
    const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const userId = process.env.LINE_USER_ID;

    // LINE未設定の場合はターミナルに表示するだけ
    if (!token || !userId || token === 'your_channel_access_token_here') {
      console.log('\n📱 [LINE未設定 - コンソール出力]');
      console.log('━'.repeat(44));
      console.log(message);
      console.log('━'.repeat(44) + '\n');
      return resolve();
    }

    const body = JSON.stringify({
      to: userId,
      messages: [{ type: 'text', text: message }],
    });

    const req = https.request(
      {
        hostname: 'api.line.me',
        path: '/v2/bot/message/push',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          if (res.statusCode === 200) {
            console.log('✅ LINE送信完了');
            resolve();
          } else {
            console.error('LINE送信エラー:', res.statusCode, data);
            reject(new Error(data));
          }
        });
      }
    );

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// CLI: node scripts/line.js send "メッセージ"
if (require.main === module) {
  const [,, cmd, ...args] = process.argv;
  if (cmd === 'send') sendLine(args.join(' ')).catch(console.error);
}

module.exports = { sendLine };
