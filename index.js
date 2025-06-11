require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, '👋 Welcome to the NSFW Bot. Use /nsfw <tag> to get content.');
});

bot.onText(/\/nsfw (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];

  try {
    const response = await axios.get(\`https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&tags=\${query}\`);
    const results = response.data;

    if (!results || results.length === 0) {
      return bot.sendMessage(chatId, '😢 No results found.');
    }

    const random = results[Math.floor(Math.random() * results.length)];
    const imageUrl = random.file_url;

    await bot.sendPhoto(chatId, imageUrl, {
      caption: \`🔞 Result for: \${query}\`
    });
  } catch (error) {
    bot.sendMessage(chatId, '⚠️ Error fetching data.');
  }
});