// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import PromptCard from './PromptCard';

// const ChatArea = ({ toggleWatchlist, watchlistMessage }) => {
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [apiError, setApiError] = useState(null);
//   const messagesEndRef = useRef(null);

//   // OpenRouter API key - use just one consistent key
//   const OPENROUTER_API_KEY = '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';

//   const promptCards = [
//     { id: 1, title: 'Top 3 Call option contracts related to EV', subtitle: 'with the highest likelihood of profit', icon: 'ev' },
//     { id: 2, title: 'Top 3 Call option contracts', subtitle: 'in the AI hardware sector', icon: 'ai' },
//     { id: 3, title: 'Get me the top 3 option contracts for NVDA', subtitle: 'that can yield quick profits today', icon: 'nvda' },
//     { id: 4, title: 'Provide shorting entry and exit for QQQ', subtitle: "based on today's technical analysis", icon: 'qqq' },
//   ];

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Handle incoming watchlist messages
//   useEffect(() => {
//     if (watchlistMessage) {
//       handleSendWatchlistMessage(watchlistMessage);
//     }
//   }, [watchlistMessage]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleInputChange = (e) => {
//     setInputMessage(e.target.value);
//   };

//   // Function to make OpenRouter API call with improved error handling
//   const callOpenRouterAPI = async (messageText) => {
//     // Clear any previous errors
//     setApiError(null);

//     try {
//       console.log('Making OpenRouter API call with message:', messageText);

//       const response = await axios.post(
//         'https://openrouter.ai/api/v1/chat/completions',
//         {
//           model: 'openai/gpt-3.5-turbo', // Using a more widely available model
//           messages: [
//             {
//               role: 'user',
//               content: messageText
//             }
//           ]
//         },
//         {
//           headers: {
//             'Authorization': `Bearer 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`,
//             'Content-Type': 'application/json',
//             'HTTP-Referer': window.location.href // Required by OpenRouter
//           }
//         }
//       );

//       console.log('API response received:', response);

//       if (response && response.data && Array.isArray(response.data.choices) && response.data.choices.length > 0) {
//         return response.data.choices[0].message.content;
//       } else {
//         console.error('Invalid response structure:', response.data);
//         setApiError('Received an invalid response structure from the API');
//         return 'Error: No valid response from API.';
//       }
//     } catch (error) {
//       console.error('Error calling OpenRouter API:', error);

//       // Enhanced error logging and user feedback
//       if (error.response) {
//         // The request was made and the server responded with an error status
//         console.error('Error response:', error.response.data);
//         setApiError(`API Error (${error.response.status}): ${error.response.data.error?.message || 'Unknown error'}`);
//       } else if (error.request) {
//         // The request was made but no response received
//         setApiError('No response received from the API server. Please check your internet connection.');
//       } else {
//         // Something happened in setting up the request
//         setApiError(`Error setting up the request: ${error.message}`);
//       }

//       throw error;
//     }
//   };

//   // Function to handle messages from the watchlist
//   const handleSendWatchlistMessage = async (messageText) => {
//     const userMessage = {
//       id: messages.length + 1,
//       text: messageText,
//       sender: 'user',
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setIsLoading(true);

//     try {
//       // Call OpenRouter API
//       const aiResponseText = await callOpenRouterAPI(messageText);

//       const aiResponse = {
//         id: messages.length + 2,
//         text: aiResponseText,
//         sender: 'ai',
//         timestamp: new Date(),
//       };

//       setMessages((prev) => [...prev, aiResponse]);
//     } catch (error) {
//       console.error('Error fetching AI response:', error);
//       // Fallback AI response in case of error
//       const aiErrorResponse = {
//         id: messages.length + 2,
//         text: `I'm sorry, I couldn't process your request about "${messageText}" at the moment. ${apiError ? `Error: ${apiError}` : 'Please try again later.'}`,
//         sender: 'ai',
//         timestamp: new Date(),
//         isError: true,
//       };
//       setMessages((prev) => [...prev, aiErrorResponse]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (inputMessage.trim() === '') return;

//     const userMessage = {
//       id: messages.length + 1,
//       text: inputMessage,
//       sender: 'user',
//       timestamp: new Date(),
//     };

//     // Adding the message to the current state
//     setMessages([...messages, userMessage]);
//     setInputMessage('');
//     setIsLoading(true);

//     try {
//       // Call OpenRouter API
//       const aiResponseText = await callOpenRouterAPI(inputMessage);

//       const aiResponse = {
//         id: messages.length + 2,
//         text: aiResponseText,
//         sender: 'ai',
//         timestamp: new Date(),
//       };

//       setMessages((prev) => [...prev, aiResponse]);
//     } catch (error) {
//       console.error('Error fetching AI response:', error);
//       // Fallback AI response in case of error
//       const aiErrorResponse = {
//         id: messages.length + 2,
//         text: `Sorry, I encountered an issue while processing your request. ${apiError ? `Error: ${apiError}` : 'Please try again later.'}`,
//         sender: 'ai',
//         timestamp: new Date(),
//         isError: true,
//       };
//       setMessages((prev) => [...prev, aiErrorResponse]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePromptCardClick = async (promptText) => {
//     const userMessage = {
//       id: messages.length + 1,
//       text: promptText,
//       sender: 'user',
//       timestamp: new Date(),
//     };
//     setMessages([...messages, userMessage]);
//     setIsLoading(true);

//     try {
//       // Call OpenRouter API
//       const aiResponseText = await callOpenRouterAPI(promptText);

//       const aiResponse = {
//         id: messages.length + 2,
//         text: aiResponseText,
//         sender: 'ai',
//         timestamp: new Date(),
//       };

//       setMessages((prev) => [...prev, aiResponse]);
//     } catch (error) {
//       console.error('Error fetching AI response:', error);
//       // Fallback AI response in case of error
//       const aiErrorResponse = {
//         id: messages.length + 2,
//         text: `Sorry, I encountered an issue while processing your request. ${apiError ? `Error: ${apiError}` : 'Please try again later.'}`,
//         sender: 'ai',
//         timestamp: new Date(),
//         isError: true,
//       };
//       setMessages((prev) => [...prev, aiErrorResponse]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-[#161921] pt-[0px]">
//       <div className="flex items-center justify-between p-6 border-b border-gray-700">
//         <h1 className="text-2xl font-bold text-primary-text chat-help">How can I help you today?</h1>
//         <div className="flex space-x-2">
//         </div>
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
//           {messages.map((message) => (
//             <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
//               <div className={`flex ${message.sender === 'user' ? 'flex-row-reverse' : ''} max-w-3xl`}>
//                 <div
//                   className={`rounded-full w-10 h-10 flex items-center justify-center ${
//                     message.sender === 'user'
//                       ? 'bg-hover-bg text-primary-accent ml-3'
//                       : 'bg-hover-bg text-blue-400 mr-3'
//                   }`}
//                 >
//                   {message.sender === 'user' ? (
//                     <i className="bi bi-person-circle text-xl"></i>
//                   ) : (
//                     <i className="bi bi-robot text-xl"></i>
//                   )}
//                 </div>
//                 <div
//                   className={`p-4 rounded-lg shadow ${
//                     message.sender === 'user'
//                       ? 'bg-primary-accent text-white rounded-tr-none'
//                       : message.isError
//                         ? 'bg-red-900 bg-opacity-30 text-primary-text rounded-tl-none border border-red-400'
//                         : 'bg-card-bg text-primary-text rounded-tl-none'
//                   }`}
//                 >
//                   <p className="whitespace-pre-line">{message.text}</p>
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
//         <p className="text-center text-xs text-secondary-text mt-2">TradeGPT is for informational purposes only. Always do your own research.</p>
//       </div>
//     </div>
//   );
// };

// export default ChatArea;

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import PromptCard from "./PromptCard";

const ChatArea = ({ toggleWatchlist, watchlistMessage }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const messagesEndRef = useRef(null);

  const OPENROUTER_API_KEY =
    "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";
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

  const handleSendWatchlistMessage = async (msg) => {
    const userMsg = {
      id: messages.length + 1,
      text: msg,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const isStockQuery = msg.toLowerCase().startsWith("stock for ");
      const aiText = isStockQuery
        ? await callFinhubAndAnalyzeWithOpenRouter(msg)
        : await callOpenRouterAPI(msg);

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

  useEffect(() => {
    if (watchlistMessage) {
      handleSendWatchlistMessage(watchlistMessage);
    }
  }, [watchlistMessage, handleSendWatchlistMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const callOpenRouterAPI = async (messageText) => {
    setApiError(null);
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "deepseek/deepseek-chat:free",
          messages: [{ role: "user", content: messageText }],
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": window.location.origin,
            "X-Title": "TradeGPT Chat",
          },
        }
      );
      return response.data.choices?.[0]?.message?.content || "No response.";
    } catch (error) {
      console.error("OpenRouter error:", error);
      setApiError("Failed to fetch AI response.");
      return "Sorry, something went wrong.";
    }
  };

  const callFinhubAndAnalyzeWithOpenRouter = async (messageText) => {
    const match = messageText.toLowerCase().match(/stock for ([A-Z]{1,5})/i);
    const symbol = match?.[1]?.toUpperCase();
    if (!symbol) return "Invalid stock symbol.";

    try {
      const stockRes = await axios.get(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
      );
      const data = stockRes.data;
      const summary = `${symbol} is trading at $${data.c}, change: ${data.d} (${data.dp}%).`;

      const aiRes = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "deepseek/deepseek-chat:free",
          messages: [
            {
              role: "user",
              content: `Stock info for ${symbol}: ${summary}. What does this mean for traders?`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": window.location.origin,
            "X-Title": "Stock Analysis Chat",
          },
        }
      );
      return aiRes.data.choices?.[0]?.message?.content || "AI gave no answer.";
    } catch (error) {
      console.error("Finnhub or OpenRouter error:", error);
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
    setMessages([...messages, userMsg]);
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
    const userMsg = {
      id: messages.length + 1,
      text: prompt,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages([...messages, userMsg]);
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
                  <p className="whitespace-pre-line">{msg.text}</p>
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
