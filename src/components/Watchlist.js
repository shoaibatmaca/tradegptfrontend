// import axios from "axios";
// import { useState } from "react";

// const StockWatchlist = ({ sendMessageToChat }) => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentStock, setCurrentStock] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [expandedTicker, setExpandedTicker] = useState(null);
//   const [watchlist, setWatchlist] = useState([]);
//   const [newsItems, setNewsItems] = useState([]);
//   const [isLoadingNews, setIsLoadingNews] = useState(false);

//   // Finnhub API key
//   const FINNHUB_API_KEY = "d08gifhr01qh1ecc2v7gd08gifhr01qh1ecc2v80";

//   // Function to get stock quote from Finnhub
//   const getStockQuote = async (symbol) => {
//     try {
//       const response = await axios.get(
//         `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
//       );

//       if (response.status !== 200) {
//         throw new Error(`API error: ${response.status}`);
//       }

//       const data = response.data;

//       // Check if we got valid data
//       if (data && data.c > 0) {
//         // Format the response
//         return {
//           symbol: symbol,
//           price: data.c.toFixed(2), // Current price
//           open: data.o.toFixed(4), // Open price of the day
//           high: data.h.toFixed(4), // High price of the day
//           low: data.l.toFixed(4), // Low price of the day
//           previousClose: data.pc.toFixed(4), // Previous close price
//           change: (data.c - data.pc).toFixed(2), // Change
//           changePercent: (((data.c - data.pc) / data.pc) * 100).toFixed(2), // Change percent
//           volume: Math.round(data.v).toLocaleString(), // Volume
//           sparkline: data.c >= data.pc ? "up" : "down", // Trend direction
//         };
//       }

//       return null;
//     } catch (error) {
//       console.error(`Error fetching quote for ${symbol}:`, error);
//       throw error;
//     }
//   };

//   // Function to get company news from Finnhub
//   const getCompanyNews = async (symbol) => {
//     try {
//       // Calculate date range for news (last 7 days)
//       const today = new Date();
//       const fromDate = new Date();
//       fromDate.setDate(today.getDate() - 7);

//       // Format dates as YYYY-MM-DD
//       const toDateStr = today.toISOString().split("T")[0];
//       const fromDateStr = fromDate.toISOString().split("T")[0];

//       const response = await axios.get(
//         `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${fromDateStr}&to=${toDateStr}&token=${FINNHUB_API_KEY}`
//       );

//       if (response.status !== 200) {
//         throw new Error(`API error: ${response.status}`);
//       }

//       // Take top 3 news items and format them
//       return response.data.slice(0, 3).map((item) => ({
//         id: item.id,
//         headline: item.headline,
//         summary: item.summary,
//         source: item.source,
//         url: item.url,
//         datetime: new Date(item.datetime * 1000),
//         category: item.category || "Investing",
//       }));
//     } catch (error) {
//       console.error(`Error fetching news for ${symbol}:`, error);
//       return [];
//     }
//   };

//   // Get company name for the stock
//   const getCompanyName = (symbol) => {
//     const companies = {
//       AAPL: "Apple Inc",
//       MSFT: "Microsoft Corporation",
//       GOOGL: "Alphabet Inc",
//       AMZN: "Amazon.com Inc",
//       TSLA: "Tesla Inc",
//       META: "Meta Platforms Inc",
//       NVDA: "NVIDIA Corporation",
//       NFLX: "Netflix Inc",
//       JPM: "JPMorgan Chase & Co",
//       INTC: "Intel Corporation",
//       UNH: "United Health Group ",
//     };

//     if (companies[symbol]) {
//       return companies[symbol];
//     }

//     // If not found in our map, return a shortened version
//     return symbol + " Corporation";
//   };

//   // Handle search
//   const handleSearch = async () => {
//     if (!searchQuery.trim()) return;

//     const symbol = searchQuery.trim().toUpperCase();
//     setIsLoading(true);
//     setError("");
//     setIsLoadingNews(true);

//     try {
//       const stockData = await getStockQuote(symbol);

//       if (stockData) {
//         // Add company name
//         stockData.name = getCompanyName(symbol);

//         // Set as current stock
//         setCurrentStock(stockData);

//         // Check if it's already in watchlist
//         const existingIndex = watchlist.findIndex(
//           (item) => item.symbol === symbol
//         );
//         if (existingIndex === -1) {
//           // Add to watchlist if not already there
//           setWatchlist((prev) => [...prev, stockData]);
//         } else {
//           // Update existing entry
//           setWatchlist((prev) => {
//             const newList = [...prev];
//             newList[existingIndex] = stockData;
//             return newList;
//           });
//         }

//         // Expand the ticker
//         setExpandedTicker(symbol);

//         // Fetch news for this ticker
//         const news = await getCompanyNews(symbol);
//         setNewsItems(news);
//       } else {
//         setError(`No data found for ${symbol}`);
//       }
//     } catch (error) {
//       setError(`Error fetching data for ${symbol}`);
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//       setIsLoadingNews(false);
//     }
//   };

//   // Handle key press in search box
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleSearch();
//     }
//   };

//   // Toggle expanded ticker
//   const toggleExpandTicker = async (symbol) => {
//     if (expandedTicker === symbol) {
//       setExpandedTicker(null);
//     } else {
//       setExpandedTicker(symbol);
//       setIsLoadingNews(true);

//       // Fetch news when expanding a ticker
//       try {
//         const news = await getCompanyNews(symbol);
//         setNewsItems(news);
//       } catch (error) {
//         console.error(`Error fetching news for ${symbol}:`, error);
//       } finally {
//         setIsLoadingNews(false);
//       }
//     }
//   };

//   // Remove ticker from watchlist
//   const removeFromWatchlist = (symbol) => {
//     setWatchlist((prev) => prev.filter((item) => item.symbol !== symbol));
//     if (expandedTicker === symbol) {
//       setExpandedTicker(null);
//       setNewsItems([]);
//     }
//   };

//   // Format date for news items
//   const formatNewsDate = (date) => {
//     const today = new Date();
//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);

//     // Compare year, month, and day
//     const isToday =
//       date.getDate() === today.getDate() &&
//       date.getMonth() === today.getMonth() &&
//       date.getFullYear() === today.getFullYear();

//     const isYesterday =
//       date.getDate() === yesterday.getDate() &&
//       date.getMonth() === yesterday.getMonth() &&
//       date.getFullYear() === yesterday.getFullYear();

//     if (isToday) {
//       return `Today on ${date.getHours()}:${date
//         .getMinutes()
//         .toString()
//         .padStart(2, "0")}`;
//     } else if (isYesterday) {
//       return `Yesterday on ${date.getHours()}:${date
//         .getMinutes()
//         .toString()
//         .padStart(2, "0")}`;
//     } else {
//       // Format as "May 5, 2025 on 17:46"
//       const months = [
//         "Jan",
//         "Feb",
//         "Mar",
//         "Apr",
//         "May",
//         "Jun",
//         "Jul",
//         "Aug",
//         "Sep",
//         "Oct",
//         "Nov",
//         "Dec",
//       ];
//       return `${
//         months[date.getMonth()]
//       } ${date.getDate()}, ${date.getFullYear()} on ${date.getHours()}:${date
//         .getMinutes()
//         .toString()
//         .padStart(2, "0")}`;
//     }
//   };

//   // Handle button clicks in watchlist and send a message to chat
//   const handleWatchlistButtonClick = (buttonType, symbol) => {
//     let message = "";

//     switch (buttonType) {
//       case "priceChart":
//         message = `Show me the price chart for ${symbol}`;
//         break;
//       case "recentNews":
//         message = `What's the recent news on ${symbol}?`;
//         break;
//       case "tradeIdeas":
//         message = `Give me some trade ideas for ${symbol}`;
//         break;
//       case "analysis":
//         message = `Provide technical analysis for ${symbol}`;
//         break;
//       default:
//         message = `Information about ${symbol}`;
//     }

//     console.log(`Sending message to chat: ${message}`);
//     // Send message to chat component via prop
//     sendMessageToChat(message);
//   };

//   // Open URL in a new tab
//   const openNewsUrl = (url) => {
//     window.open(url, "_blank");
//   };

//   return (
//     <div className="watchlist flex-shrink-0 bg-[#161b25] border-l border-[#3a3a4c] text-white">
//       <div className="p-4">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-2">
//             <span className="text-lg font-bold">Watchlist</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <svg
//               viewBox="0 0 24 24"
//               width="20"
//               height="20"
//               className="text-gray-400 cursor-pointer"
//             >
//               <path
//                 fill="currentColor"
//                 d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
//               ></path>
//             </svg>
//           </div>
//         </div>

//         <div className="relative mb-2">
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             onKeyDown={handleKeyPress}
//             placeholder="Search tickers (e.g., AAPL, MSFT)"
//             className="w-full pl-4 pr-8 py-2 bg-[#2a2a3c] border-[#3a3a4c] rounded-full text-white"
//           />
//           <div
//             onClick={handleSearch}
//             className="absolute right-2 top-2 text-gray-400 cursor-pointer"
//           >
//             <svg viewBox="0 0 24 24" width="20" height="20">
//               <path
//                 fill="currentColor"
//                 d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
//               ></path>
//             </svg>
//           </div>
//         </div>

//         {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

//         {watchlist.length > 0 && expandedTicker && (
//           <div className="text-right mb-2">
//             <button
//               className="text-blue-400 text-sm"
//               onClick={() => setExpandedTicker(null)}
//             >
//               Back to watchlist
//             </button>
//           </div>
//         )}

//         <div className="grid grid-cols-3 py-2 border-b border-[#3a3a4c] text-sm text-gray-400">
//           <div>Symbol</div>
//           <div className="text-center">Trend</div>
//           <div className="text-right">Price</div>
//         </div>

//         {isLoading ? (
//           <div className="py-3 flex justify-center items-center">
//             <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
//           </div>
//         ) : watchlist.length > 0 ? (
//           watchlist.map((ticker) => (
//             <div key={ticker.symbol} className="border-b border-[#3a3a4c]">
//               <div
//                 className="py-3 cursor-pointer ticker-chart"
//                 onClick={() => toggleExpandTicker(ticker.symbol)}
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <button
//                       className="h-6 w-6 rounded-full bg-[#2a2a3c] flex items-center justify-center"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         removeFromWatchlist(ticker.symbol);
//                       }}
//                     >
//                       <svg viewBox="0 0 24 24" width="16" height="16">
//                         <path
//                           fill="currentColor"
//                           d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
//                         ></path>
//                       </svg>
//                     </button>
//                     <div>
//                       <div className="font-bold">{ticker.symbol}</div>
//                       <div className="text-xs text-gray-400 truncate max-w-[80px]">
//                         {ticker.name}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex-1 px-2">
//                     {ticker.sparkline === "up" ? (
//                       <svg viewBox="0 0 100 30" className="h-8 w-full">
//                         <path
//                           d="M0,15 Q10,10 20,12 T40,8 T60,12 T80,10 T100,5"
//                           fill="none"
//                           stroke="#4ade80"
//                           strokeWidth="2"
//                         />
//                         <path
//                           d="M0,15 Q10,10 20,12 T40,8 T60,12 T80,10 T100,5 V30 H0 Z"
//                           fill="rgba(74, 222, 128, 0.1)"
//                         />
//                       </svg>
//                     ) : (
//                       <svg viewBox="0 0 100 30" className="h-8 w-full">
//                         <path
//                           d="M0,5 Q10,10 20,15 T40,20 T60,18 T80,25 T100,20"
//                           fill="none"
//                           stroke="#ef4444"
//                           strokeWidth="2"
//                         />
//                         <path
//                           d="M0,5 Q10,10 20,15 T40,20 T60,18 T80,25 T100,20 V30 H0 Z"
//                           fill="rgba(239, 68, 68, 0.1)"
//                         />
//                       </svg>
//                     )}
//                   </div>

//                   <div className="text-right">
//                     <div className="font-bold">${ticker.price}</div>
//                     <div
//                       className={`text-xs ${
//                         parseFloat(ticker.changePercent) >= 0
//                           ? "text-green-500"
//                           : "text-red-500"
//                       }`}
//                     >
//                       {parseFloat(ticker.changePercent) >= 0 ? "+" : ""}
//                       {ticker.changePercent}%
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {expandedTicker === ticker.symbol && (
//                 <div className="pb-3">
//                   <div className="bg-[#2a2a3c] rounded-md p-2 mb-2 text-xs price-box">
//                     <div className="grid grid-cols-2 gap-1">
//                       <div className="text-gray-400">Open:</div>
//                       <div className="text-right">${ticker.open}</div>
//                       <div className="text-gray-400">High:</div>
//                       <div className="text-right">${ticker.high}</div>
//                       <div className="text-gray-400">Low:</div>
//                       <div className="text-right">${ticker.low}</div>
//                       <div className="text-gray-400">Volume:</div>
//                       <div className="text-right">{ticker.volume}</div>
//                       <div className="text-gray-400">Prev Close:</div>
//                       <div className="text-right">${ticker.previousClose}</div>
//                     </div>
//                     {/* <div className="mt-2 text-center">
//                       <a
//                         href={`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker.symbol}&apikey=demo&datatype=csv`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-400 flex items-center justify-center gap-1"
//                       >
//                         View Historical Data
//                         <svg viewBox="0 0 24 24" width="12" height="12">
//                           <path fill="currentColor" d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path>
//                         </svg>
//                       </a>
//                     </div> */}
//                   </div>

//                   {/* News Section */}
//                   <div className="bg-[#2a2a3c] rounded-md p-3 mb-3">
//                     <div className="flex items-center gap-2 mb-3">
//                       <svg
//                         viewBox="0 0 24 24"
//                         width="16"
//                         height="16"
//                         className="text-blue-400"
//                       >
//                         <path
//                           fill="currentColor"
//                           d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z"
//                         ></path>
//                       </svg>
//                       <span className="text-blue-400 font-medium text-sm">
//                         Today's News Highlight
//                       </span>
//                     </div>

//                     {isLoadingNews ? (
//                       <div className="py-3 flex justify-center items-center">
//                         <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
//                       </div>
//                     ) : newsItems.length > 0 ? (
//                       <>
//                         <h3 className="text-white text-sm font-medium mb-3">
//                           {newsItems[0]?.headline ||
//                             `${ticker.name} Latest News`}
//                         </h3>

//                         <div className="divide-y divide-[#3a3a4c]">
//                           {newsItems.map((newsItem, index) => (
//                             <div
//                               key={newsItem.id || index}
//                               className="py-2 cursor-pointer"
//                               onClick={() => openNewsUrl(newsItem.url)}
//                             >
//                               <div className="flex gap-2 mb-1">
//                                 <div className="w-8 h-8 bg-[#3a3a4c] rounded-full flex items-center justify-center flex-shrink-0">
//                                   <svg
//                                     viewBox="0 0 24 24"
//                                     width="16"
//                                     height="16"
//                                     className="text-gray-300"
//                                   >
//                                     <path
//                                       fill="currentColor"
//                                       d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
//                                     ></path>
//                                   </svg>
//                                 </div>
//                                 <div>
//                                   <h4 className="text-white text-xs font-medium">
//                                     {newsItem.headline}
//                                   </h4>
//                                   <div className="text-gray-400 text-xs mt-1">
//                                     {formatNewsDate(newsItem.datetime)}
//                                   </div>
//                                   <div className="text-gray-400 text-xs mt-1">
//                                     ↗ {newsItem.category || "Investing"}
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>

//                         <div className="mt-3 text-center">
//                           <a
//                             href={`https://www.marketwatch.com/investing/stock/${ticker.symbol}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-400 text-xs flex items-center justify-center gap-1"
//                           >
//                             View All News
//                             <svg viewBox="0 0 24 24" width="12" height="12">
//                               <path
//                                 fill="currentColor"
//                                 d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"
//                               ></path>
//                             </svg>
//                           </a>
//                         </div>
//                       </>
//                     ) : (
//                       <div className="text-gray-400 text-xs text-center py-2">
//                         No recent news available for {ticker.symbol}
//                       </div>
//                     )}

//                     <div className="mt-3 border-t border-[#3a3a4c] pt-2 flex justify-between">
//                       <div className="text-gray-400 text-xs">
//                         Was this news helpful?
//                       </div>
//                       <div className="flex gap-2">
//                         <button className="text-gray-400 hover:text-blue-400">
//                           <svg viewBox="0 0 24 24" width="16" height="16">
//                             <path
//                               fill="currentColor"
//                               d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"
//                             ></path>
//                           </svg>
//                         </button>
//                         <button className="text-gray-400 hover:text-red-400">
//                           <svg viewBox="0 0 24 24" width="16" height="16">
//                             <path
//                               fill="currentColor"
//                               d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"
//                             ></path>
//                           </svg>
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-2 watchlist-btns">
//                     <button
//                       className="text-xs bg-[#2a2a3c] border-[#3a3a4c] hover:bg-[#3a3a4c] p-2 rounded"
//                       onClick={() =>
//                         handleWatchlistButtonClick("priceChart", ticker.symbol)
//                       }
//                     >
//                       Price Chart
//                     </button>
//                     <button
//                       className="text-xs bg-[#2a2a3c] border-[#3a3a4c] hover:bg-[#3a3a4c] p-2 rounded"
//                       onClick={() =>
//                         handleWatchlistButtonClick("recentNews", ticker.symbol)
//                       }
//                     >
//                       Recent News
//                     </button>
//                     <button
//                       className="text-xs bg-[#2a2a3c] border-[#3a3a4c] hover:bg-[#3a3a4c] p-2 rounded"
//                       onClick={() =>
//                         handleWatchlistButtonClick("tradeIdeas", ticker.symbol)
//                       }
//                     >
//                       Trade Ideas
//                     </button>
//                     <button
//                       className="text-xs bg-[#2a2a3c] border-[#3a3a4c] hover:bg-[#3a3a4c] p-2 rounded"
//                       onClick={() =>
//                         handleWatchlistButtonClick("analysis", ticker.symbol)
//                       }
//                     >
//                       Analysis
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))
//         ) : (
//           <div className="py-8 text-center text-gray-400 flex flex-col items-center">
//             <svg
//               viewBox="0 0 24 24"
//               width="40"
//               height="40"
//               className="text-gray-500 mb-4"
//             >
//               <path fill="currentColor" d="M3 3h18v18H3V3zm16 16V5H5v14h14z" />
//               <path fill="currentColor" d="M15 11l-3-3-6 6h12l-3-3z" />
//               <circle fill="currentColor" cx="16" cy="8" r="2" />
//             </svg>
//             <p>Your watchlist is currently empty.</p>
//             <p className="text-sm mt-2">
//               Start adding tickers to stay informed.
//             </p>
//             <button className="mt-4 bg-[#2a2a3c] border-[#3a3a4c] hover:bg-[#3a3a4c] px-4 py-2 rounded">
//               Add Tickers
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StockWatchlist;

import axios from "axios";
import { useState } from "react";

const StockWatchlist = ({ sendMessageToChat }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentStock, setCurrentStock] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedTicker, setExpandedTicker] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);

  const FINNHUB_API_KEY = "d08gifhr01qh1ecc2v7gd08gifhr01qh1ecc2v80";
  const BACKEND_URL = "https://backendoftradegpt-production.up.railway.app";

  const getStockQuote = async (symbol) => {
    try {
      const response = await axios.get(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
      );

      if (response.status !== 200) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = response.data;

      if (data && data.c > 0) {
        return {
          symbol: symbol,
          price: data.c.toFixed(2),
          open: data.o.toFixed(4),
          high: data.h.toFixed(4),
          low: data.l.toFixed(4),
          previousClose: data.pc.toFixed(4),
          change: (data.c - data.pc).toFixed(2),
          changePercent: (((data.c - data.pc) / data.pc) * 100).toFixed(2),
          volume: Math.round(data.v).toLocaleString(),
          sparkline: data.c >= data.pc ? "up" : "down",
        };
      }

      return null;
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      throw error;
    }
  };

  const getCompanyNews = async (symbol) => {
    try {
      const today = new Date();
      const fromDate = new Date();
      fromDate.setDate(today.getDate() - 7);

      const toDateStr = today.toISOString().split("T")[0];
      const fromDateStr = fromDate.toISOString().split("T")[0];

      const response = await axios.get(
        `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${fromDateStr}&to=${toDateStr}&token=${FINNHUB_API_KEY}`
      );

      if (response.status !== 200) {
        throw new Error(`API error: ${response.status}`);
      }

      return response.data.slice(0, 3).map((item) => ({
        id: item.id,
        headline: item.headline,
        summary: item.summary,
        source: item.source,
        url: item.url,
        datetime: new Date(item.datetime * 1000),
        category: item.category || "Investing",
      }));
    } catch (error) {
      console.error(`Error fetching news for ${symbol}:`, error);
      return [];
    }
  };

  const getCompanyName = (symbol) => {
    const companies = {
      AAPL: "Apple Inc",
      MSFT: "Microsoft Corporation",
      GOOGL: "Alphabet Inc",
      AMZN: "Amazon.com Inc",
      TSLA: "Tesla Inc",
      META: "Meta Platforms Inc",
      NVDA: "NVIDIA Corporation",
      NFLX: "Netflix Inc",
      JPM: "JPMorgan Chase & Co",
      INTC: "Intel Corporation",
      UNH: "United Health Group ",
    };

    return companies[symbol] || `${symbol} Corporation`;
  };

  const handleWatchlistButtonClick = async (buttonType, symbol) => {
    const stock = watchlist.find((s) => s.symbol === symbol);
    if (!stock) return;

    const payload = {
      symbol: stock.symbol,
      name: stock.name || getCompanyName(stock.symbol),
      price: stock.price,
      open: stock.open,
      high: stock.high,
      low: stock.low,
      previousClose: stock.previousClose,
      volume: stock.volume,
      trend: stock.sparkline,
      queryType: {
        priceChart: "Price Chart",
        recentNews: "Recent News",
        tradeIdeas: "Trade Ideas",
        analysis: "Analysis",
      }[buttonType],
      news: newsItems.map((item) => ({
        headline: item.headline,
        summary: item.summary,
        time: item.datetime.toLocaleString(),
        category: item.category,
      })),
    };

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/deepseek-chat/`,
        payload
      );
      const message = res.data.message;
      sendMessageToChat(message);
    } catch (error) {
      console.error("DeepSeek request failed:", error);
      sendMessageToChat("AI response failed. Please try again later.");
    }
  };

  return (
    <div className="watchlist flex-shrink-0 bg-[#161b25] border-l border-[#3a3a4c] text-white">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">Watchlist</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              className="text-gray-400 cursor-pointer"
            >
              <path
                fill="currentColor"
                d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
              ></path>
            </svg>
          </div>
        </div>

        <div className="relative mb-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Search tickers (e.g., AAPL, MSFT)"
            className="w-full pl-4 pr-8 py-2 bg-[#2a2a3c] border-[#3a3a4c] rounded-full text-white"
          />
          <div
            onClick={handleSearch}
            className="absolute right-2 top-2 text-gray-400 cursor-pointer"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="currentColor"
                d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
              ></path>
            </svg>
          </div>
        </div>

        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

        {watchlist.length > 0 && expandedTicker && (
          <div className="text-right mb-2">
            <button
              className="text-blue-400 text-sm"
              onClick={() => setExpandedTicker(null)}
            >
              Back to watchlist
            </button>
          </div>
        )}

        <div className="grid grid-cols-3 py-2 border-b border-[#3a3a4c] text-sm text-gray-400">
          <div>Symbol</div>
          <div className="text-center">Trend</div>
          <div className="text-right">Price</div>
        </div>

        {isLoading ? (
          <div className="py-3 flex justify-center items-center">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : watchlist.length > 0 ? (
          watchlist.map((ticker) => (
            <div key={ticker.symbol} className="border-b border-[#3a3a4c]">
              <div
                className="py-3 cursor-pointer ticker-chart"
                onClick={() => toggleExpandTicker(ticker.symbol)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      className="h-6 w-6 rounded-full bg-[#2a2a3c] flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWatchlist(ticker.symbol);
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16">
                        <path
                          fill="currentColor"
                          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                        ></path>
                      </svg>
                    </button>
                    <div>
                      <div className="font-bold">{ticker.symbol}</div>
                      <div className="text-xs text-gray-400 truncate max-w-[80px]">
                        {ticker.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 px-2">
                    {ticker.sparkline === "up" ? (
                      <svg viewBox="0 0 100 30" className="h-8 w-full">
                        <path
                          d="M0,15 Q10,10 20,12 T40,8 T60,12 T80,10 T100,5"
                          fill="none"
                          stroke="#4ade80"
                          strokeWidth="2"
                        />
                        <path
                          d="M0,15 Q10,10 20,12 T40,8 T60,12 T80,10 T100,5 V30 H0 Z"
                          fill="rgba(74, 222, 128, 0.1)"
                        />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 100 30" className="h-8 w-full">
                        <path
                          d="M0,5 Q10,10 20,15 T40,20 T60,18 T80,25 T100,20"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="2"
                        />
                        <path
                          d="M0,5 Q10,10 20,15 T40,20 T60,18 T80,25 T100,20 V30 H0 Z"
                          fill="rgba(239, 68, 68, 0.1)"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="font-bold">${ticker.price}</div>
                    <div
                      className={`text-xs ${
                        parseFloat(ticker.changePercent) >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {parseFloat(ticker.changePercent) >= 0 ? "+" : ""}
                      {ticker.changePercent}%
                    </div>
                  </div>
                </div>
              </div>

              {expandedTicker === ticker.symbol && (
                <div className="pb-3">
                  <div className="bg-[#2a2a3c] rounded-md p-2 mb-2 text-xs price-box">
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-gray-400">Open:</div>
                      <div className="text-right">${ticker.open}</div>
                      <div className="text-gray-400">High:</div>
                      <div className="text-right">${ticker.high}</div>
                      <div className="text-gray-400">Low:</div>
                      <div className="text-right">${ticker.low}</div>
                      <div className="text-gray-400">Volume:</div>
                      <div className="text-right">{ticker.volume}</div>
                      <div className="text-gray-400">Prev Close:</div>
                      <div className="text-right">${ticker.previousClose}</div>
                    </div>
                    {/* <div className="mt-2 text-center">
                      <a
                        href={`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker.symbol}&apikey=demo&datatype=csv`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 flex items-center justify-center gap-1"
                      >
                        View Historical Data 
                        <svg viewBox="0 0 24 24" width="12" height="12">
                          <path fill="currentColor" d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path>
                        </svg>
                      </a>
                    </div> */}
                  </div>

                  {/* News Section */}
                  <div className="bg-[#2a2a3c] rounded-md p-3 mb-3">
                    <div className="flex items-center gap-2 mb-3">
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        className="text-blue-400"
                      >
                        <path
                          fill="currentColor"
                          d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z"
                        ></path>
                      </svg>
                      <span className="text-blue-400 font-medium text-sm">
                        Today's News Highlight
                      </span>
                    </div>

                    {isLoadingNews ? (
                      <div className="py-3 flex justify-center items-center">
                        <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                      </div>
                    ) : newsItems.length > 0 ? (
                      <>
                        <h3 className="text-white text-sm font-medium mb-3">
                          {newsItems[0]?.headline ||
                            `${ticker.name} Latest News`}
                        </h3>

                        <div className="divide-y divide-[#3a3a4c]">
                          {newsItems.map((newsItem, index) => (
                            <div
                              key={newsItem.id || index}
                              className="py-2 cursor-pointer"
                              onClick={() => openNewsUrl(newsItem.url)}
                            >
                              <div className="flex gap-2 mb-1">
                                <div className="w-8 h-8 bg-[#3a3a4c] rounded-full flex items-center justify-center flex-shrink-0">
                                  <svg
                                    viewBox="0 0 24 24"
                                    width="16"
                                    height="16"
                                    className="text-gray-300"
                                  >
                                    <path
                                      fill="currentColor"
                                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
                                    ></path>
                                  </svg>
                                </div>
                                <div>
                                  <h4 className="text-white text-xs font-medium">
                                    {newsItem.headline}
                                  </h4>
                                  <div className="text-gray-400 text-xs mt-1">
                                    {formatNewsDate(newsItem.datetime)}
                                  </div>
                                  <div className="text-gray-400 text-xs mt-1">
                                    ↗ {newsItem.category || "Investing"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 text-center">
                          <a
                            href={`https://www.marketwatch.com/investing/stock/${ticker.symbol}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 text-xs flex items-center justify-center gap-1"
                          >
                            View All News
                            <svg viewBox="0 0 24 24" width="12" height="12">
                              <path
                                fill="currentColor"
                                d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"
                              ></path>
                            </svg>
                          </a>
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-400 text-xs text-center py-2">
                        No recent news available for {ticker.symbol}
                      </div>
                    )}

                    <div className="mt-3 border-t border-[#3a3a4c] pt-2 flex justify-between">
                      <div className="text-gray-400 text-xs">
                        Was this news helpful?
                      </div>
                      <div className="flex gap-2">
                        <button className="text-gray-400 hover:text-blue-400">
                          <svg viewBox="0 0 24 24" width="16" height="16">
                            <path
                              fill="currentColor"
                              d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"
                            ></path>
                          </svg>
                        </button>
                        <button className="text-gray-400 hover:text-red-400">
                          <svg viewBox="0 0 24 24" width="16" height="16">
                            <path
                              fill="currentColor"
                              d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 watchlist-btns">
                    <button
                      className="text-xs bg-[#2a2a3c] border-[#3a3a4c] hover:bg-[#3a3a4c] p-2 rounded"
                      onClick={() =>
                        handleWatchlistButtonClick("priceChart", ticker.symbol)
                      }
                    >
                      Price Chart
                    </button>
                    <button
                      className="text-xs bg-[#2a2a3c] border-[#3a3a4c] hover:bg-[#3a3a4c] p-2 rounded"
                      onClick={() =>
                        handleWatchlistButtonClick("recentNews", ticker.symbol)
                      }
                    >
                      Recent News
                    </button>
                    <button
                      className="text-xs bg-[#2a2a3c] border-[#3a3a4c] hover:bg-[#3a3a4c] p-2 rounded"
                      onClick={() =>
                        handleWatchlistButtonClick("tradeIdeas", ticker.symbol)
                      }
                    >
                      Trade Ideas
                    </button>
                    <button
                      className="text-xs bg-[#2a2a3c] border-[#3a3a4c] hover:bg-[#3a3a4c] p-2 rounded"
                      onClick={() =>
                        handleWatchlistButtonClick("analysis", ticker.symbol)
                      }
                    >
                      Analysis
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-gray-400 flex flex-col items-center">
            <svg
              viewBox="0 0 24 24"
              width="40"
              height="40"
              className="text-gray-500 mb-4"
            >
              <path fill="currentColor" d="M3 3h18v18H3V3zm16 16V5H5v14h14z" />
              <path fill="currentColor" d="M15 11l-3-3-6 6h12l-3-3z" />
              <circle fill="currentColor" cx="16" cy="8" r="2" />
            </svg>
            <p>Your watchlist is currently empty.</p>
            <p className="text-sm mt-2">
              Start adding tickers to stay informed.
            </p>
            <button className="mt-4 bg-[#2a2a3c] border-[#3a3a4c] hover:bg-[#3a3a4c] px-4 py-2 rounded">
              Add Tickers
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockWatchlist;
