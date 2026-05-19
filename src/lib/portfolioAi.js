const ENV_API_URL = import.meta.env.VITE_AI_API_URL;
const isDev = import.meta.env.DEV;
const API_URL = ENV_API_URL || (isDev ? "http://localhost:4000" : "");

export async function askPortfolioAI(message, history = []) {
  if (!API_URL) {
    throw new Error(
      "Missing VITE_AI_API_URL. Define it in your frontend .env for production."
    );
  }

  const response = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`AI request failed (${response.status}) ${detail}`);
  }

  return response.json();
}
