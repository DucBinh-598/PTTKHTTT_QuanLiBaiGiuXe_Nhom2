import { askParkingAI } from "../services/aiService.js";

export async function chatAI(req, res) {
  try {
    const { question } = req.body;
    if (typeof question !== "string" || !question.trim() || question.length > 2000) {
      return res.status(400).json({ message: "Câu hỏi phải có nội dung và tối đa 2.000 ký tự." });
    }
    const answer = await askParkingAI(question.trim());
    res.json({ success: true, question: question.trim(), answer });
  } catch (error) {
    console.error("AI error:", error);
    const message = error.message?.includes("OPENAI_API_KEY")
      ? error.message
      : "Không thể xử lý câu hỏi AI. Hãy kiểm tra API key, model và kết nối mạng.";
    res.status(503).json({ message });
  }
}
