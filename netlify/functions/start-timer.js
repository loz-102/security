const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405 };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const { duration } = body;

  if (!duration || duration < 10) {
    return { statusCode: 400, body: "Invalid duration" };
  }

  const endTime = Date.now() + duration * 1000;

  try {
    await redis.set("timer:default:end", endTime.toString(), { ex: duration + 300 });
  } catch (err) {
    console.error("Redis error:", err);
    return { statusCode: 500, body: "Failed to save timer" };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
};
