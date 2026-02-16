const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

exports.handler = async () => {
  const endStr = await redis.get("timer:default:end");
  if (!endStr) {
    return { statusCode: 200, body: JSON.stringify({ active: false }) };
  }

  const endTime = parseInt(endStr);
  return {
    statusCode: 200,
    body: JSON.stringify({ active: true, endTime })
  };
};
