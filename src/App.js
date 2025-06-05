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

  // ADD: Prompts functionality state
  const [showPrompts, setShowPrompts] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

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

  // ADD: Handle navigation item clicks from sidebar
  const handleNavItemClick = (item) => {
    setActiveSection(item);
    if (item === 'prompts') {
      setShowPrompts(true);
    } else {
      setShowPrompts(false);
    }
    console.log("Navigation clicked:", item);
  };

  // ADD: Handle closing prompts
  const handleClosePrompts = () => {
    setShowPrompts(false);
    setActiveSection('dashboard');
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

  // ADD: Log prompts state changes
  useEffect(() => {
    console.log("Prompts visibility changed to:", showPrompts);
  }, [showPrompts]);

  return (
    <div className="flex w-full min-h-screen bg-primary-bg">
      <LeftSidebar 
        collapsed={sidebarCollapsed} 
        toggleSidebar={toggleSidebar} 
        onNavItemClick={handleNavItemClick}
        activeSection={activeSection}
      />
      
      <div className={`flex-1 flex flex-col ${sidebarCollapsed ? 'ml-16' : 'ml-72'} transition-all duration-300`}>
        <ChatArea 
          toggleWatchlist={toggleWatchlist} 
          watchlistMessage={watchlistMessage}
          showPrompts={showPrompts}
          onClosePrompts={handleClosePrompts}
          activeSection={activeSection}
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