const ENV_API_URL = import.meta.env.VITE_AI_API_URL;
const isDev = import.meta.env.DEV;
const API_URL = ENV_API_URL || (isDev ? "http://localhost:4000" : "");
const REQUEST_TIMEOUT_MS = 30000;

function normalizeChatResponse(payload) {
  const body = payload?.data && typeof payload.data === "object" ? payload.data : payload;

  const replyCandidates = [
    body?.reply,
    body?.message,
    body?.text,
    body?.answer,
    body?.response,
  ];
  const reply = replyCandidates.find((item) => typeof item === "string" && item.trim()) || "";

  const suggestions = Array.isArray(body?.suggestions)
    ? body.suggestions.filter((item) => typeof item === "string")
    : [];

  const actions = Array.isArray(body?.actions)
    ? body.actions.filter(
        (item) =>
          item?.type === "link" &&
          typeof item?.label === "string" &&
          typeof item?.url === "string"
      )
    : [];

  const contact =
    body?.contact?.type && body?.contact?.url
      ? { type: body.contact.type, url: body.contact.url }
      : null;

  return { reply, suggestions, actions, contact };
}

export async function askPortfolioAI(message, history = []) {
  if (!API_URL) {
    throw new Error(
      "Missing VITE_AI_API_URL. Define it in your frontend .env for production."
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  const response = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
    signal: controller.signal,
  }).finally(() => clearTimeout(timeout));

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`AI request failed (${response.status}) ${detail}`);
  }

  const raw = await response.json();
  return normalizeChatResponse(raw);
}
