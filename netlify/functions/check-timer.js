const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const TELEGRAM_TOKEN = "8579388433:AAGZqjArwpMMPZUPfN3_YZYgoAQi768Wz3Q";
const TELEGRAM_CHAT  = -5223902644;

exports.handler = async () => {
  const endStr = await redis.get("timer:default:end");
  if (!endStr) return { statusCode: 200 };

  const endTime = parseInt(endStr);
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

  return { statusCode: 200 };
};
