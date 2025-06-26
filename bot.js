const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
const { getPosts, getRandomPost } = require('./rule34');
require('dotenv').config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "👋 හෙලෝ! NSFW Sinhala Bot එකට සාදරයෙන් පිළිගනිමු.\n\n/tag යොදා Search කරන්න.\n/random කියලා Random NSFW දෙයක් බලන්න.");
});

bot.onText(/\/search (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];

  bot.sendMessage(chatId, `🔎 "${query}" ට සෙවීමක් කරමින්...`);

  try {
    const posts = await getPosts(query);
    if (!posts.length) return bot.sendMessage(chatId, "😔 කිසිවක් හමු නොවීය.");

    const post = posts[0];
    const text = `🔞 NSFW ප්‍රතිඵලය: ${query}\n🖼️ Score: ${post.score}\n📎 ${post.file_url}`;
    bot.sendPhoto(chatId, post.sample_url, {
      caption: text,
      reply_markup: {
        inline_keyboard: [[{ text: "📥 බාගන්න", url: post.file_url }]]
      }
    });
  } catch (err) {
    bot.sendMessage(chatId, "❌ දෝෂයක් සිදුවුණා.");
  }
});

bot.onText(/\/random/, async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "🎲 Random NSFW item එකක් ලබා ගන්නා中...");

  try {
    const post = await getRandomPost();
    const text = `🔞 Random NSFW\n🖼️ Score: ${post.score}\n📎 ${post.file_url}`;
    bot.sendPhoto(chatId, post.sample_url, {
      caption: text,
      reply_markup: {
        inline_keyboard: [[{ text: "📥 බාගන්න", url: post.file_url }]]
      }
    });
  } catch (err) {
    bot.sendMessage(chatId, "❌ දෝෂයක් සිදුවුණා.");
  }
});
