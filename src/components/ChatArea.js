// import axios from "axios";
// import { useEffect, useRef, useState } from "react";
// import PromptCard from "./PromptCard";

// const BACKEND_URL = "https://backendoftradegpt-production.up.railway.app";
// const ChatArea = ({ toggleWatchlist, watchlistMessage }) => {
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [apiError, setApiError] = useState(null);
//   const [sessionId, setSessionId] = useState(null);
//   const messagesEndRef = useRef(null);
//   const [chatSessions, setChatSessions] = useState([]);
//   const [activeSessionId, setActiveSessionId] = useState(null);
//   const token = new URLSearchParams(window.location.search).get("token");

//   const FINNHUB_API_KEY = "d08gifhr01qh1ecc2v7gd08gifhr01qh1ecc2v80";

//   const promptCards = [
//     {
//       id: 1,
//       title: "Top 3 Call option contracts related to EV",
//       subtitle: "with the highest likelihood of profit",
//       icon: "ev",
//     },
//     {
//       id: 2,
//       title: "Top 3 Call option contracts",
//       subtitle: "in the AI hardware sector",
//       icon: "ai",
//     },
//     {
//       id: 3,
//       title: "Get me the top 3 option contracts for NVDA",
//       subtitle: "that can yield quick profits today",
//       icon: "nvda",
//     },
//     {
//       id: 4,
//       title: "Provide shorting entry and exit for QQQ",
//       subtitle: "based on today's technical analysis",
//       icon: "qqq",
//     },
//   ];

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   useEffect(() => {
//     if (token) {
//       axios
//         .get(`${BACKEND_URL}/api/chat/user-sessions/?token=${token}`)
//         .then((res) => {
//           setChatSessions(res.data);
//         })
//         .catch((err) => {
//           console.error("Failed to load chat sessions:", err);
//         });
//     }
//   }, [token]);

//   const loadSession = async (session_id) => {
//     try {
//       setSessionId(session_id);
//       setActiveSessionId(session_id);
//       const res = await axios.get(
//         `${BACKEND_URL}/api/chat/sessions/${session_id}/messages/?token=${token}`
//       );
//       setMessages(res.data);
//     } catch (err) {
//       console.error("Failed to load session messages:", err);
//       setApiError("Failed to load chat session.");
//     }
//   };

//   // const handleSendWatchlistMessage = async (msg) => {
//   //   if (!msg.trim()) return;

//   //   const userMsg = {
//   //     id: messages.length + 1,
//   //     text: msg,
//   //     sender: "user",
//   //     timestamp: new Date(),
//   //   };

//   //   setMessages((prev) => [...prev, userMsg]);
//   //   setIsLoading(true);

//   //   try {
//   //     const isStockQuery = msg.toLowerCase().startsWith("stock for ");
//   //     const aiText = isStockQuery
//   //       ? await callFinhubAndAnalyzeWithOpenRouter(msg)
//   //       : await callOpenRouterAPI(msg);

//   //     setMessages((prev) => [
//   //       ...prev,
//   //       {
//   //         id: prev.length + 1,
//   //         text: aiText,
//   //         sender: "ai",
//   //         timestamp: new Date(),
//   //       },
//   //     ]);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };
//   // FRONTEND - watchlist.js/chat.js
//   const handleSendWatchlistMessage = async (msg) => {
//     setIsLoading(true);

//     try {
//       let aiText;

//       if (typeof msg === "object") {
//         // Forward object to DeepSeek endpoint with full financial data
//         const res = await axios.post(`${BACKEND_URL}/api/deepseek-chat/`, msg);
//         aiText = res.data.message;
//       } else {
//         // Default text-based prompt (fallback)
//         aiText = await callOpenRouterAPI(msg);
//       }

//       setMessages((prev) => [
//         ...prev,
//         {
//           id: prev.length + 1,
//           text: aiText,
//           sender: "ai",
//           timestamp: new Date(),
//         },
//       ]);
//     } catch (err) {
//       console.error("AI Error:", err);
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: prev.length + 1,
//           text: "Failed to get AI response.",
//           sender: "ai",
//           timestamp: new Date(),
//           isError: true,
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // useEffect(() => {
//   //   if (watchlistMessage && watchlistMessage.trim()) {
//   //     handleSendWatchlistMessage(watchlistMessage);
//   //   }
//   //   // eslint-disable-next-line react-hooks/exhaustive-deps
//   // }, [watchlistMessage]);

//   useEffect(() => {
//     if (
//       (typeof watchlistMessage === "string" && watchlistMessage.trim()) ||
//       (typeof watchlistMessage === "object" && watchlistMessage !== null)
//     ) {
//       handleSendWatchlistMessage(watchlistMessage);
//     }
//   }, [watchlistMessage]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleInputChange = (e) => setInputMessage(e.target.value);

//   const callOpenRouterAPI = async (messageText) => {
//     setApiError(null);
//     try {
//       const prompt = `SYSTEM: You are TradeGPT, an expert in finance and trading.\n\nUSER: ${messageText}\n\nASSISTANT:`;
//       const response = await axios.post(
//         `${BACKEND_URL}/api/proxy/openrouter/?token=${token}`,
//         {
//           model: "meta-llama/Meta-Llama-3-8B-Instruct",
//           inputs: {
//             prompt: prompt,
//           },
//           stream: true,
//         }
//       );
//       return response.data.message || response.data.content || "No response.";
//     } catch (error) {
//       console.error("Ollama Proxy Error:", error);
//       setApiError("AI service is currently unavailable");
//       return "AI service is currently unavailable.";
//     }
//   };

//   const callFinhubAndAnalyzeWithOpenRouter = async (messageText) => {
//     const match = messageText.toLowerCase().match(/stock for ([A-Z]{1,5})/i);
//     const symbol = match?.[1]?.toUpperCase();
//     if (!symbol) return "Invalid stock symbol.";
//     try {
//       const stockRes = await axios.get(
//         `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
//       );
//       const data = stockRes.data;
//       const summary = `${symbol} is trading at $${data.c}, change: ${data.d} (${data.dp}%).`;

//       const aiRes = await axios.post(
//         `${BACKEND_URL}/api/proxy/openrouter/?token=${token}`,
//         {
//           model: "deepseek-r1:1.5b",
//           messages: [
//             {
//               role: "system",
//               content: `You are TradeGPT, interpret stock metrics without omitting any value.`,
//             },
//             {
//               role: "user",
//               content: `Stock info for ${symbol}: ${summary}. What does this mean for traders?`,
//             },
//           ],
//           stream: false,
//         }
//       );
//       return aiRes.data.message || aiRes.data.content || "No AI response.";
//     } catch (error) {
//       console.error("Finnhub/Ollama Proxy Error:", error);
//       return `Error retrieving info for ${symbol}.`;
//     }
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!inputMessage.trim()) return;

//     const userMsg = {
//       id: messages.length + 1,
//       text: inputMessage,
//       sender: "user",
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMsg]);
//     setInputMessage("");
//     setIsLoading(true);

//     try {
//       const isStockQuery = inputMessage.toLowerCase().startsWith("stock for ");
//       const aiText = isStockQuery
//         ? await callFinhubAndAnalyzeWithOpenRouter(inputMessage)
//         : await callOpenRouterAPI(inputMessage);

//       setMessages((prev) => [
//         ...prev,
//         {
//           id: prev.length + 1,
//           text: aiText,
//           sender: "ai",
//           timestamp: new Date(),
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePromptCardClick = async (prompt) => {
//     if (isLoading) return;

//     const userMsg = {
//       id: messages.length + 1,
//       text: prompt,
//       sender: "user",
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMsg]);
//     setIsLoading(true);

//     try {
//       const aiText = await callOpenRouterAPI(prompt);
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: prev.length + 1,
//           text: aiText,
//           sender: "ai",
//           timestamp: new Date(),
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-[#161921] pt-[0px]">
//       <div className="flex items-center justify-between p-6 border-b border-gray-700">
//         <h1 className="text-2xl font-bold text-primary-text chat-help">
//           How can I help you today?
//         </h1>
//       </div>

//       {apiError && (
//         <div className="bg-red-500 bg-opacity-20 border border-red-400 text-red-100 px-4 py-2 m-4 rounded">
//           <p className="font-bold">API Error:</p>
//           <p>{apiError}</p>
//         </div>
//       )}

//       {messages.length === 0 ? (
//         <div className="flex-1 p-6 flex items-center justify-center">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
//             {promptCards.map((card) => (
//               <div key={card.id}>
//                 <PromptCard
//                   title={card.title}
//                   subtitle={card.subtitle}
//                   icon={card.icon}
//                   onClick={() => handlePromptCardClick(card.title)}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <div className="flex-1 overflow-y-auto p-6 space-y-6">
//           {messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`flex ${
//                 msg.sender === "user" ? "justify-end" : "justify-start"
//               }`}
//             >
//               <div
//                 className={`flex ${
//                   msg.sender === "user" ? "flex-row-reverse" : ""
//                 } max-w-3xl`}
//               >
//                 <div
//                   className={`rounded-full w-10 h-10 flex items-center justify-center ${
//                     msg.sender === "user"
//                       ? "bg-hover-bg text-primary-accent ml-3"
//                       : "bg-hover-bg text-blue-400 mr-3"
//                   }`}
//                 >
//                   <i
//                     className={`bi ${
//                       msg.sender === "user" ? "bi-person-circle" : "bi-robot"
//                     } text-xl`}
//                   ></i>
//                 </div>
//                 <div
//                   className={`p-4 rounded-lg shadow ${
//                     msg.sender === "user"
//                       ? "bg-primary-accent text-white rounded-tr-none"
//                       : msg.isError
//                       ? "bg-red-900 bg-opacity-30 text-primary-text rounded-tl-none border border-red-400"
//                       : "bg-card-bg text-primary-text rounded-tl-none"
//                   }`}
//                 >
//                   <p className="whitespace-pre-line">{msg.text}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>
//       )}

//       <div className="p-6 border-t border-gray-700">
//         <form onSubmit={handleSendMessage} className="relative">
//           <input
//             type="text"
//             className="w-full bg-input-bg border border-gray-600 rounded-full py-3 px-5 pr-12 text-primary-text placeholder-secondary-text focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent"
//             placeholder="Type your message..."
//             value={inputMessage}
//             onChange={handleInputChange}
//             disabled={isLoading}
//           />
//           <button
//             type="submit"
//             disabled={!inputMessage.trim() || isLoading}
//             className="search-icon absolute right-2 top-2 p-2 bg-primary-accent text-white rounded-full hover:bg-green-600 disabled:opacity-50"
//           >
//             {isLoading ? (
//               <i className="bi bi-hourglass-split animate-spin"></i>
//             ) : (
//               <i className="bi bi-send-fill"></i>
//             )}
//           </button>
//         </form>
//         <p className="text-center text-xs text-secondary-text mt-2">
//           TradeGPT is for informational purposes only. Always do your own
//           research.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ChatArea;

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

  // const handleSendWatchlistMessage = async (msg) => {
  //   setIsLoading(true);

  //   const baseId = Date.now();
  //   const steps = [
  //     "Retrieved detailed company information.",
  //     "Retrieved fundamental ratios for the stock.",
  //     "Retrieved company earnings reports information.",
  //     "Consolidating and analyzing information...",
  //   ];

  //   // Add base step message
  //   setMessages((prev) => [
  //     ...prev,
  //     {
  //       id: baseId,
  //       sender: "ai",
  //       stage: "progress",
  //       steps: steps.map((text) => ({ text, done: false })),
  //       timestamp: new Date(),
  //     },
  //   ]);

  //   const updateStep = (stepIndex) => {
  //     setMessages((prev) =>
  //       prev.map((msg) =>
  //         msg.id === baseId
  //           ? {
  //               ...msg,
  //               steps: msg.steps.map((s, i) =>
  //                 i === stepIndex ? { ...s, done: true } : s
  //               ),
  //             }
  //           : msg
  //       )
  //     );
  //   };

  //   // Play steps 0–2 slowly
  //   for (let i = 0; i < 3; i++) {
  //     await new Promise((r) => setTimeout(r, 1200));
  //     updateStep(i);
  //   }

  //   // Mark step 3 ("Consolidating...") but don’t resolve immediately
  //   updateStep(3);

  //   try {
  //     const res = await axios.post(`${BACKEND_URL}/api/deepseek-chat/`, msg);
  //     const aiText = res.data.message;

  //     // Replace staged message with final result
  //     setMessages((prev) =>
  //       prev.map((m) =>
  //         m.id === baseId
  //           ? {
  //               ...m,
  //               stage: "final",
  //               text: aiText,
  //             }
  //           : m
  //       )
  //     );
  //   } catch (err) {
  //     console.error("AI Error:", err);
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         id: prev.length + 1,
  //         text: "Failed to get AI response.",
  //         sender: "ai",
  //         timestamp: new Date(),
  //         isError: true,
  //       },
  //     ]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

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
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        fullText += chunk;

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
    try {
      const prompt = `SYSTEM: You are TradeGPT, an expert in finance and trading.\n\nUSER: ${messageText}\n\nASSISTANT:`;
      const response = await axios.post(`${BACKEND_URL}/api/deepseek-chat`, {
        inputs: {
          prompt: prompt,
        },
        stream: false,
      });
      return response.data.message || response.data.content || "No response.";
    } catch (error) {
      console.error("Ollama Proxy Error:", error);
      setApiError("AI service is currently unavailable");
      return "AI service is currently unavailable.";
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

    try {
      const isStockQuery = inputMessage.toLowerCase().startsWith("stock for ");
      const aiText = isStockQuery
        ? await callFinhubAndAnalyzeWithOpenRouter(inputMessage)
        : await callOpenRouterAPI(inputMessage);

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: aiText,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

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

    try {
      const aiText = await callOpenRouterAPI(prompt);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: aiText,
          sender: "ai",
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
                } max-w-3xl`}
              >
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
                <div
                  className={`p-4 rounded-lg shadow ${
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
                  ) : msg.stage === "final" ? (
                    <ReactMarkdown className="prose prose-invert max-w-none">
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    <p className="whitespace-pre-line">{msg.text}</p>
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
