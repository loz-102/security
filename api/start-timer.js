const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  let body;
  try {
    body = JSON.parse(req.body || "{}");
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const { duration } = body;

  if (!duration || duration < 10) {
    return res.status(400).json({ error: "Invalid duration" });
  }

  const endTime = Date.now() + duration * 1000;

  try {
    await redis.set("timer:default:end", endTime.toString(), { ex: duration + 300 });
  } catch (err) {
    console.error("Redis error:", err);
    return res.status(500).json({ error: "Failed to save timer" });
  }

  return res.status(200).json({ success: true });
}
