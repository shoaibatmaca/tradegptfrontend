import React, { useState } from 'react';

const TradingPromptsModal = ({ isOpen, onClose }) => {
  const [activeMainTab, setActiveMainTab] = useState('options');
  const [activeSubTab, setActiveSubTab] = useState('hot-trades');

  const promptsData = {
    options: {
      'hot-trades': [
        {
          id: 1,
          text: "Highlight the top 5 Call options in the AI hardware sector driven by advancements in chip technology."
        },
        {
          id: 2,
          text: "Recommend me the top Call or Put options with weekly expirations for ETFs."
        },
        {
          id: 3,
          text: "Show me the best performing Call or Put options in the energy sector as oil prices continue to fluctuate."
        },
        {
          id: 4,
          text: "Recommend me top Call or Put options that are linked to company with the current news events today."
        }
      ],
      'market-moves': [
        {
          id: 5,
          text: "Analyze the most volatile options in tech stocks for potential swing trades."
        },
        {
          id: 6,
          text: "Find options with high implied volatility in the healthcare sector."
        },
        {
          id: 7,
          text: "Show me options strategies for upcoming earnings announcements this week."
        },
        {
          id: 8,
          text: "Identify options with unusual volume activity in financial sector stocks."
        }
      ]
    },
    stocks: {
      'quick-trades': [
        {
          id: 9,
          text: "What are the top 5 stocks to buy today for quick returns in intraday trading."
        },
        {
          id: 10,
          text: "Give me the top 5 stock picks today influenced by both the latest economic indicators (interest rates, CPI, PPI) and industry-specific news."
        },
        {
          id: 11,
          text: "List the top 5 stocks with positive momentum and strong market sentiment for trading today."
        },
        {
          id: 12,
          text: "List top 5 stocks with a bullish crossover of the 50-day and 200-day exponential moving averages, indicating a potential upward trend."
        }
      ],
      'top-picks': [
        {
          id: 13,
          text: "Show me the top 5 dividend-paying stocks with consistent growth over the past 5 years."
        },
        {
          id: 14,
          text: "Recommend blue-chip stocks with strong fundamentals for long-term investment."
        },
        {
          id: 15,
          text: "Find undervalued stocks in the technology sector with high growth potential."
        },
        {
          id: 16,
          text: "List top ESG-compliant stocks with strong environmental and social governance ratings."
        }
      ]
    }
  };

  const handleUsePrompt = (promptText) => {
    console.log('Using prompt:', promptText);
    // Add your logic here to handle the prompt usage
  };

  const handleSubTabChange = (subTab) => {
    setActiveSubTab(subTab);
  };

  const handleMainTabChange = (mainTab) => {
    setActiveMainTab(mainTab);
    // Reset to first sub-tab when switching main tabs
    if (mainTab === 'options') {
      setActiveSubTab('hot-trades');
    } else {
      setActiveSubTab('quick-trades');
    }
  };

  if (!isOpen) return null;

  const currentPrompts = promptsData[activeMainTab][activeSubTab];

  return (
    <div className="trading-modal-overlay">
      <div className="trading-modal">
        <div className="trading-modal-header">
          <h2 className="trading-modal-title">Turbocharge your trading with these prompts.</h2>
          <button className="trading-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="trading-modal-body">
          {/* Main Tabs */}
          <div className="main-tabs">
            <button 
              className={`main-tab ${activeMainTab === 'options' ? 'active' : ''}`}
              onClick={() => handleMainTabChange('options')}
            >
              <i className="bi bi-diagram-3"></i>
              Options
            </button>
            <button 
              className={`main-tab ${activeMainTab === 'stocks' ? 'active' : ''}`}
              onClick={() => handleMainTabChange('stocks')}
            >
              <i className="bi bi-bar-chart-fill"></i>
              Stocks
            </button>
          </div>

          {/* Sub Tabs */}
          <div className="sub-tabs">
            {activeMainTab === 'options' ? (
              <>
                <button 
                  className={`sub-tab ${activeSubTab === 'hot-trades' ? 'active' : ''}`}
                  onClick={() => handleSubTabChange('hot-trades')}
                >
                  <i className="bi bi-fire"></i>
                  Hot Trades
                </button>
                <button 
                  className={`sub-tab ${activeSubTab === 'market-moves' ? 'active' : ''}`}
                  onClick={() => handleSubTabChange('market-moves')}
                >
                  <i className="bi bi-graph-up-arrow"></i>
                  Market Moves
                </button>
              </>
            ) : (
              <>
                <button 
                  className={`sub-tab ${activeSubTab === 'quick-trades' ? 'active' : ''}`}
                  onClick={() => handleSubTabChange('quick-trades')}
                >
                  <i className="bi bi-clock-fill"></i>
                  Quick Trades
                </button>
                <button 
                  className={`sub-tab ${activeSubTab === 'top-picks' ? 'active' : ''}`}
                  onClick={() => handleSubTabChange('top-picks')}
                >
                  <i className="bi bi-star-fill"></i>
                  Top Picks
                </button>
              </>
            )}
          </div>

          {/* Prompts List */}
          <div className="prompts-container">
            {currentPrompts.map((prompt) => (
              <div key={prompt.id} className="prompt-card">
                <p className="prompt-text">{prompt.text}</p>
                <button 
                  className="use-prompt-btn"
                  onClick={() => handleUsePrompt(prompt.text)}
                >
                  Use prompt
                  <i className="bi bi-send"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo Component to show the modal
const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeItem, setActiveItem] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const handleNavItemClick = (item) => {
    setActiveItem(item);
    if (item === 'prompts') {
      setShowModal(true);
    }
  };

  return (
    <div className="app-container">
      {/* Navigation Sidebar */}
      <div className="sidebar">
        <ul className="nav-list">
          <li
            className={`nav-item ${activeItem === "dashboard" ? "active" : ""}`}
            onClick={() => handleNavItemClick("dashboard")}
          >
            <i className="bi bi-grid-fill"></i>
            {!collapsed && <span>Dashboard</span>}
          </li>
          <li
            className={`nav-item ${activeItem === "prompts" ? "active" : ""}`}
            onClick={() => handleNavItemClick("prompts")}
          >
            <i className="bi bi-lightbulb-fill"></i>
            {!collapsed && <span>Recommended Prompts</span>}
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Trading Dashboard</h1>
        <p>Click on "Recommended Prompts" in the sidebar to see the modal.</p>
      </div>

      {/* Trading Prompts Modal */}
      <TradingPromptsModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </div>
  );
};

export default App;