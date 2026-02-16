const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const TELEGRAM_TOKEN = "8579388433:AAGZqjArwpMMPZUPfN3_YZYgoAQi768Wz3Q";
const TELEGRAM_CHAT  = -5223902644;

export default async function handler(req, res) {
  try {
    const endStr = await redis.get("timer:default:end");
    if (!endStr) return res.status(200).json({});

    const endTime = parseInt(endStr, 10);
    if (Date.now() > endTime) {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT,
          text: "Alert – הטיימר הסתיים! המשתמש לא ביטל."
        })
      });
      await redis.del("timer:default:end");
    }

    return res.status(200).json({});
  } catch (err) {
    console.error(err);
    return res.status(500).json({});
  }
}
