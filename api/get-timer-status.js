const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  try {
    const endStr = await redis.get("timer:default:end");
    if (!endStr) {
      return res.status(200).json({ active: false });
    }

    const endTime = parseInt(endStr, 10);
    return res.status(200).json({ active: true, endTime });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
