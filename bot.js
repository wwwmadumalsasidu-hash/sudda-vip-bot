const TelegramBot = require('node-telegram-bot-api');

const TOKEN = "8397769193:AAEEAQNdFEg87pdWafH8oHJd4iBmXzlg-hE"; // BotFather token
const bot = new TelegramBot(TOKEN, { polling: true });

// 👑 YOUR Telegram Numeric ID
const ADMIN_ID = 5896916220;

// VIP users { userId: expiryTime }
let vipUsers = {};

// ───── /START MESSAGE ─────
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id,
`👋 Welcome to SUDDA SIGNAL SERVICE 👑

⚠️ අනිවාරෙන් 5x වැඩියෙන් Crash උන
Round Number එකයි Time එකයි ටයිප් කරන්න ⚠️

✍️ Type format 👇
4537530 = 10:25:23

🚫 වෙන format දාන්න එපා

🔥 Play Smart – Win Safe 🔥`);
});

// ───── ADD VIP ─────
bot.onText(/\/addvip (\d+) (\d+)/, (msg, match) => {
  if (msg.from.id !== ADMIN_ID) return;

  const userId = match[1];
  const days = parseInt(match[2]);
  vipUsers[userId] = Date.now() + days * 86400000;

  bot.sendMessage(msg.chat.id,
`✅ VIP Added Successfully

👤 User ID : ${userId}
⏱️ Days : ${days}`);
});

// ───── REMOVE VIP ─────
bot.onText(/\/removevip (\d+)/, (msg, match) => {
  if (msg.from.id !== ADMIN_ID) return;
  delete vipUsers[match[1]];
  bot.sendMessage(msg.chat.id, "❌ VIP Removed");
});

// ───── MY VIP STATUS ─────
bot.onText(/\/myvip/, (msg) => {
  const expiry = vipUsers[msg.from.id];
  if (!expiry || Date.now() > expiry) {
    bot.sendMessage(msg.chat.id, "❌ VIP Expired");
    return;
  }
  const daysLeft = Math.ceil((expiry - Date.now()) / 86400000);
  bot.sendMessage(msg.chat.id,
`✅ VIP Active
⏱️ Days Left : ${daysLeft}`);
});

// ───── SIGNAL LOGIC ─────
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text;

  if (!text || !text.includes('=')) return;

  // VIP CHECK
  if (!vipUsers[userId] || Date.now() > vipUsers[userId]) {
    bot.sendMessage(chatId, "❌ VIP Expired\nContact Admin");
    return;
  }

  try {
    const clean = text.replace(/\s+/g,'');
    const [roundStr, timeStr] = clean.split('=');
    const seconds = timeStr.split(':')[2];
    const lastDigit = parseInt(seconds.slice(-1));
    const newRound = parseInt(roundStr) + lastDigit;

    bot.sendMessage(chatId,
`🚨✈️ AVIATOR SIGNAL ✈️🚨

🕹️ Round ID : ${newRound}

⚠️ අනිවාරෙන් Round 3 Bet කරන්න ⚠️

💰 Auto Cash Out
🥇 1st Bet : 5x
🥈 2nd Bet : 10x

👑 SUDDA VIP SIGNAL SERVICE 👑`);
  } catch {
    bot.sendMessage(chatId, "❌ Format Error\nUse: 4537530 = 10:25:23");
  }
});
