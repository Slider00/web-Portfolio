import { useRef, useState } from "react";
import { askPortfolioAI } from "../lib/portfolioAi";

const WELCOME =
  "Hi, I'm Julian's AI assistant. Ask me about projects, experience, stack, or availability.";

const CONTACT_LINKS = {
  whatsapp: import.meta.env.VITE_WHATSAPP_URL || "",
  linkedin: import.meta.env.VITE_LINKEDIN_URL || "",
  github: import.meta.env.VITE_GITHUB_URL || "https://github.com/Slider00",
};

const isContactIntent = (text) => {
  const value = (text || "").toLowerCase();
  const patterns = [
    "contact",
    "contacto",
    "contáct",
    "whatsapp",
    "linkedin",
    "github",
    "correo",
    "email",
    "mail",
    "reach you",
    "reach out",
    "how can i contact",
  ];
  return patterns.some((pattern) => value.includes(pattern));
};

const detectContactChannelIntent = (text) => {
  const value = (text || "").toLowerCase();
  const wantsWhatsApp = value.includes("whatsapp") || value.includes("whats");
  const wantsGitHub = value.includes("github");
  const wantsLinkedIn = value.includes("linkedin") || value.includes("linked in");
  const wantsGenericContact =
    value.includes("contact") ||
    value.includes("contacto") ||
    value.includes("contáct") ||
    value.includes("reach out") ||
    value.includes("reach you") ||
    value.includes("how can i contact");

  return { wantsWhatsApp, wantsGitHub, wantsLinkedIn, wantsGenericContact };
};

const PortfolioAIChat = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: WELCOME },
  ]);
  const scrollRef = useRef(null);

  const handleSend = async (presetMessage) => {
    const message = (presetMessage ?? input).trim();
    if (!message || loading) return;

    const nextMessages = [...messages, { role: "user", content: message }];
    const nextHistory = nextMessages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role, content: m.content }));
    setMessages(nextMessages);
    if (!presetMessage) setInput("");
    setError("");
    setLoading(true);

    try {
      const data = await askPortfolioAI(message, nextHistory);
      const reply =
        data?.reply ||
        "I could not generate a response right now. Please try again.";
      const contactIntent = isContactIntent(message);
      const channelIntent = detectContactChannelIntent(message);
      const contact =
        contactIntent &&
        channelIntent.wantsWhatsApp &&
        data?.contact?.type === "whatsapp"
          ? data.contact
          : null;
      const suggestions = Array.isArray(data?.suggestions)
        ? data.suggestions.filter((item) => typeof item === "string")
        : [];
      const actions = Array.isArray(data?.actions)
        ? data.actions.filter(
            (action) =>
              action?.type === "link" &&
              typeof action?.label === "string" &&
              typeof action?.url === "string"
          )
        : [];
      const filteredActions = contactIntent
        ? actions.filter((action) => {
            const label = action.label.toLowerCase();
            const url = action.url.toLowerCase();
            const isWhatsAppAction =
              label.includes("whatsapp") ||
              url.includes("wa.me") ||
              url.includes("whatsapp");
            const isGitHubAction =
              label.includes("github") || url.includes("github.com");
            const isLinkedInAction =
              label.includes("linkedin") || url.includes("linkedin.com");

            if (isWhatsAppAction) return channelIntent.wantsWhatsApp;
            if (isGitHubAction) return channelIntent.wantsGitHub;
            if (isLinkedInAction) return channelIntent.wantsLinkedIn;
            return true;
          })
        : actions.filter((action) => {
            const label = action.label.toLowerCase();
            const url = action.url.toLowerCase();
            const isContactAction =
              label.includes("whatsapp") ||
              label.includes("github") ||
              label.includes("linkedin") ||
              url.includes("wa.me") ||
              url.includes("whatsapp") ||
              url.includes("github.com") ||
              url.includes("linkedin.com");
            return !isContactAction;
          });

      const hasWhatsAppAction = filteredActions.some((action) =>
        action.label.toLowerCase().includes("whatsapp")
      );
      const hasLinkedInAction = filteredActions.some(
        (action) =>
          action.label.toLowerCase().includes("linkedin") ||
          action.url.toLowerCase().includes("linkedin.com")
      );
      const hasGitHubAction = filteredActions.some(
        (action) =>
          action.label.toLowerCase().includes("github") ||
          action.url.toLowerCase().includes("github.com")
      );

      const fallbackContactActions = [];
      if (
        contactIntent &&
        (channelIntent.wantsWhatsApp || channelIntent.wantsGenericContact) &&
        !hasWhatsAppAction &&
        CONTACT_LINKS.whatsapp
      ) {
        fallbackContactActions.push({
          type: "link",
          label: "WhatsApp",
          url: CONTACT_LINKS.whatsapp,
        });
      }
      if (
        contactIntent &&
        channelIntent.wantsLinkedIn &&
        !hasLinkedInAction &&
        CONTACT_LINKS.linkedin
      ) {
        fallbackContactActions.push({
          type: "link",
          label: "LinkedIn",
          url: CONTACT_LINKS.linkedin,
        });
      }
      if (
        contactIntent &&
        channelIntent.wantsGitHub &&
        !hasGitHubAction &&
        CONTACT_LINKS.github
      ) {
        fallbackContactActions.push({
          type: "link",
          label: "GitHub",
          url: CONTACT_LINKS.github,
        });
      }

      const finalActions = [...filteredActions, ...fallbackContactActions];
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
          contact,
          suggestions,
          actions: finalActions,
        },
      ]);
    } catch (err) {
      setError("Connection issue with AI backend. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I cannot reach the AI service right now. Please retry in a moment.",
        },
      ]);
      console.error(err);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed z-50 flex items-end justify-end w-[5.4rem] h-[5.4rem] transition rounded-full shadow-[0_8px_30px_rgba(90,65,180,0.45)] bottom-6 right-5 hover:scale-[1.04]"
        aria-label="Open AI assistant"
      >
        <img
          src={`${import.meta.env.BASE_URL}assets/ai-robot-bubble.svg`}
          alt="AI robot"
          className="object-cover w-full h-full rounded-full"
          loading="eager"
          decoding="async"
        />
        <span className="absolute px-2 py-0.5 text-[10px] font-bold tracking-wide text-white rounded-full border right-1.5 bottom-1.5 bg-black/65 border-white/30">
          IA
        </span>
      </button>

      {open && (
        <aside className="fixed z-50 w-[min(92vw,24rem)] h-[70vh] max-h-[44rem] bottom-24 right-5 rounded-2xl border border-white/10 bg-primary/95 backdrop-blur-md shadow-2xl">
          <header className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <h3 className="text-sm font-semibold">Portfolio AI Assistant</h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-neutral-300 hover:text-white"
              aria-label="Close AI assistant"
            >
              ✕
            </button>
          </header>

          <div
            ref={scrollRef}
            className="h-[calc(100%-8.5rem)] overflow-y-auto px-3 py-3 space-y-3"
          >
            {messages.map((message, index) => (
              <article
                key={`${message.role}-${index}`}
                className={`max-w-[88%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "ml-auto bg-lavender/30 text-white"
                    : "mr-auto bg-white/8 text-neutral-100"
                }`}
              >
                <p>{message.content}</p>
                {message.contact?.type === "whatsapp" && (
                  <a
                    href={message.contact.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex mt-2 rounded-lg bg-[#25D366] px-2.5 py-1.5 text-xs font-semibold text-black"
                  >
                    Escribirme por WhatsApp
                  </a>
                )}
                {Array.isArray(message.actions) && message.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.actions.map((action, actionIndex) => (
                      <a
                        key={`${action.label}-${actionIndex}`}
                        href={action.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-lg border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
                      >
                        {action.label}
                      </a>
                    ))}
                  </div>
                )}
                {Array.isArray(message.suggestions) &&
                  message.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {message.suggestions.map((suggestion, suggestionIndex) => (
                        <button
                          key={`${suggestion}-${suggestionIndex}`}
                          type="button"
                          className="inline-flex rounded-full border border-lavender/60 bg-lavender/20 px-2.5 py-1 text-xs font-medium text-white hover:bg-lavender/35"
                          onClick={() => handleSend(suggestion)}
                          disabled={loading}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
              </article>
            ))}
            {loading && (
              <article className="mr-auto rounded-xl px-3 py-2 text-sm bg-white/8 text-neutral-200">
                Thinking...
              </article>
            )}
          </div>

          <footer className="px-3 py-2 border-t border-white/10">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                rows={2}
                placeholder="Ask about Julian's projects, stack, or experience..."
                className="w-full px-3 py-2 text-base text-white rounded-lg resize-none bg-white/10 md:text-sm field-input-focus placeholder:text-neutral-400"
              />
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSend()}
                className="px-3 py-2 text-sm font-semibold text-white rounded-lg bg-lavender disabled:opacity-60"
              >
                Send
              </button>
            </div>
            {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
          </footer>
        </aside>
      )}
    </>
  );
};

export default PortfolioAIChat;
