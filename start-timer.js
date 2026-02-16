const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405 };
  }

  const { duration } = JSON.parse(event.body || "{}");

  if (!duration || duration < 10) {
    return { statusCode: 400, body: "Invalid duration" };
  }

  const endTime = Date.now() + duration * 1000;
  const userId = "default"; // או UUID אם רוצים

  await redis.set(`timer:${userId}:end`, endTime.toString(), { ex: duration + 300 });

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
};
