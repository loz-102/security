exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { duration } = JSON.parse(event.body || "{}");

  if (!duration || duration < 10) {
    return { statusCode: 400, body: "Invalid duration" };
  }

  const endTime = Date.now() + duration * 1000;

  // כאן תוסיף בהמשך שמירה ב-DB (Upstash / Fauna)
  console.log("טיימר יסתיים:", new Date(endTime));

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, endTime })
  };
};
