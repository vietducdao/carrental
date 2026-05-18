import Anthropic from "@anthropic-ai/sdk";

// ─── Provider config ───────────────────────────────────────────────────
// Priority: GEMINI (free, Google AI Studio) > ANTHROPIC (paid) > rule-based fallback.
// Get a free Gemini key at https://aistudio.google.com/apikey

const geminiKey = process.env.GEMINI_API_KEY;
const hasGemini = geminiKey && !/^your_/.test(geminiKey) && geminiKey.length > 20;
// Allow model override via env. Default to gemini-2.5-flash (fast, more generous free tier).
const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const anthropicKey = process.env.ANTHROPIC_API_KEY;
const hasAnthropic = anthropicKey && !/^your_/.test(anthropicKey) && anthropicKey.startsWith("sk-");

const anthropicClient = hasAnthropic ? new Anthropic({ apiKey: anthropicKey }) : null;

const fmtCar = (c) =>
  `- id=${c._id} | ${c.make} ${c.model || ""} ${c.year} | ${c.category} | ${c.seats} chỗ | ${c.transmission} | $${c.dailyRate}/ngày`;

const fmtService = (s) => `- ${s.icon || "•"} ${s.title}: ${s.description || ""}`;

// ─── Topic filter ──────────────────────────────────────────────────────
// Keeps chatbot scoped to car rental. Anything off-topic gets a polite redirect.

const ON_TOPIC_KEYWORDS = [
  // Rental & service
  "xe", "thuê", "rent", "rental", "car", "đặt", "book", "booking",
  "giá", "price", "cost", "bảng giá", "chi phí", "tiền", "phí",
  "dịch vụ", "service", "ngày", "tháng", "tuần", "cưới", "wedding",
  // Vehicle types & brands
  "suv", "sedan", "coupe", "hatchback", "sports", "luxury", "sang",
  "thể thao", "gia đình", "family", "7 chỗ", "4 chỗ", "5 chỗ",
  "toyota", "honda", "mazda", "hyundai", "kia", "ford", "mercedes",
  "bmw", "audi", "porsche", "tesla", "volkswagen", "vw",
  // Operations
  "tài xế", "driver", "đưa đón", "sân bay", "airport", "giao xe",
  "trả xe", "thanh toán", "payment", "voucher", "khuyến mãi", "giảm giá",
  "discount", "hủy", "cancel", "hoàn tiền", "refund",
  // Contact & info
  "liên hệ", "contact", "hotline", "sđt", "phone", "email",
  "địa chỉ", "address", "giờ", "hours", "công ty", "company",
  "carshops", "carrental",
  // Generic greetings (allow short ones to start a conversation)
  "xin chào", "chào", "hello", "hi", "hey", "alo",
  // Common follow-ups
  "có", "không", "yes", "no", "ok", "được", "cần", "muốn", "want",
  "cảm ơn", "thanks", "thank you",
];

const isOnTopic = (message) => {
  const m = String(message || "").toLowerCase().trim();
  if (!m) return false;
  // Short messages (≤4 words) are generally allowed (greetings, confirmations)
  if (m.split(/\s+/).length <= 4) return true;
  // Check if any keyword appears
  return ON_TOPIC_KEYWORDS.some((kw) => m.includes(kw));
};

const offTopicReply = (settings) =>
  `Tôi là trợ lý của ${settings?.companyName || "Carshops"} và chỉ tư vấn về dịch vụ thuê xe. Bạn có thể hỏi tôi về:\n• Bảng giá thuê xe\n• Gợi ý xe theo nhu cầu (gia đình, du lịch, sang trọng...)\n• Cách đặt xe & thanh toán\n• Thông tin liên hệ\n\nBạn muốn tìm hiểu vấn đề nào?`;

// ─── Rule-based fallback ───────────────────────────────────────────────
// Used when no AI provider is configured — keeps chatbot useful for demo/dev.

const ruleBasedReply = (message, ctx) => {
  const m = String(message || "").toLowerCase();
  const { cars = [], services = [], settings = null } = ctx;

  if (/(xin chào|hello|hi |hey|chào|alo)/.test(m)) {
    return `Xin chào! Tôi là trợ lý của ${settings?.companyName || "Carshops"}. Bạn cần tư vấn về xe nào, giá thuê, hay cách đặt xe?`;
  }
  const carLink = (c) => `[${c.make} ${c.model || ""} ${c.year}](/car/${c._id})`;
  if (/(giá|price|bảng giá|chi phí|cost|tiền|phí)/.test(m)) {
    if (!cars.length) return "Hiện chưa có xe nào trong hệ thống. Vui lòng liên hệ admin để biết thêm.";
    const cheapest = [...cars].sort((a, b) => a.dailyRate - b.dailyRate)[0];
    const priciest = [...cars].sort((a, b) => b.dailyRate - a.dailyRate)[0];
    return `Giá thuê tự lái dao động từ $${cheapest.dailyRate}/ngày (${carLink(cheapest)}) đến $${priciest.dailyRate}/ngày (${carLink(priciest)}). Bạn muốn tham khảo phân khúc nào?`;
  }
  if (/(suv|gia đình|7 chỗ|family)/.test(m)) {
    const suvs = cars.filter((c) => /suv/i.test(c.category) || c.seats >= 7);
    if (!suvs.length) return "Hiện chưa có xe SUV / 7 chỗ phù hợp. Bạn có thể xem các xe khác tại trang Xe của chúng tôi.";
    return `Gợi ý cho gia đình:\n${suvs.slice(0, 3).map((c) => `• ${carLink(c)} – ${c.seats} chỗ – $${c.dailyRate}/ngày`).join("\n")}`;
  }
  if (/(luxury|sang|hạng sang|porsche|bmw|mercedes|sport|thể thao)/.test(m)) {
    const lux = cars.filter((c) => /(luxury|sports)/i.test(c.category) || c.dailyRate >= 150);
    if (!lux.length) return "Hiện chưa có xe hạng sang / thể thao trong hệ thống.";
    return `Một vài lựa chọn hạng sang / thể thao:\n${lux.slice(0, 3).map((c) => `• ${carLink(c)} – $${c.dailyRate}/ngày`).join("\n")}`;
  }
  if (/(đặt xe|book|thuê xe|cách đặt|booking)/.test(m)) {
    return "Cách đặt xe rất đơn giản:\n1. Vào trang Xe → chọn xe bạn muốn\n2. Bấm 'Thuê ngay' → chọn ngày nhận & trả\n3. Vào giỏ hàng → xác nhận thông tin → thanh toán\nBạn có thể đăng nhập để lưu lịch sử đặt xe.";
  }
  if (/(dịch vụ|service)/.test(m)) {
    if (!services.length) return "Chúng tôi cung cấp dịch vụ thuê xe theo ngày, theo tháng và thuê xe cưới. Liên hệ hotline để biết chi tiết.";
    return `Dịch vụ của chúng tôi:\n${services.slice(0, 5).map((s) => `• ${s.icon || "•"} ${s.title}`).join("\n")}`;
  }
  if (/(liên hệ|contact|hotline|sđt|phone|email|địa chỉ)/.test(m)) {
    const parts = [
      settings?.phone && `☎️ ${settings.phone}`,
      settings?.email && `📧 ${settings.email}`,
      settings?.address && `📍 ${settings.address}`,
      settings?.hours && `🕐 ${settings.hours}`,
    ].filter(Boolean);
    return parts.length ? `Liên hệ với chúng tôi:\n${parts.join("\n")}` : "Vui lòng vào trang Liên hệ để xem thông tin chi tiết.";
  }
  return `Cảm ơn câu hỏi của bạn. Hiện trợ lý đang ở chế độ cơ bản (chưa kết nối AI). Bạn có thể hỏi về:\n• Bảng giá\n• Xe SUV / gia đình\n• Cách đặt xe\n• Liên hệ tư vấn\n\nHoặc liên hệ trực tiếp: ${settings?.phone || "hotline"}.`;
};

// ─── System prompt builder (shared by Gemini & Anthropic) ──────────────

const buildSystemPrompt = ({ cars, services, settings, user }) => {
  const carList = cars.slice(0, 8).map(fmtCar).join("\n") || "(chưa có xe trong hệ thống)";
  const serviceList = services.slice(0, 8).map(fmtService).join("\n") || "(chưa có dịch vụ)";
  const company = settings?.companyName || "Carshops";
  const contact = [
    settings?.phone && `SĐT: ${settings.phone}`,
    settings?.email && `Email: ${settings.email}`,
    settings?.address && `Địa chỉ: ${settings.address}`,
    settings?.hours && `Giờ làm việc: ${settings.hours}`,
  ].filter(Boolean).join("\n") || "(chưa cấu hình thông tin liên hệ)";
  const userInfo = user
    ? `Khách hàng đã đăng nhập: ${user.name}${user.email ? ` (${user.email})` : ""}.`
    : "Khách hàng đang truy cập với tư cách khách (chưa đăng nhập).";

  return `Bạn là trợ lý tư vấn của ${company} - nền tảng cho thuê xe tự lái uy tín tại Việt Nam. Trả lời bằng ngôn ngữ khách hàng dùng (mặc định tiếng Việt).

PHẠM VI NGHIÊM NGẶT — chỉ trả lời các chủ đề sau:
1. Tư vấn / gợi ý xe theo nhu cầu (gia đình, du lịch, công tác, sang trọng, thể thao...)
2. Giá thuê, dịch vụ, voucher, khuyến mãi
3. Hướng dẫn đặt xe, thanh toán, hủy/đổi đặt
4. Thông tin liên hệ của ${company}

NẾU KHÁCH HỎI NGOÀI PHẠM VI (chính trị, sức khỏe, code, toán, tin tức, đời tư...):
→ Lịch sự từ chối và gợi ý họ hỏi về dịch vụ thuê xe.

PHONG CÁCH:
- Trả lời ngắn gọn (≤150 từ cho câu thường, hoặc liệt kê tối đa 5 xe nếu khách hỏi danh sách).
- Thân thiện, dùng emoji vừa phải.
- Khi đề xuất / liệt kê xe: PHẢI dùng định dạng MARKDOWN LINK để khách click vào xem chi tiết:
  "• [{make} {model} {year}](/car/{id}) – {seats} chỗ – \${dailyRate}/ngày"
  Lấy {id} từ trường "id=..." trong danh sách XE ĐANG CÓ SẴN ở dưới. Tuyệt đối không bỏ trống danh sách.
- KHÔNG bịa thông tin. Nếu không có trong context, nói thẳng và đề nghị liên hệ qua hotline.
- KHÔNG nhắc đến đối thủ cạnh tranh.

KHÁCH HÀNG: ${userInfo}

XE ĐANG CÓ SẴN:
${carList}

DỊCH VỤ:
${serviceList}

THÔNG TIN LIÊN HỆ:
${contact}`;
};

// ─── Gemini provider (free) ────────────────────────────────────────────

async function callGemini(systemPrompt, history) {
  // Gemini doesn't have a dedicated system role — prepend it as the first user/model turn.
  const contents = [
    { role: "user", parts: [{ text: `[Vai trò & hướng dẫn]\n${systemPrompt}` }] },
    { role: "model", parts: [{ text: "Đã hiểu. Tôi sẽ tư vấn theo đúng hướng dẫn." }] },
    ...history.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
  ];

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(geminiModel)}:generateContent?key=${encodeURIComponent(geminiKey)}`;
  const body = {
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  };
  // Gemini 2.5+ ngầm bật "thinking" — tiêu tốn output tokens cho reasoning.
  // Tắt thinking để response không bị cắt giữa chừng.
  if (/^gemini-2\.5/.test(geminiModel)) {
    body.generationConfig.thinkingConfig = { thinkingBudget: 0 };
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    const err = new Error(`Gemini API ${res.status}: ${errText.slice(0, 200)}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  const candidate = data?.candidates?.[0];
  const text = candidate?.content?.parts?.[0]?.text;
  const finishReason = candidate?.finishReason;
  if (!text || !text.trim()) {
    if (finishReason === "MAX_TOKENS") {
      throw new Error("Gemini bị cắt do MAX_TOKENS (thinking quá nhiều). Hãy thử model không có thinking như gemini-2.0-flash hoặc gemini-1.5-flash.");
    }
    throw new Error(`Gemini trả về phản hồi rỗng (finishReason=${finishReason || "unknown"})`);
  }
  return text.trim();
}

// ─── Anthropic provider (paid fallback) ────────────────────────────────

async function callAnthropic(systemPrompt, history) {
  const response = await anthropicClient.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 500,
    system: systemPrompt,
    messages: history,
  });
  return response.content[0].text;
}

// ─── Public API ────────────────────────────────────────────────────────

export async function getChatResponse(history, ctx = {}) {
  const { cars = [], services = [], settings = null, user = null } = ctx;

  // Topic filter — reject off-topic before spending tokens
  const lastUserMsg = [...history].reverse().find((m) => m.role === "user")?.content || "";
  if (!isOnTopic(lastUserMsg)) {
    return offTopicReply(settings);
  }

  // No AI configured → rule-based fallback
  if (!hasGemini && !hasAnthropic) {
    return ruleBasedReply(lastUserMsg, { cars, services, settings });
  }

  const systemPrompt = buildSystemPrompt({ cars, services, settings, user });

  // Try Gemini first (free), fall back to Anthropic, then rule-based.
  if (hasGemini) {
    try {
      return await callGemini(systemPrompt, history);
    } catch (err) {
      const isQuota = err.status === 429 || /quota|rate limit/i.test(err.message);
      if (isQuota) {
        console.warn(`[chat] Gemini quota exhausted (model=${geminiModel}). Try GEMINI_MODEL=gemini-2.0-flash-lite or gemini-1.5-flash in .env. Falling back...`);
      } else {
        console.warn("[chat] Gemini failed, falling back:", err.message);
      }
      if (!hasAnthropic) {
        return ruleBasedReply(lastUserMsg, { cars, services, settings });
      }
    }
  }
  return await callAnthropic(systemPrompt, history);
}

export const activeProvider = hasGemini ? "gemini" : hasAnthropic ? "anthropic" : "rule-based";
