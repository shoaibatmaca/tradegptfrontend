import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import ChatArea from "./components/ChatArea";
import LeftSidebar from "./components/LeftSidebar";
import IntroToTradeGPT from "./components/TradeGptIntro"; // make sure this file exists
import Watchlist from "./components/Watchlist";
import "./responsive.css";

const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [watchlistVisible, setWatchlistVisible] = useState(false);
  const [watchlistMessage, setWatchlistMessage] = useState(null);
  const [showPrompts, setShowPrompts] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [activeSessionId, setActiveSessionId] = useState(null);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleWatchlist = () => {
    setWatchlistVisible(!watchlistVisible);
  };

  const sendMessageToChat = (message) => {
    setWatchlistMessage(message);
  };

  const handleNavItemClick = (item) => {
    setActiveSection(item);
    if (item === "prompts") {
      setShowPrompts(true);
    } else {
      setShowPrompts(false);
    }
  };

  const handleClosePrompts = () => {
    setShowPrompts(false);
    setActiveSection("dashboard");
  };

  useEffect(() => {
    if (watchlistMessage) {
      const timer = setTimeout(() => setWatchlistMessage(null), 100);
      return () => clearTimeout(timer);
    }
  }, [watchlistMessage]);

  return (
    <Router>
      <div className="flex w-full min-h-screen bg-primary-bg">
        <LeftSidebar
          collapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
          onNavItemClick={handleNavItemClick}
          activeSection={activeSection}
        />

        <div
          className={`flex-1 flex flex-col ${
            sidebarCollapsed ? "ml-16" : "ml-72"
          } transition-all duration-300`}
        >
          <Routes>
            <Route path="/intro" element={<IntroToTradeGPT />} />
            <Route
              path="*"
              element={
                <ChatArea
                  toggleWatchlist={toggleWatchlist}
                  watchlistMessage={watchlistMessage}
                  showPrompts={showPrompts}
                  onClosePrompts={handleClosePrompts}
                  activeSection={activeSection}
                />
              }
            />
          </Routes>
        </div>

        <Watchlist
          visible={watchlistVisible}
          toggleWatchlist={toggleWatchlist}
          sendMessageToChat={sendMessageToChat}
        />
      </div>
    </Router>
  );
};

export default App;
