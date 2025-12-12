import axios from "axios";

export const getAIResponse = async (userMessage, conversationHistory = []) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const apiUrl = process.env.OPENROUTER_API_URL || "https://openrouter.ai/api/v1/chat/completions";
  const model = process.env.OPENROUTER_MODEL;

  if (!apiKey || !model) {
    throw new Error("OPENROUTER_API_KEY and OPENROUTER_MODEL must be set in .env");
  }

  // Keep only the last 10 messages
  let recent = conversationHistory.slice(-10);

  // Remove accidental duplicate user messages
  recent = recent.filter((msg, idx) => {
    if (msg.role !== "user") return true;
    const prev = recent[idx - 1];
    return !(prev && prev.role === "user" && prev.content === msg.content);
  });

  const messages = [
    {
      role: "system",
      content:
        "You are a helpful, concise customer support assistant. Keep answers short, clear, and friendly."
    },
    ...recent.map(m => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage }
  ];

  try {
    const response = await axios.post(
      apiUrl,
      {
        model,
        messages,
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
          "X-Title": "ViralLens Support"
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("AI ERROR:", error.response?.data || error.message);

    throw new Error(
      error.response?.data?.error?.message ||
        "Failed to get AI response from OpenRouter."
    );
  }
};
