import React, { useState, useEffect } from 'react';
import LeftSidebar from './components/LeftSidebar';
import ChatArea from './components/ChatArea';
import Watchlist from './components/Watchlist';
import "./responsive.css";
import './App.css';

const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [watchlistVisible, setWatchlistVisible] = useState(false);
  const [watchlistMessage, setWatchlistMessage] = useState(null);

  // Debug toggle function with console logs
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    console.log("Sidebar toggled, new state:", !sidebarCollapsed);
  };

  // Debug toggle function with console logs
  const toggleWatchlist = () => {
    console.log("Toggling watchlist from", watchlistVisible, "to", !watchlistVisible);
    setWatchlistVisible(!watchlistVisible);
  };

  // Function to handle messages from watchlist
  const sendMessageToChat = (message) => {
    console.log("Message from watchlist:", message);
    setWatchlistMessage(message);
  };

  // Reset watchlist message after it's been processed
  useEffect(() => {
    if (watchlistMessage) {
      // Reset after a short delay to ensure it's processed
      const timer = setTimeout(() => {
        setWatchlistMessage(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [watchlistMessage]);

  // Log state changes
  useEffect(() => {
    console.log("Watchlist visibility changed to:", watchlistVisible);
  }, [watchlistVisible]);

  return (
    <div className="flex w-full min-h-screen bg-primary-bg">
      <LeftSidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 flex flex-col ${sidebarCollapsed ? 'ml-16' : 'ml-72'} transition-all duration-300`}>
        <ChatArea 
          toggleWatchlist={toggleWatchlist} 
          watchlistMessage={watchlistMessage} 
        />
      </div>
      
      <Watchlist 
        visible={watchlistVisible} 
        toggleWatchlist={toggleWatchlist}
        sendMessageToChat={sendMessageToChat}
      />
    </div>
  );
};

export default App;




