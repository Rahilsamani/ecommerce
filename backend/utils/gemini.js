const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const correctSpelling = async (items) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Correct the spelling of these grocery items and return them as a comma-separated list: ${items.join(
    ", "
  )}`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  return response.split(",").map((item) => item.trim());
};

module.exports = correctSpelling;
