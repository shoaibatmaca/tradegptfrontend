import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import PromptCard from "./PromptCard";

const BACKEND_URL = "https://backendoftradegpt-production.up.railway.app";
const ChatArea = ({ toggleWatchlist, watchlistMessage }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const [chatSessions, setChatSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const token = new URLSearchParams(window.location.search).get("token");

  const FINNHUB_API_KEY = "d08gifhr01qh1ecc2v7gd08gifhr01qh1ecc2v80";
  function cleanAndFormat(text) {
    return text
      .replace(/^markdown[#>]*\s*/i, "") // Remove markdown# prefix
      .replace(/(?<!\n)(#+\s*)([A-Za-z])/g, "\n\n$1$2") // Ensure newlines before headers
      .replace(/#{3,6}\s*#?\s*/g, "\n\n### ") // Normalize headers to ### and space
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
      .replace(/\*(.*?)\*/g, "$1") // Remove italic
      .replace(/`{1,3}(.*?)`{1,3}/g, "$1") // Remove inline code
      .replace(/\|.*?\|/g, "") // Remove table rows
      .replace(/-{3,}/g, "\n\n---\n\n") // Section separators
      .replace(/([A-Za-z])(:)(?=\S)/g, "$1: ") // Ensure spacing after colons
      .replace(/###\s*#\s*/g, "### ") // Clean up things like ### #Title
      .replace(/KeyFinancialMetrics\s*\(TTM\)/gi, "### Key Financial Metrics")
      .replace(/TradeSetupbyvalourGPT/gi, "Trade Setup by ValourGPT")
      .replace(/Buy&SellReasons/gi, "Buy & Sell Reasons")
      .replace(/UniqueValueProposition/gi, "Unique Value Proposition")
      .replace(/AnalystInsights/gi, "Analyst Insights")
      .replace(/UpcomingEvents/gi, "Upcoming Events")
      .replace(/TechnicalIndicators/gi, "Technical Indicators")
      .replace(/Competitors/gi, "Competitors")
      .replace(/Note\s*:/gi, "\n\n**Note:** ")
      .replace(/ValuationNote\s*:/gi, "\n\n**Valuation Note:** ")
      .replace(/VisualAid\s*:/gi, "\n\n**Visual Aid:** ")
      .replace(/\n{2,}/g, "\n\n") // Clean excessive newlines
      .replace(/\s{2,}/g, " ") // Clean excessive spaces
      .trim();
  }

  const promptCards = [
    {
      id: 1,
      title: "Top 3 Call option contracts related to EV",
      subtitle: "with the highest likelihood of profit",
      icon: "ev",
    },
    {
      id: 2,
      title: "Top 3 Call option contracts",
      subtitle: "in the AI hardware sector",
      icon: "ai",
    },
    {
      id: 3,
      title: "Get me the top 3 option contracts for NVDA",
      subtitle: "that can yield quick profits today",
      icon: "nvda",
    },
    {
      id: 4,
      title: "Provide shorting entry and exit for QQQ",
      subtitle: "based on today's technical analysis",
      icon: "qqq",
    },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (token) {
      axios
        .get(`${BACKEND_URL}/api/chat/user-sessions/?token=${token}`)
        .then((res) => {
          setChatSessions(res.data);
        })
        .catch((err) => {
          console.error("Failed to load chat sessions:", err);
        });
    }
  }, [token]);

  const loadSession = async (session_id) => {
    try {
      setSessionId(session_id);
      setActiveSessionId(session_id);
      const res = await axios.get(
        `${BACKEND_URL}/api/chat/sessions/${session_id}/messages/?token=${token}`
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load session messages:", err);
      setApiError("Failed to load chat session.");
    }
  };

  const handleSendWatchlistMessage = async (msg) => {
    setIsLoading(true);

    const baseId = Date.now();
    const steps = [
      "Retrieved detailed company information.",
      "Retrieved fundamental ratios for the stock.",
      "Retrieved company earnings reports information.",
      "Consolidating and analyzing information...",
    ];

    // Step 1: Show initial steps
    setMessages((prev) => [
      ...prev,
      {
        id: baseId,
        sender: "ai",
        stage: "progress",
        steps: steps.map((text) => ({ text, done: false })),
        timestamp: new Date(),
      },
    ]);

    const updateStep = (stepIndex) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === baseId
            ? {
                ...msg,
                steps: msg.steps.map((s, i) =>
                  i === stepIndex ? { ...s, done: true } : s
                ),
              }
            : msg
        )
      );
    };

    // Animate steps 0–2
    for (let i = 0; i < 3; i++) {
      await new Promise((r) => setTimeout(r, 1200));
      updateStep(i);
    }

    // Step 3: Show final step and prepare to stream
    updateStep(3);

    const streamId = `${baseId}-stream`;

    // Add initial streaming block
    setMessages((prev) => [
      ...prev,
      {
        id: streamId,
        sender: "ai",
        stage: "streaming",
        partialText: "",
        timestamp: new Date(),
        queryType: msg.queryType || "default", // Pass queryType
      },
    ]);

    try {
      const res = await fetch(`${BACKEND_URL}/api/deepseek-chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      // function cleanAndFormat(text) {
      //   return text
      //     .replace(/\*\*(.*?)\*\*/g, "$1") // remove bold
      //     .replace(/\*(.*?)\*/g, "$1") // remove italic
      //     .replace(/`{1,3}(.*?)`{1,3}/g, "$1") // remove code formatting
      //     .replace(/^#+\s*/gm, "") // remove markdown headers
      //     .replace(/(?<=[a-z])(?=[A-Z])/g, " ") // space in camelCase
      //     .replace(/([a-zA-Z]):([A-Za-z])/g, "$1: $2") // space after colons
      //     .replace(/###\s*/g, "") // remove leading ###
      //     .replace(/--+/g, "\n\n---\n\n") // format separators
      //     .replace(/(Trade Idea.*?)–/gi, "\n\n### $1 –") // section title
      //     .replace(/Current Price\s*:\s*/gi, "\n\n**Current Price:** ")
      //     .replace(/Trend\s*:\s*/gi, "\n\n**Trend:** ")
      //     .replace(/Key Levels\s*:\s*/gi, "\n\n**Key Levels:** ")
      //     .replace(/Trade Setup\s*:\s*/gi, "\n\n### Trade Setup:\n")
      //     .replace(
      //       /Technical Rationale\s*:\s*/gi,
      //       "\n\n### Technical Rationale:\n"
      //     )
      //     .replace(/Execution Plan\s*:\s*/gi, "\n\n### Execution Plan:\n")
      //     .replace(
      //       /Risk[-\s]Reward\s*Ratio\s*:\s*/gi,
      //       "\n\n**Risk-Reward Ratio:** "
      //     )
      //     .replace(/Target\s*:\s*/gi, "\n\n**Target:** ")
      //     .replace(/Stop[-\s]?Loss\s*:\s*/gi, "\n\n**Stop-Loss:** ")
      //     .replace(/Entry\s*:\s*/gi, "\n\n**Entry:** ")
      //     .replace(/Note\s*:\s*/gi, "\n\n**Note:** ")
      //     .replace(/\n{2,}/g, "\n\n") // normalize spacing
      //     .replace(/\s{2,}/g, " ") // reduce excessive spaces
      //     .trim();
      // }

      let fullText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const lines = buffer.split("\n");

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();

          if (line.startsWith("data:")) {
            const text = line.replace("data:", "").trim();
            const cleaned =
              msg.queryType === "default" ? cleanAndFormat(text) : text;

            fullText += cleaned;

            setMessages((prev) =>
              prev.map((m) =>
                m.id === streamId ? { ...m, partialText: fullText } : m
              )
            );

            await new Promise((r) => setTimeout(r, 20)); // Optional delay
          }
        }

        buffer = ""; // clear the buffer after processing
      }

      // Flush any remaining buffer
      if (buffer.length > 0) {
        fullText += buffer;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamId ? { ...m, partialText: fullText } : m
          )
        );
      }

      // Final stage
      setMessages((prev) =>
        prev.map((m) =>
          m.id === streamId ? { ...m, stage: "final", text: fullText } : m
        )
      );
    } catch (err) {
      console.error("Stream Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `${baseId}-error`,
          sender: "ai",
          text: "Streaming failed.",
          isError: true,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      (typeof watchlistMessage === "string" && watchlistMessage.trim()) ||
      (typeof watchlistMessage === "object" && watchlistMessage !== null)
    ) {
      handleSendWatchlistMessage(watchlistMessage);
    }
  }, [watchlistMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e) => setInputMessage(e.target.value);

  const callOpenRouterAPI = async (messageText) => {
    setApiError(null);

    const streamId = `${Date.now()}-directstream`;

    setMessages((prev) => [
      ...prev,
      {
        id: streamId,
        sender: "ai",
        stage: "streaming",
        partialText: "",
        timestamp: new Date(),
        queryType: "direct",
      },
    ]);

    try {
      const res = await fetch(`${BACKEND_URL}/api/deepseek-chat/direct/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let fullText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const lines = buffer.split("\n");

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();

          if (line.startsWith("data:")) {
            const text = line.replace("data:", "").trim();
            const cleaned = cleanAndFormat(text);
            fullText += cleaned;

            setMessages((prev) =>
              prev.map((m) =>
                m.id === streamId ? { ...m, partialText: fullText } : m
              )
            );
          }
        }

        buffer = ""; // clear buffer
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === streamId ? { ...m, stage: "final", text: fullText } : m
        )
      );
    } catch (err) {
      console.error("Direct chat stream error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `${streamId}-error`,
          sender: "ai",
          text: "Streaming failed.",
          isError: true,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const callFinhubAndAnalyzeWithOpenRouter = async (messageText) => {
    const match = messageText.toLowerCase().match(/stock for ([A-Z]{1,5})/i);
    const symbol = match?.[1]?.toUpperCase();
    if (!symbol) return "Invalid stock symbol.";

    try {
      // Fetch from Alpha Vantage
      const quoteRes = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=04RGF1U9PAJ49VYI`
      );

      const timeSeries = quoteRes.data["Time Series (Daily)"];
      if (!timeSeries) throw new Error("Alpha Vantage data invalid");

      const [latestDate, previousDate] = Object.keys(timeSeries);
      const today = timeSeries[latestDate];
      const previous = timeSeries[previousDate];

      const closeToday = parseFloat(today["4. close"]);
      const closePrev = parseFloat(previous["4. close"]);

      const summary = `${symbol} is trading at $${closeToday.toFixed(
        2
      )}, change: ${(closeToday - closePrev).toFixed(2)} (${(
        ((closeToday - closePrev) / closePrev) *
        100
      ).toFixed(2)}%).`;

      // Call DeepSeek V3
      const aiRes = await axios.post(`${BACKEND_URL}/api/deepseek-chat/`, {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are DeepSeek V3, a financial trading assistant.",
          },
          {
            role: "user",
            content: `Stock info for ${symbol}: ${summary}. Analyze this from a trading perspective.`,
          },
        ],
        stream: false,
      });

      return aiRes.data.message || aiRes.data.content || "No AI response.";
    } catch (error) {
      console.error("DeepSeek V3 error:", error);
      return `Error retrieving info for ${symbol}.`;
    }
  };

  // const handleSendMessage = async (e) => {
  //   e.preventDefault();
  //   if (!inputMessage.trim()) return;

  //   const userMsg = {
  //     id: messages.length + 1,
  //     text: inputMessage,
  //     sender: "user",
  //     timestamp: new Date(),
  //   };

  //   setMessages((prev) => [...prev, userMsg]);
  //   setInputMessage("");
  //   setIsLoading(true);

  //   try {
  //     const isStockQuery = inputMessage.toLowerCase().startsWith("stock for ");
  //     const aiText = isStockQuery
  //       ? await callFinhubAndAnalyzeWithOpenRouter(inputMessage)
  //       : await callOpenRouterAPI(inputMessage);

  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         id: prev.length + 1,
  //         text: aiText,
  //         sender: "ai",
  //         timestamp: new Date(),
  //       },
  //     ]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    const streamId = `${Date.now()}-directstream`;

    // Placeholder for streaming response
    setMessages((prev) => [
      ...prev,
      {
        id: streamId,
        sender: "ai",
        stage: "streaming",
        partialText: "",
        timestamp: new Date(),
        queryType: "direct",
      },
    ]);

    try {
      const res = await fetch(`${BACKEND_URL}/api/deepseek-chat/direct/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputMessage }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let fullText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const lines = buffer.split("\n");

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();

          if (line.startsWith("data:")) {
            const text = line.replace("data:", "").trim();
            const cleaned = cleanAndFormat(text); // ← same formatter used in watchlist

            fullText += cleaned;

            setMessages((prev) =>
              prev.map((m) =>
                m.id === streamId ? { ...m, partialText: fullText } : m
              )
            );
          }
        }

        buffer = ""; // reset after each chunk
      }

      // Final AI message
      setMessages((prev) =>
        prev.map((m) =>
          m.id === streamId ? { ...m, stage: "final", text: fullText } : m
        )
      );
    } catch (err) {
      console.error("Stream error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `${streamId}-error`,
          sender: "ai",
          text: "Streaming failed.",
          isError: true,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // const handlePromptCardClick = async (prompt) => {
  //   if (isLoading) return;

  //   const userMsg = {
  //     id: messages.length + 1,
  //     text: prompt,
  //     sender: "user",
  //     timestamp: new Date(),
  //   };

  //   setMessages((prev) => [...prev, userMsg]);
  //   setIsLoading(true);

  //   try {
  //     const aiText = await callOpenRouterAPI(prompt);
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         id: prev.length + 1,
  //         text: aiText,
  //         sender: "ai",
  //         timestamp: new Date(),
  //       },
  //     ]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handlePromptCardClick = async (prompt) => {
    if (isLoading) return;

    const userMsg = {
      id: messages.length + 1,
      text: prompt,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const streamId = `${Date.now()}-promptstream`;

    // Placeholder for AI stream
    setMessages((prev) => [
      ...prev,
      {
        id: streamId,
        sender: "ai",
        stage: "streaming",
        partialText: "",
        timestamp: new Date(),
        queryType: "direct",
      },
    ]);

    try {
      const res = await fetch(`${BACKEND_URL}/api/deepseek-chat/direct/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let fullText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const lines = buffer.split("\n");

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith("data:")) {
            const text = line.replace("data:", "").trim();
            const cleaned = cleanAndFormat(text);

            fullText += cleaned;

            setMessages((prev) =>
              prev.map((m) =>
                m.id === streamId ? { ...m, partialText: fullText } : m
              )
            );
          }
        }

        buffer = "";
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === streamId ? { ...m, stage: "final", text: fullText } : m
        )
      );
    } catch (err) {
      console.error("Streaming error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `${streamId}-error`,
          sender: "ai",
          text: "Streaming failed.",
          isError: true,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#161921] pt-[0px]">
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-primary-text chat-help">
          How can I help you today?
        </h1>
      </div>

      {apiError && (
        <div className="bg-red-500 bg-opacity-20 border border-red-400 text-red-100 px-4 py-2 m-4 rounded">
          <p className="font-bold">API Error:</p>
          <p>{apiError}</p>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
            {promptCards.map((card) => (
              <div key={card.id}>
                <PromptCard
                  title={card.title}
                  subtitle={card.subtitle}
                  icon={card.icon}
                  onClick={() => handlePromptCardClick(card.title)}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex ${
                  msg.sender === "user" ? "flex-row-reverse" : ""
                } w-full max-w-4xl`}
              >
                {/* Avatar */}
                <div
                  className={`rounded-full w-10 h-10 flex items-center justify-center ${
                    msg.sender === "user"
                      ? "bg-hover-bg text-primary-accent ml-3"
                      : "bg-hover-bg text-blue-400 mr-3"
                  }`}
                >
                  <i
                    className={`bi ${
                      msg.sender === "user" ? "bi-person-circle" : "bi-robot"
                    } text-xl`}
                  ></i>
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-lg shadow whitespace-pre-wrap break-words w-full ${
                    msg.sender === "user"
                      ? "bg-primary-accent text-white rounded-tr-none"
                      : msg.isError
                      ? "bg-red-900 bg-opacity-30 text-primary-text rounded-tl-none border border-red-400"
                      : "bg-card-bg text-primary-text rounded-tl-none"
                  }`}
                >
                  {msg.stage === "progress" ? (
                    <div className="space-y-1 text-sm text-gray-300">
                      {msg.steps.map((step, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <i
                            className={`bi ${
                              step.done
                                ? "bi-check-circle-fill text-green-400"
                                : "bi-arrow-repeat animate-spin text-yellow-400"
                            }`}
                          ></i>
                          <span>{step.text}</span>
                        </div>
                      ))}
                    </div>
                  ) : msg.stage === "streaming" ? (
                    <ReactMarkdown
                      className="prose prose-invert max-w-none whitespace-pre-wrap break-words leading-relaxed"
                      linkTarget="_blank"
                      children={(msg.partialText || "").replace(/\*\*/g, "")}
                    />
                  ) : msg.stage === "final" ? (
                    <ReactMarkdown className="prose prose-invert max-w-none whitespace-pre-wrap break-words">
                      {msg.text || ""}
                    </ReactMarkdown>
                  ) : (
                    <p className="whitespace-pre-line break-words">
                      {msg.text || ""}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="p-6 border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="relative">
          <input
            type="text"
            className="w-full bg-input-bg border border-gray-600 rounded-full py-3 px-5 pr-12 text-primary-text placeholder-secondary-text focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="search-icon absolute right-2 top-2 p-2 bg-primary-accent text-white rounded-full hover:bg-green-600 disabled:opacity-50"
          >
            {isLoading ? (
              <i className="bi bi-hourglass-split animate-spin"></i>
            ) : (
              <i className="bi bi-send-fill"></i>
            )}
          </button>
        </form>
        <p className="text-center text-xs text-secondary-text mt-2">
          TradeGPT is for informational purposes only. Always do your own
          research.
        </p>
      </div>
    </div>
  );
};

export default ChatArea;

// import axios from "axios";
// import { useEffect, useRef, useState } from "react";
// import ReactMarkdown from "react-markdown";

// const BACKEND_URL = "https://backendoftradegpt-production.up.railway.app";

// const ChatArea = ({ toggleWatchlist, watchlistMessage }) => {
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [apiError, setApiError] = useState(null);
//   const [sessionId, setSessionId] = useState(null);
//   const [chatSessions, setChatSessions] = useState([]);
//   const [activeSessionId, setActiveSessionId] = useState(null);

//   const messagesEndRef = useRef(null);
//   const token = new URLSearchParams(window.location.search).get("token");

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Load user chat sessions
//   useEffect(() => {
//     if (token) {
//       axios
//         .get(`${BACKEND_URL}/api/chat/user-sessions/?token=${token}`)
//         .then((res) => setChatSessions(res.data))
//         .catch((err) => console.error("Session fetch error:", err));
//     }
//   }, [token]);

//   // Start session
//   useEffect(() => {
//     if (token && !sessionId) {
//       axios
//         .get(`${BACKEND_URL}/api/chat/start/?token=${token}`)
//         .then((res) => {
//           setSessionId(res.data.session_id);
//           setActiveSessionId(res.data.session_id);
//         })
//         .catch((err) => console.error("Session start failed:", err));
//     }
//   }, [token]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const saveMessage = async (role, content) => {
//     if (!sessionId) return;
//     await axios.post(
//       `${BACKEND_URL}/api/chat/sessions/${sessionId}/messages/?token=${token}`,
//       { role, content }
//     );
//   };

//   const loadSession = async (id) => {
//     setActiveSessionId(id);
//     setSessionId(id);
//     try {
//       const res = await axios.get(
//         `${BACKEND_URL}/api/chat/sessions/${id}/messages/?token=${token}`
//       );
//       setMessages(
//         res.data.map((msg, i) => ({
//           id: i,
//           sender: msg.role,
//           text: msg.content,
//           timestamp: msg.timestamp,
//         }))
//       );
//     } catch (err) {
//       setApiError("Failed to load chat.");
//     }
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!inputMessage.trim()) return;

//     const userMsg = {
//       id: Date.now(),
//       text: inputMessage,
//       sender: "user",
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMsg]);
//     await saveMessage("user", inputMessage);

//     setInputMessage("");
//     setIsLoading(true);

//     try {
//       const res = await fetch(`${BACKEND_URL}/api/deepseek-chat/stream`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           queryType: "default",
//           name: "N/A",
//           symbol: "N/A",
//         }),
//       });

//       const reader = res.body.getReader();
//       const decoder = new TextDecoder("utf-8");

//       let fullText = "";
//       const streamId = Date.now();

//       setMessages((prev) => [
//         ...prev,
//         { id: streamId, sender: "ai", partialText: "", stage: "streaming" },
//       ]);

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;
//         const chunk = decoder.decode(value);
//         const lines = chunk.split("\n");

//         lines.forEach((line) => {
//           if (line.startsWith("data:")) {
//             const text = line.replace("data:", "").trim();
//             fullText += text;

//             setMessages((prev) =>
//               prev.map((m) =>
//                 m.id === streamId ? { ...m, partialText: fullText } : m
//               )
//             );
//           }
//         });
//       }

//       setMessages((prev) =>
//         prev.map((m) =>
//           m.id === streamId ? { ...m, stage: "final", text: fullText } : m
//         )
//       );

//       await saveMessage("ai", fullText);
//     } catch (err) {
//       console.error("Stream error:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleInputChange = (e) => setInputMessage(e.target.value);

//   return (
//     <div className="flex flex-col h-screen bg-[#161921]">
//       <div className="flex justify-between items-center p-4 border-b border-gray-700">
//         <h1 className="text-xl text-white font-bold">TradeGPT</h1>
//         <div>
//           <button
//             onClick={toggleWatchlist}
//             className="text-sm text-gray-400 hover:text-white"
//           >
//             Watchlist
//           </button>
//         </div>
//       </div>

//       {/* Session History */}
//       <div className="overflow-x-auto whitespace-nowrap text-sm text-gray-300 border-b border-gray-700 p-2">
//         {chatSessions.map((s) => (
//           <button
//             key={s.session_id}
//             onClick={() => loadSession(s.session_id)}
//             className={`mr-2 px-3 py-1 rounded ${
//               activeSessionId === s.session_id
//                 ? "bg-blue-700 text-white"
//                 : "bg-gray-800"
//             }`}
//           >
//             {new Date(s.created_at).toLocaleString()}
//           </button>
//         ))}
//       </div>

//       {/* Chat Messages */}
//       <div className="flex-1 overflow-y-auto p-6 space-y-4">
//         {messages.map((msg) => (
//           <div
//             key={msg.id}
//             className={`flex ${
//               msg.sender === "user" ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`p-4 rounded-lg max-w-xl text-sm ${
//                 msg.sender === "user"
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-700 text-white"
//               }`}
//             >
//               {msg.stage === "streaming" ? (
//                 <ReactMarkdown>{msg.partialText}</ReactMarkdown>
//               ) : (
//                 <ReactMarkdown>{msg.text}</ReactMarkdown>
//               )}
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input Area */}
//       <div className="p-4 border-t border-gray-700">
//         <form onSubmit={handleSendMessage} className="relative">
//           <input
//             type="text"
//             placeholder="Type your message..."
//             value={inputMessage}
//             onChange={handleInputChange}
//             className="w-full p-3 rounded-full bg-gray-800 text-white pr-12"
//             disabled={isLoading}
//           />
//           <button
//             type="submit"
//             disabled={!inputMessage.trim() || isLoading}
//             className="absolute right-4 top-2 text-white"
//           >
//             <i className="bi bi-send-fill"></i>
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ChatArea;
