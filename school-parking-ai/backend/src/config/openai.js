import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Thiếu OPENAI_API_KEY trong file backend/.env");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
