import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function getChatResponse(history, carContext) {
  const systemPrompt = `Bạn là trợ lý tư vấn thuê xe của CarRental. Hãy trả lời bằng ngôn ngữ mà khách hàng dùng.
Danh sách xe hiện có: ${JSON.stringify(carContext?.slice(0, 5) || [])}
Nhiệm vụ: tư vấn xe phù hợp, giải đáp câu hỏi về dịch vụ, hướng dẫn đặt xe và thanh toán.
Trả lời ngắn gọn (tối đa 150 từ), thân thiện và chuyên nghiệp.`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 400,
    system: systemPrompt,
    messages: history,
  });
  return response.content[0].text;
}
