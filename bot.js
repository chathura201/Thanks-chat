require("dotenv").config();
const { Telegraf } = require("telegraf");
const fetch = require("node-fetch");
const tf = require("@tensorflow/tfjs-node");
const nsfw = require("nsfwjs");
const { createCanvas, loadImage } = require("canvas");

const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Telegraf(BOT_TOKEN);

let model;

(async () => {
  model = await nsfw.load();
  console.log("✅ NSFW model loaded");
})();

async function isNSFWImage(imageUrl) {
  try {
    const res = await fetch(imageUrl);
    const buffer = await res.buffer();
    const img = await loadImage(buffer);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const predictions = await model.classify(canvas);
    console.log(predictions);

    const nsfwTag = predictions.find(
      (p) => ["Porn", "Hentai", "Sexy"].includes(p.className) && p.probability > 0.7
    );
    return !!nsfwTag;
  } catch (err) {
    console.error("Error:", err);
    return false;
  }
}

bot.on("text", async (ctx) => {
  const userLink = ctx.message.text.trim();
  if (!userLink.startsWith("http")) {
    return ctx.reply("📛 Please send a valid image URL.");
  }
  ctx.reply("🔍 Checking...");
  const isNSFW = await isNSFWImage(userLink);
  if (isNSFW) {
    ctx.reply("🔞 NSFW content detected. Blocked.");
  } else {
    ctx.reply("✅ Content is safe.\n" + userLink);
  }
});

bot.launch();
