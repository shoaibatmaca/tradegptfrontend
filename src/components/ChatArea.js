// import axios from "axios";
// import { useEffect, useRef, useState } from "react";
// import ReactMarkdown from "react-markdown";
// import PromptCard from "./PromptCard";
// import TradingPromptsInline from "./TradingPromptsInline";

// const BACKEND_URL = "https://backendoftradegpt-production.up.railway.app";

// // ADD: Update props to include prompts functionality
// const ChatArea = ({
//   toggleWatchlist,
//   watchlistMessage,
//   showPrompts,
//   onClosePrompts,
//   activeSection,
// }) => {
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [apiError, setApiError] = useState(null);
//   const [sessionId, setSessionId] = useState(null);
//   const messagesEndRef = useRef(null);
//   const [chatSessions, setChatSessions] = useState([]);
//   const [activeSessionId, setActiveSessionId] = useState(null);
//   const token = new URLSearchParams(window.location.search).get("token");

//   // ... (all your existing functions remain the same: cleanAndFormat, scrollToBottom, etc.)
//   const FINNHUB_API_KEY = "d08gifhr01qh1ecc2v7gd08gifhr01qh1ecc2v80";

//   // function cleanAndFormat(text) {
//   //   return text
//   //     .replace(/^markdown[#>]*\s*/i, "")
//   //     .replace(/(?<!\n)(#+\s*)([A-Za-z])/g, "\n\n$1$2")
//   //     .replace(/#{3,6}\s*#?\s*/g, "\n\n### ")
//   //     .replace(/\*\*(.*?)\*\*/g, "$1")
//   //     .replace(/\*(.*?)\*/g, "$1")
//   //     .replace(/`{1,3}(.*?)`{1,3}/g, "$1")
//   //     .replace(/\|.*?\|/g, "")
//   //     .replace(/-{3,}/g, "\n\n---\n\n")
//   //     .replace(/([A-Za-z])(:)(?=\S)/g, "$1: ")
//   //     .replace(/###\s*#\s*/g, "### ")
//   //     .replace(/KeyFinancialMetrics\s*\(TTM\)/gi, "### Key Financial Metrics")
//   //     .replace(/TradeSetupbyvalourGPT/gi, "Trade Setup by ValourGPT")
//   //     .replace(/Buy&SellReasons/gi, "Buy & Sell Reasons")
//   //     .replace(/UniqueValueProposition/gi, "Unique Value Proposition")
//   //     .replace(/AnalystInsights/gi, "Analyst Insights")
//   //     .replace(/UpcomingEvents/gi, "Upcoming Events")
//   //     .replace(/TechnicalIndicators/gi, "Technical Indicators")
//   //     .replace(/Competitors/gi, "Competitors")
//   //     .replace(/Note\s*:/gi, "\n\n**Note:** ")
//   //     .replace(/ValuationNote\s*:/gi, "\n\n**Valuation Note:** ")
//   //     .replace(/VisualAid\s*:/gi, "\n\n**Visual Aid:** ")
//   //     .replace(/\n{2,}/g, "\n\n")
//   //     .replace(/\s{2,}/g, " ")
//   //     .trim();
//   // }

//   function cleanAndFormat(text) {
//     return (
//       text
//         // Fix glued words: AppleInc → Apple Inc
//         .replace(/([a-z])([A-Z])/g, "$1 $2")

//         // Remove headings from lines like "### 1. Tesla (TSLA)" → just plain line
//         .replace(/#{2,6}\s*(\d+\.\s?[A-Z][^\n]+)/g, "\n\n$1")

//         // Keep Option 1/2/3 with proper heading
//         .replace(/Option\s*(\d+)\s*:/gi, "\n\n### Option $1")

//         // Normalize leftover ###
//         .replace(/#{3,6}\s*/g, "\n\n### ")

//         // Remove **bold** and *italic* completely
//         .replace(/\*\*(.*?)\*\*/g, "$1")
//         .replace(/\*(.*?)\*/g, "$1")
//         .replace(/`{1,3}(.*?)`{1,3}/g, "$1")

//         // Key: Value → bullet format
//         .replace(/([A-Za-z0-9\(\)\/%$\- ]+):\s*([^\n]+)/g, "- **$1:** $2")

//         // Fix glued colon
//         .replace(/([a-zA-Z])(:)([^\s])/g, "$1: $3")

//         // Remove tables, separators
//         .replace(/\|.*?\|/g, "")
//         .replace(/-{3,}/g, "\n\n---\n\n")

//         // Cleanup spacing
//         .replace(/\n{3,}/g, "\n\n")
//         .replace(/\s{2,}/g, " ")

//         .trim()
//     );
//   }

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

//   // ADD: Handle using prompts from TradingPromptsInline
//   const handleUsePrompt = (promptText) => {
//     setInputMessage(promptText);
//     if (onClosePrompts) {
//       onClosePrompts(); // Close prompts and go back to chat
//     }
//     // Automatically send the message
//     setTimeout(() => {
//       const event = { preventDefault: () => {} };
//       handleSendMessage(event);
//     }, 100);
//   };

//   // ... (all your existing useEffect and functions remain exactly the same)
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

//   const handleSendWatchlistMessage = async (msg) => {
//     setIsLoading(true);

//     const baseId = Date.now();
//     const steps = [
//       "Retrieved detailed company information.",
//       "Retrieved fundamental ratios for the stock.",
//       "Retrieved company earnings reports information.",
//       "Consolidating and analyzing information...",
//     ];

//     setMessages((prev) => [
//       ...prev,
//       {
//         id: baseId,
//         sender: "ai",
//         stage: "progress",
//         steps: steps.map((text) => ({ text, done: false })),
//         timestamp: new Date(),
//       },
//     ]);

//     const updateStep = (stepIndex) => {
//       setMessages((prev) =>
//         prev.map((msg) =>
//           msg.id === baseId
//             ? {
//                 ...msg,
//                 steps: msg.steps.map((s, i) =>
//                   i === stepIndex ? { ...s, done: true } : s
//                 ),
//               }
//             : msg
//         )
//       );
//     };

//     for (let i = 0; i < 3; i++) {
//       await new Promise((r) => setTimeout(r, 1200));
//       updateStep(i);
//     }

//     updateStep(3);

//     const streamId = `${baseId}-stream`;

//     setMessages((prev) => [
//       ...prev,
//       {
//         id: streamId,
//         sender: "ai",
//         stage: "streaming",
//         partialText: "",
//         timestamp: new Date(),
//         queryType: msg.queryType || "default",
//       },
//     ]);

//     try {
//       const res = await fetch(`${BACKEND_URL}/api/deepseek-chat/stream`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(msg),
//       });

//       const reader = res.body.getReader();
//       const decoder = new TextDecoder("utf-8");

//       let fullText = "";
//       let buffer = "";

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;

//         const chunk = decoder.decode(value, { stream: true });
//         buffer += chunk;

//         const lines = buffer.split("\n");

//         for (let i = 0; i < lines.length; i++) {
//           const line = lines[i].trim();

//           if (line.startsWith("data:")) {
//             const text = line.replace("data:", "").trim();
//             const cleaned =
//               msg.queryType === "default" ? cleanAndFormat(text) : text;

//             fullText += cleaned;

//             setMessages((prev) =>
//               prev.map((m) =>
//                 m.id === streamId ? { ...m, partialText: fullText } : m
//               )
//             );

//             await new Promise((r) => setTimeout(r, 20));
//           }
//         }

//         buffer = "";
//       }

//       if (buffer.length > 0) {
//         fullText += buffer;
//         setMessages((prev) =>
//           prev.map((m) =>
//             m.id === streamId ? { ...m, partialText: fullText } : m
//           )
//         );
//       }

//       setMessages((prev) =>
//         prev.map((m) =>
//           m.id === streamId ? { ...m, stage: "final", text: fullText } : m
//         )
//       );
//     } catch (err) {
//       console.error("Stream Error:", err);
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: `${baseId}-error`,
//           sender: "ai",
//           text: "Streaming failed.",
//           isError: true,
//           timestamp: new Date(),
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

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

//     const streamId = `${Date.now()}-directstream`;

//     setMessages((prev) => [
//       ...prev,
//       {
//         id: streamId,
//         sender: "ai",
//         stage: "streaming",
//         partialText: "",
//         timestamp: new Date(),
//         queryType: "direct",
//       },
//     ]);

//     try {
//       const res = await fetch(`${BACKEND_URL}/api/deepseek-chat/direct/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: messageText }),
//       });

//       const reader = res.body.getReader();
//       const decoder = new TextDecoder("utf-8");

//       let fullText = "";
//       let buffer = "";

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;

//         const chunk = decoder.decode(value, { stream: true });
//         buffer += chunk;

//         const lines = buffer.split("\n");

//         for (let i = 0; i < lines.length; i++) {
//           const line = lines[i].trim();

//           if (line.startsWith("data:")) {
//             const text = line.replace("data:", "").trim();
//             const cleaned = cleanAndFormat(text);
//             fullText += cleaned;

//             setMessages((prev) =>
//               prev.map((m) =>
//                 m.id === streamId ? { ...m, partialText: fullText } : m
//               )
//             );
//           }
//         }

//         buffer = "";
//       }

//       setMessages((prev) =>
//         prev.map((m) =>
//           m.id === streamId ? { ...m, stage: "final", text: fullText } : m
//         )
//       );
//     } catch (err) {
//       console.error("Direct chat stream error:", err);
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: `${streamId}-error`,
//           sender: "ai",
//           text: "Streaming failed.",
//           isError: true,
//           timestamp: new Date(),
//         },
//       ]);
//     }
//   };

//   const callFinhubAndAnalyzeWithOpenRouter = async (messageText) => {
//     const match = messageText.toLowerCase().match(/stock for ([A-Z]{1,5})/i);
//     const symbol = match?.[1]?.toUpperCase();
//     if (!symbol) return "Invalid stock symbol.";

//     try {
//       const quoteRes = await axios.get(
//         `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=04RGF1U9PAJ49VYI`
//       );

//       const timeSeries = quoteRes.data["Time Series (Daily)"];
//       if (!timeSeries) throw new Error("Alpha Vantage data invalid");

//       const [latestDate, previousDate] = Object.keys(timeSeries);
//       const today = timeSeries[latestDate];
//       const previous = timeSeries[previousDate];

//       const closeToday = parseFloat(today["4. close"]);
//       const closePrev = parseFloat(previous["4. close"]);

//       const summary = `${symbol} is trading at $${closeToday.toFixed(
//         2
//       )}, change: ${(closeToday - closePrev).toFixed(2)} (${(
//         ((closeToday - closePrev) / closePrev) *
//         100
//       ).toFixed(2)}%).`;

//       const aiRes = await axios.post(`${BACKEND_URL}/api/deepseek-chat/`, {
//         model: "deepseek-chat",
//         messages: [
//           {
//             role: "system",
//             content: "You are DeepSeek V3, a financial trading assistant.",
//           },
//           {
//             role: "user",
//             content: `Stock info for ${symbol}: ${summary}. Analyze this from a trading perspective.`,
//           },
//         ],
//         stream: false,
//       });

//       return aiRes.data.message || aiRes.data.content || "No AI response.";
//     } catch (error) {
//       console.error("DeepSeek V3 error:", error);
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

//     const streamId = `${Date.now()}-directstream`;

//     setMessages((prev) => [
//       ...prev,
//       {
//         id: streamId,
//         sender: "ai",
//         stage: "streaming",
//         partialText: "",
//         timestamp: new Date(),
//         queryType: "direct",
//       },
//     ]);

//     try {
//       const res = await fetch(`${BACKEND_URL}/api/deepseek-chat/direct/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: inputMessage }),
//       });

//       const reader = res.body.getReader();
//       const decoder = new TextDecoder("utf-8");

//       let fullText = "";
//       let buffer = "";

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;

//         const chunk = decoder.decode(value, { stream: true });
//         buffer += chunk;

//         const lines = buffer.split("\n");

//         for (let i = 0; i < lines.length; i++) {
//           const line = lines[i].trim();

//           if (line.startsWith("data:")) {
//             const text = line.replace("data:", "").trim();
//             const cleaned = cleanAndFormat(text);

//             fullText += cleaned;

//             setMessages((prev) =>
//               prev.map((m) =>
//                 m.id === streamId ? { ...m, partialText: fullText } : m
//               )
//             );
//           }
//         }

//         buffer = "";
//       }

//       setMessages((prev) =>
//         prev.map((m) =>
//           m.id === streamId ? { ...m, stage: "final", text: fullText } : m
//         )
//       );
//     } catch (err) {
//       console.error("Stream error:", err);
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: `${streamId}-error`,
//           sender: "ai",
//           text: "Streaming failed.",
//           isError: true,
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

//     const streamId = `${Date.now()}-promptstream`;

//     setMessages((prev) => [
//       ...prev,
//       {
//         id: streamId,
//         sender: "ai",
//         stage: "streaming",
//         partialText: "",
//         timestamp: new Date(),
//         queryType: "direct",
//       },
//     ]);

//     try {
//       const res = await fetch(`${BACKEND_URL}/api/deepseek-chat/direct/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: prompt }),
//       });

//       const reader = res.body.getReader();
//       const decoder = new TextDecoder("utf-8");

//       let fullText = "";
//       let buffer = "";

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;

//         const chunk = decoder.decode(value, { stream: true });
//         buffer += chunk;

//         const lines = buffer.split("\n");

//         for (let i = 0; i < lines.length; i++) {
//           const line = lines[i].trim();
//           if (line.startsWith("data:")) {
//             const text = line.replace("data:", "").trim();
//             const cleaned = cleanAndFormat(text);

//             fullText += cleaned;

//             setMessages((prev) =>
//               prev.map((m) =>
//                 m.id === streamId ? { ...m, partialText: fullText } : m
//               )
//             );
//           }
//         }

//         buffer = "";
//       }

//       setMessages((prev) =>
//         prev.map((m) =>
//           m.id === streamId ? { ...m, stage: "final", text: fullText } : m
//         )
//       );
//     } catch (err) {
//       console.error("Streaming error:", err);
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: `${streamId}-error`,
//           sender: "ai",
//           text: "Streaming failed.",
//           isError: true,
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

//       {/* UPDATE: Conditional rendering for prompts vs default vs messages */}
//       {showPrompts ? (
//         // Show Trading Prompts Interface
//         <div
//           className="flex-1 overflow-y-auto p-6"
//           style={{ backgroundColor: "#1e1e1e" }}
//         >
//           <TradingPromptsInline
//             isVisible={showPrompts}
//             onUsePrompt={handleUsePrompt}
//           />
//         </div>
//       ) : messages.length === 0 ? (
//         // Show Default Prompt Cards
//         <div className="flex-1 p-6 flex items-center justify-center chat-area-part">
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
//         // Show Chat Messages
//         <div className="flex-1 overflow-y-auto p-6 space-y-6 chat-bg">
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
//                 } w-full max-w-4xl`}
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
//                   className={`chat-render p-4 rounded-lg shadow whitespace-pre-wrap break-words w-full ${
//                     msg.sender === "user"
//                       ? "bg-primary-accent bg-primary text-white rounded-tr-none"
//                       : msg.isError
//                       ? "bg-red-900 bg-opacity-30 text-primary-text rounded-tl-none border border-red-400"
//                       : "bg-card-bg text-primary-text rounded-tl-none"
//                   }`}
//                 >
//                   {msg.stage === "progress" ? (
//                     <div className="space-y-1 text-sm text-gray-300">
//                       {msg.steps.map((step, index) => (
//                         <div key={index} className="flex items-center gap-2">
//                           <i
//                             className={`bi ${
//                               step.done
//                                 ? "bi-check-circle-fill text-green-400"
//                                 : "bi-arrow-repeat animate-spin text-yellow-400"
//                             }`}
//                           ></i>
//                           <span>{step.text}</span>
//                         </div>
//                       ))}
//                     </div>
//                   ) : msg.stage === "streaming" ? (
//                     <ReactMarkdown
//                       className="prose prose-invert max-w-none whitespace-pre-wrap break-words leading-relaxed"
//                       linkTarget="_blank"
//                       children={(msg.partialText || "").replace(/\*\*/g, "")}
//                     />
//                   ) : msg.stage === "final" ? (
//                     <ReactMarkdown className="prose prose-invert max-w-none whitespace-pre-wrap break-words">
//                       {msg.text || ""}
//                     </ReactMarkdown>
//                   ) : (
//                     <p className="whitespace-pre-line break-words">
//                       {msg.text || ""}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}

//           <div ref={messagesEndRef} />
//         </div>
//       )}

//       <div
//         className="p-6 border-t border-gray-700"
//         style={{ backgroundColor: "#1e1e1e" }}
//       >
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

// import axios from "axios";
// import { useEffect, useRef, useState } from "react";
// import ReactMarkdown from "react-markdown";
// import PromptCard from "./PromptCard";
// import TradingPromptsInline from "./TradingPromptsInline";

// const BACKEND_URL = "https://backendoftradegpt-production.up.railway.app";

// // ADD: Update props to include prompts functionality
// const ChatArea = ({
//   toggleWatchlist,
//   watchlistMessage,
//   showPrompts,
//   onClosePrompts,
//   activeSection,
// }) => {
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [apiError, setApiError] = useState(null);
//   const [sessionId, setSessionId] = useState(null);
//   const messagesEndRef = useRef(null);
//   const [chatSessions, setChatSessions] = useState([]);
//   const [activeSessionId, setActiveSessionId] = useState(null);
//   const token = new URLSearchParams(window.location.search).get("token");

//   // ... (all your existing functions remain the same: cleanAndFormat, scrollToBottom, etc.)
//   const FINNHUB_API_KEY = "d08gifhr01qh1ecc2v7gd08gifhr01qh1ecc2v80";

//   // function cleanAndFormat(text) {
//   //   return text
//   //     .replace(/^markdown[#>]\s/i, "")
//   //     .replace(/(?<!\n)(#+\s*)([A-Za-z])/g, "\n\n$1$2")
//   //     .replace(/#{3,6}\s*#?\s*/g, "\n\n### ")
//   //     .replace(/\\(.?)\\*/g, "$1")
//   //     .replace(/\(.?)\*/g, "$1")
//   //     .replace(/{1,3}(.*?){1,3}/g, "$1")
//   //     .replace(/\|.*?\|/g, "")
//   //     .replace(/-{3,}/g, "\n\n---\n\n")
//   //     .replace(/([A-Za-z])(:)(?=\S)/g, "$1: ")
//   //     .replace(/###\s*#\s*/g, "### ")
//   //     .replace(/KeyFinancialMetrics\s*\(TTM\)/gi, "### Key Financial Metrics")
//   //     .replace(/TradeSetupbyvalourGPT/gi, "Trade Setup by ValourGPT")
//   //     .replace(/Buy&SellReasons/gi, "Buy & Sell Reasons")
//   //     .replace(/UniqueValueProposition/gi, "Unique Value Proposition")
//   //     .replace(/AnalystInsights/gi, "Analyst Insights")
//   //     .replace(/UpcomingEvents/gi, "Upcoming Events")
//   //     .replace(/TechnicalIndicators/gi, "Technical Indicators")
//   //     .replace(/Competitors/gi, "Competitors")
//   //     .replace(/Note\s*:/gi, "\n\n*Note:* ")
//   //     .replace(/ValuationNote\s*:/gi, "\n\n*Valuation Note:* ")
//   //     .replace(/VisualAid\s*:/gi, "\n\n*Visual Aid:* ")
//   //     .replace(/\n{2,}/g, "\n\n")
//   //     .replace(/\s{2,}/g, " ")
//   //     .trim();
//   // }

//   function cleanAndFormat(text) {
//     return (
//       text
//         // Fix glued words: AppleInc → Apple Inc
//         .replace(/([a-z])([A-Z])/g, "$1 $2")

//         // Remove headings from lines like "### 1. Tesla (TSLA)" → just plain line
//         .replace(/#{2,6}\s*(\d+\.\s?[A-Z][^\n]+)/g, "\n\n$1")

//         // Keep Option 1/2/3 with proper heading
//         .replace(/Option\s*(\d+)\s*:/gi, "\n\n### Option $1")

//         // Normalize leftover ###
//         .replace(/#{3,6}\s*/g, "\n\n### ")

//         // Remove *bold* and italic completely
//         .replace(/\\(.?)\\*/g, "$1")
//         .replace(/\(.?)\*/g, "$1")
//         .replace(/{1,3}(.*?){1,3}/g, "$1")

//         // Key: Value → bullet format
//         .replace(/([A-Za-z0-9\(\)\/%$\- ]+):\s*([^\n]+)/g, "- *$1:* $2")

//         // Fix glued colon
//         .replace(/([a-zA-Z])(:)([^\s])/g, "$1: $3")

//         // Remove tables, separators
//         .replace(/\|.*?\|/g, "")
//         .replace(/-{3,}/g, "\n\n---\n\n")

//         // Cleanup spacing
//         .replace(/\n{3,}/g, "\n\n")
//         .replace(/\s{2,}/g, " ")

//         .trim()
//     );
//   }

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

//   // ADD: Handle using prompts from TradingPromptsInline
//   const handleUsePrompt = (promptText) => {
//     setInputMessage(promptText);
//     if (onClosePrompts) {
//       onClosePrompts(); // Close prompts and go back to chat
//     }
//     // Automatically send the message
//     setTimeout(() => {
//       const event = { preventDefault: () => {} };
//       handleSendMessage(event);
//     }, 100);
//   };

//   // ... (all your existing useEffect and functions remain exactly the same)
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   useEffect(() => {
//     if (token) {
//       axios
//         .get(${BACKEND_URL}/api/chat/user-sessions/?token=${token})
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
//         ${BACKEND_URL}/api/chat/sessions/${session_id}/messages/?token=${token}
//       );
//       setMessages(res.data);
//     } catch (err) {
//       console.error("Failed to load session messages:", err);
//       setApiError("Failed to load chat session.");
//     }
//   };

//   const handleSendWatchlistMessage = async (msg) => {
//     setIsLoading(true);

//     const baseId = Date.now();
//     const steps = [
//       "Retrieved detailed company information.",
//       "Retrieved fundamental ratios for the stock.",
//       "Retrieved company earnings reports information.",
//       "Consolidating and analyzing information...",
//     ];

//     setMessages((prev) => [
//       ...prev,
//       {
//         id: baseId,
//         sender: "ai",
//         stage: "progress",
//         steps: steps.map((text) => ({ text, done: false })),
//         timestamp: new Date(),
//       },
//     ]);

//     const updateStep = (stepIndex) => {
//       setMessages((prev) =>
//         prev.map((msg) =>
//           msg.id === baseId
//             ? {
//                 ...msg,
//                 steps: msg.steps.map((s, i) =>
//                   i === stepIndex ? { ...s, done: true } : s
//                 ),
//               }
//             : msg
//         )
//       );
//     };

//     for (let i = 0; i < 3; i++) {
//       await new Promise((r) => setTimeout(r, 1200));
//       updateStep(i);
//     }

//     updateStep(3);

//     const streamId = ${baseId}-stream;

//     setMessages((prev) => [
//       ...prev,
//       {
//         id: streamId,
//         sender: "ai",
//         stage: "streaming",
//         partialText: "",
//         timestamp: new Date(),
//         queryType: msg.queryType || "default",
//       },
//     ]);

//     try {
//       const res = await fetch(${BACKEND_URL}/api/deepseek-chat/stream, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(msg),
//       });

//       const reader = res.body.getReader();
//       const decoder = new TextDecoder("utf-8");

//       let fullText = "";
//       let buffer = "";

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;

//         const chunk = decoder.decode(value, { stream: true });
//         buffer += chunk;

//         const lines = buffer.split("\n");

//         for (let i = 0; i < lines.length; i++) {
//           const line = lines[i].trim();

//           if (line.startsWith("data:")) {
//             const text = line.replace("data:", "").trim();
//             const cleaned =
//               msg.queryType === "default" ? cleanAndFormat(text) : text;

//             fullText += cleaned;

//             setMessages((prev) =>
//               prev.map((m) =>
//                 m.id === streamId ? { ...m, partialText: fullText } : m
//               )
//             );

//             await new Promise((r) => setTimeout(r, 20));
//           }
//         }

//         buffer = "";
//       }

//       if (buffer.length > 0) {
//         fullText += buffer;
//         setMessages((prev) =>
//           prev.map((m) =>
//             m.id === streamId ? { ...m, partialText: fullText } : m
//           )
//         );
//       }

//       setMessages((prev) =>
//         prev.map((m) =>
//           m.id === streamId ? { ...m, stage: "final", text: fullText } : m
//         )
//       );
//     } catch (err) {
//       console.error("Stream Error:", err);
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: ${baseId}-error,
//           sender: "ai",
//           text: "Streaming failed.",
//           isError: true,
//           timestamp: new Date(),
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

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

//     const streamId = ${Date.now()}-directstream;

//     setMessages((prev) => [
//       ...prev,
//       {
//         id: streamId,
//         sender: "ai",
//         stage: "streaming",
//         partialText: "",
//         timestamp: new Date(),
//         queryType: "direct",
//       },
//     ]);

//     try {
//       const res = await fetch(${BACKEND_URL}/api/deepseek-chat/direct/, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: messageText }),
//       });

//       const reader = res.body.getReader();
//       const decoder = new TextDecoder("utf-8");

//       let fullText = "";
//       let buffer = "";

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;

//         const chunk = decoder.decode(value, { stream: true });
//         buffer += chunk;

//         const lines = buffer.split("\n");

//         for (let i = 0; i < lines.length; i++) {
//           const line = lines[i].trim();

//           if (line.startsWith("data:")) {
//             const text = line.replace("data:", "").trim();
//             const cleaned = cleanAndFormat(text);
//             fullText += cleaned;

//             setMessages((prev) =>
//               prev.map((m) =>
//                 m.id === streamId ? { ...m, partialText: fullText } : m
//               )
//             );
//           }
//         }

//         buffer = "";
//       }

//       setMessages((prev) =>
//         prev.map((m) =>
//           m.id === streamId ? { ...m, stage: "final", text: fullText } : m
//         )
//       );
//     } catch (err) {
//       console.error("Direct chat stream error:", err);
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: ${streamId}-error,
//           sender: "ai",
//           text: "Streaming failed.",
//           isError: true,
//           timestamp: new Date(),
//         },
//       ]);
//     }
//   };

//   const callFinhubAndAnalyzeWithOpenRouter = async (messageText) => {
//     const match = messageText.toLowerCase().match(/stock for ([A-Z]{1,5})/i);
//     const symbol = match?.[1]?.toUpperCase();
//     if (!symbol) return "Invalid stock symbol.";

//     try {
//       const quoteRes = await axios.get(
//         https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=04RGF1U9PAJ49VYI
//       );

//       const timeSeries = quoteRes.data["Time Series (Daily)"];
//       if (!timeSeries) throw new Error("Alpha Vantage data invalid");

//       const [latestDate, previousDate] = Object.keys(timeSeries);
//       const today = timeSeries[latestDate];
//       const previous = timeSeries[previousDate];

//       const closeToday = parseFloat(today["4. close"]);
//       const closePrev = parseFloat(previous["4. close"]);

//       const summary = `${symbol} is trading at $${closeToday.toFixed(
//         2
//       )}, change: ${(closeToday - closePrev).toFixed(2)} (${(
//         ((closeToday - closePrev) / closePrev) *
//         100
//       ).toFixed(2)}%).`;

//       const aiRes = await axios.post(${BACKEND_URL}/api/deepseek-chat/, {
//         model: "deepseek-chat",
//         messages: [
//           {
//             role: "system",
//             content: "You are DeepSeek V3, a financial trading assistant.",
//           },
//           {
//             role: "user",
//             content: Stock info for ${symbol}: ${summary}. Analyze this from a trading perspective.,
//           },
//         ],
//         stream: false,
//       });

//       return aiRes.data.message || aiRes.data.content || "No AI response.";
//     } catch (error) {
//       console.error("DeepSeek V3 error:", error);
//       return Error retrieving info for ${symbol}.;
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

//     const streamId = ${Date.now()}-directstream;

//     setMessages((prev) => [
//       ...prev,
//       {
//         id: streamId,
//         sender: "ai",
//         stage: "streaming",
//         partialText: "",
//         timestamp: new Date(),
//         queryType: "direct",
//       },
//     ]);

//     try {
//       const res = await fetch(${BACKEND_URL}/api/deepseek-chat/direct/, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: inputMessage }),
//       });

//       const reader = res.body.getReader();
//       const decoder = new TextDecoder("utf-8");

//       let fullText = "";
//       let buffer = "";

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;

//         const chunk = decoder.decode(value, { stream: true });
//         buffer += chunk;

//         const lines = buffer.split("\n");

//         for (let i = 0; i < lines.length; i++) {
//           const line = lines[i].trim();

//           if (line.startsWith("data:")) {
//             const text = line.replace("data:", "").trim();
//             const cleaned = cleanAndFormat(text);

//             fullText += cleaned;

//             setMessages((prev) =>
//               prev.map((m) =>
//                 m.id === streamId ? { ...m, partialText: fullText } : m
//               )
//             );
//           }
//         }

//         buffer = "";
//       }

//       setMessages((prev) =>
//         prev.map((m) =>
//           m.id === streamId ? { ...m, stage: "final", text: fullText } : m
//         )
//       );
//     } catch (err) {
//       console.error("Stream error:", err);
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: ${streamId}-error,
//           sender: "ai",
//           text: "Streaming failed.",
//           isError: true,
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

//     const streamId = ${Date.now()}-promptstream;

//     setMessages((prev) => [
//       ...prev,
//       {
//         id: streamId,
//         sender: "ai",
//         stage: "streaming",
//         partialText: "",
//         timestamp: new Date(),
//         queryType: "direct",
//       },
//     ]);

//     try {
//       const res = await fetch(${BACKEND_URL}/api/deepseek-chat/direct/, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: prompt }),
//       });

//       const reader = res.body.getReader();
//       const decoder = new TextDecoder("utf-8");

//       let fullText = "";
//       let buffer = "";

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;

//         const chunk = decoder.decode(value, { stream: true });
//         buffer += chunk;

//         const lines = buffer.split("\n");

//         for (let i = 0; i < lines.length; i++) {
//           const line = lines[i].trim();
//           if (line.startsWith("data:")) {
//             const text = line.replace("data:", "").trim();
//             const cleaned = cleanAndFormat(text);

//             fullText += cleaned;

//             setMessages((prev) =>
//               prev.map((m) =>
//                 m.id === streamId ? { ...m, partialText: fullText } : m
//               )
//             );
//           }
//         }

//         buffer = "";
//       }

//       setMessages((prev) =>
//         prev.map((m) =>
//           m.id === streamId ? { ...m, stage: "final", text: fullText } : m
//         )
//       );
//     } catch (err) {
//       console.error("Streaming error:", err);
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: ${streamId}-error,
//           sender: "ai",
//           text: "Streaming failed.",
//           isError: true,
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

//       {/* UPDATE: Conditional rendering for prompts vs default vs messages */}
//       {showPrompts ? (
//         // Show Trading Prompts Interface
//         <div
//           className="flex-1 overflow-y-auto p-6"
//           style={{ backgroundColor: "#1e1e1e" }}
//         >
//           <TradingPromptsInline
//             isVisible={showPrompts}
//             onUsePrompt={handleUsePrompt}
//           />
//         </div>
//       ) : messages.length === 0 ? (
//         // Show Default Prompt Cards
//         <div className="flex-1 p-6 flex items-center justify-center chat-area-part">
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
//         // Show Chat Messages
//         <div className="flex-1 overflow-y-auto p-6 space-y-6 chat-bg">
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
//                 } w-full max-w-4xl`}
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
//                   className={`chat-render p-4 rounded-lg shadow whitespace-pre-wrap break-words w-full ${
//                     msg.sender === "user"
//                       ? "bg-primary-accent bg-primary text-white rounded-tr-none"
//                       : msg.isError
//                       ? "bg-red-900 bg-opacity-30 text-primary-text rounded-tl-none border border-red-400"
//                       : "bg-card-bg text-primary-text rounded-tl-none"
//                   }`}
//                 >
//                   {msg.stage === "progress" ? (
//                     <div className="space-y-1 text-sm text-gray-300">
//                       {msg.steps.map((step, index) => (
//                         <div key={index} className="flex items-center gap-2">
//                           <i
//                             className={`bi ${
//                               step.done
//                                 ? "bi-check-circle-fill text-green-400"
//                                 : "bi-arrow-repeat animate-spin text-yellow-400"
//                             }`}
//                           ></i>
//                           <span>{step.text}</span>
//                         </div>
//                       ))}
//                     </div>
//                   ) : msg.stage === "streaming" ? (
//                     <ReactMarkdown
//                       className="prose prose-invert max-w-none whitespace-pre-wrap break-words leading-relaxed"
//                       linkTarget="_blank"
//                       children={(msg.partialText || "").replace(/\\/g, "")}
//                     />
//                   ) : msg.stage === "final" ? (
//                     <ReactMarkdown className="prose prose-invert max-w-none whitespace-pre-wrap break-words">
//                       {msg.text || ""}
//                     </ReactMarkdown>
//                   ) : (
//                     <p className="whitespace-pre-line break-words">
//                       {msg.text || ""}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}

//           <div ref={messagesEndRef} />
//         </div>
//       )}

//       <div
//         className="p-6 border-t border-gray-700"
//         style={{ backgroundColor: "#1e1e1e" }}
//       >
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
import TradingPromptsInline from "./TradingPromptsInline";

// const BACKEND_URL = " http://127.0.0.1:8000";
const BACKEND_URL = "https://backendoftradegpt-production.up.railway.app";

// ADD: Update props to include prompts functionality
const ChatArea = ({
  toggleWatchlist,
  watchlistMessage,
  showPrompts,
  onClosePrompts,
  activeSection,
}) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const [chatSessions, setChatSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const token = new URLSearchParams(window.location.search).get("token");

  // ... (all your existing functions remain the same: cleanAndFormat, scrollToBottom, etc.)
  const FINNHUB_API_KEY = "d08gifhr01qh1ecc2v7gd08gifhr01qh1ecc2v80";

  // function cleanAndFormat(text) {
  //   return text
  //     .replace(/^markdown[#>]\s/i, "")
  //     .replace(/(?<!\n)(#+\s*)([A-Za-z])/g, "\n\n$1$2")
  //     .replace(/#{3,6}\s*#?\s*/g, "\n\n### ")
  //     .replace(/\\(.?)\\*/g, "$1")
  //     .replace(/\(.?)\*/g, "$1")
  //     .replace(/{1,3}(.*?){1,3}/g, "$1")
  //     .replace(/\|.*?\|/g, "")
  //     .replace(/-{3,}/g, "\n\n---\n\n")
  //     .replace(/([A-Za-z])(:)(?=\S)/g, "$1: ")
  //     .replace(/###\s*#\s*/g, "### ")
  //     .replace(/KeyFinancialMetrics\s*\(TTM\)/gi, "### Key Financial Metrics")
  //     .replace(/TradeSetupbyvalourGPT/gi, "Trade Setup by ValourGPT")
  //     .replace(/Buy&SellReasons/gi, "Buy & Sell Reasons")
  //     .replace(/UniqueValueProposition/gi, "Unique Value Proposition")
  //     .replace(/AnalystInsights/gi, "Analyst Insights")
  //     .replace(/UpcomingEvents/gi, "Upcoming Events")
  //     .replace(/TechnicalIndicators/gi, "Technical Indicators")
  //     .replace(/Competitors/gi, "Competitors")
  //     .replace(/Note\s*:/gi, "\n\n*Note:* ")
  //     .replace(/ValuationNote\s*:/gi, "\n\n*Valuation Note:* ")
  //     .replace(/VisualAid\s*:/gi, "\n\n*Visual Aid:* ")
  //     .replace(/\n{2,}/g, "\n\n")
  //     .replace(/\s{2,}/g, " ")
  //     .trim();
  // }

  function cleanAndFormat(text) {
    return (
      text
        // Fix glued words: AppleInc → Apple Inc
        .replace(/([a-z])([A-Z])/g, "$1 $2")

        // Remove headings from lines like "### 1. Tesla (TSLA)" → just plain line
        .replace(/#{2,6}\s*(\d+\.\s?[A-Z][^\n]+)/g, "\n\n$1")

        // Keep Option 1/2/3 with proper heading
        .replace(/Option\s*(\d+)\s*:/gi, "\n\n### Option $1")

        // Normalize leftover ###
        .replace(/#{3,6}\s*/g, "\n\n### ")

        // Remove *bold* and italic completely
        .replace(/\\(.?)\\*/g, "$1")
        .replace(/\(.?)\*/g, "$1")
        .replace(/{1,3}(.*?){1,3}/g, "$1")

        // Key: Value → bullet format
        .replace(/([A-Za-z0-9\(\)\/%$\- ]+):\s*([^\n]+)/g, "- *$1:* $2")

        // Fix glued colon
        .replace(/([a-zA-Z])(:)([^\s])/g, "$1: $3")

        // Remove tables, separators
        .replace(/\|.*?\|/g, "")
        .replace(/-{3,}/g, "\n\n---\n\n")

        // Cleanup spacing
        .replace(/\n{3,}/g, "\n\n")
        .replace(/\s{2,}/g, " ")

        .trim()
    );
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

  // ADD: Handle using prompts from TradingPromptsInline
  const handleUsePrompt = (promptText) => {
    setInputMessage(promptText);
    if (onClosePrompts) {
      onClosePrompts(); // Close prompts and go back to chat
    }
    // Automatically send the message
    setTimeout(() => {
      const event = { preventDefault: () => {} };
      handleSendMessage(event);
    }, 100);
  };

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

    for (let i = 0; i < 3; i++) {
      await new Promise((r) => setTimeout(r, 1200));
      updateStep(i);
    }

    updateStep(3);

    const streamId = `${baseId}-stream`;

    setMessages((prev) => [
      ...prev,
      {
        id: streamId,
        sender: "ai",
        stage: "streaming",
        partialText: "",
        timestamp: new Date(),
        queryType: msg.queryType || "default",
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

            await new Promise((r) => setTimeout(r, 20));
          }
        }

        buffer = "";
      }

      if (buffer.length > 0) {
        fullText += buffer;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamId ? { ...m, partialText: fullText } : m
          )
        );
      }

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

        buffer = "";
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
      return Error`retrieving info for ${symbol}.`;
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
    const currentMessage = inputMessage;
    setInputMessage("");
    setIsLoading(true);

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
      console.log(
        "Sending request to:",
        `${BACKEND_URL}/api/deepseek-chat/direct/`
      );
      console.log("Request body:", { message: currentMessage });

      const res = await fetch(`${BACKEND_URL}/api/deepseek-chat/direct/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ message: currentMessage }),
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      // Handle JSON response instead of streaming
      const data = await res.json();
      console.log("Response data:", data);

      if (data.error) {
        throw new Error(data.error);
      }

      // Simulate streaming effect with sentences
      if (data.sentences && Array.isArray(data.sentences)) {
        let fullText = "";
        for (let i = 0; i < data.sentences.length; i++) {
          fullText += data.sentences[i] + " ";

          setMessages((prev) =>
            prev.map((m) =>
              m.id === streamId ? { ...m, partialText: fullText.trim() } : m
            )
          );

          // Add delay for streaming effect
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamId
              ? { ...m, stage: "final", text: fullText.trim() }
              : m
          )
        );
      } else {
        // Fallback for direct text response
        const text = data.message || data.response || "No response received";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamId ? { ...m, stage: "final", text: text } : m
          )
        );
      }
    } catch (err) {
      console.error("Request error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `${streamId}-error`,
          sender: "ai",
          text: `Error: ${err.message}. Check console for details.`,
          isError: true,
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

    const streamId = `${Date.now()}-promptstream`;

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

  // Define markdown components for styling
  const markdownComponents = {
    p: ({ children }) => (
      <p className="prose prose-invert max-w-none whitespace-pre-wrap break-words leading-relaxed">
        {children}
      </p>
    ),
    h1: ({ children }) => (
      <h1 className="prose prose-invert max-w-none whitespace-pre-wrap break-words leading-relaxed">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="prose prose-invert max-w-none whitespace-pre-wrap break-words leading-relaxed">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="prose prose-invert max-w-none whitespace-pre-wrap break-words leading-relaxed">
        {children}
      </h3>
    ),
    ul: ({ children }) => (
      <ul className="prose prose-invert max-w-none whitespace-pre-wrap break-words leading-relaxed">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="prose prose-invert max-w-none whitespace-pre-wrap break-words leading-relaxed">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="prose prose-invert max-w-none whitespace-pre-wrap break-words leading-relaxed">
        {children}
      </li>
    ),
    code: ({ children }) => (
      <code className="prose prose-invert max-w-none whitespace-pre-wrap break-words leading-relaxed">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="prose prose-invert max-w-none whitespace-pre-wrap break-words leading-relaxed">
        {children}
      </pre>
    ),
    a: ({ children, href }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="prose prose-invert max-w-none whitespace-pre-wrap break-words leading-relaxed"
      >
        {children}
      </a>
    ),
  };

  const finalMarkdownComponents = {
    p: ({ children }) => (
      <p className="prose prose-invert max-w-none whitespace-pre-wrap break-words">
        {children}
      </p>
    ),
    h1: ({ children }) => (
      <h1 className="prose prose-invert max-w-none whitespace-pre-wrap break-words">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="prose prose-invert max-w-none whitespace-pre-wrap break-words">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="prose prose-invert max-w-none whitespace-pre-wrap break-words">
        {children}
      </h3>
    ),
    ul: ({ children }) => (
      <ul className="prose prose-invert max-w-none whitespace-pre-wrap break-words">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="prose prose-invert max-w-none whitespace-pre-wrap break-words">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="prose prose-invert max-w-none whitespace-pre-wrap break-words">
        {children}
      </li>
    ),
    code: ({ children }) => (
      <code className="prose prose-invert max-w-none whitespace-pre-wrap break-words">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="prose prose-invert max-w-none whitespace-pre-wrap break-words">
        {children}
      </pre>
    ),
    a: ({ children, href }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="prose prose-invert max-w-none whitespace-pre-wrap break-words"
      >
        {children}
      </a>
    ),
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

      {/* UPDATE: Conditional rendering for prompts vs default vs messages */}
      {showPrompts ? (
        // Show Trading Prompts Interface
        <div
          className="flex-1 overflow-y-auto p-6"
          style={{ backgroundColor: "#1e1e1e" }}
        >
          <TradingPromptsInline
            isVisible={showPrompts}
            onUsePrompt={handleUsePrompt}
          />
        </div>
      ) : messages.length === 0 ? (
        // Show Default Prompt Cards
        <div className="flex-1 p-6 flex items-center justify-center chat-area-part">
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
        // Show Chat Messages
        <div className="flex-1 overflow-y-auto p-6 space-y-6 chat-bg">
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
                  className={`chat-render p-4 rounded-lg shadow whitespace-pre-wrap break-words w-full ${
                    msg.sender === "user"
                      ? "bg-primary-accent bg-primary text-white rounded-tr-none"
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
                      components={markdownComponents}
                      children={(msg.partialText || "").replace(/\\/g, "")}
                    />
                  ) : msg.stage === "final" ? (
                    <ReactMarkdown components={finalMarkdownComponents}>
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

      <div
        className="p-6 border-t border-gray-700"
        style={{ backgroundColor: "#1e1e1e" }}
      >
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
