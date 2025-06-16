import React, { useState } from 'react';

const TradingPromptsInline = ({ isVisible, onUsePrompt }) => {
  console.log("🎨 TradingPromptsInline rendered with:", { isVisible, hasOnUsePrompt: !!onUsePrompt });
  
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
    console.log("🔥 Using prompt:", promptText);
    if (onUsePrompt) {
      onUsePrompt(promptText);
    }
  };

  const handleSubTabChange = (subTab) => {
    setActiveSubTab(subTab);
  };

  const handleMainTabChange = (mainTab) => {
    setActiveMainTab(mainTab);
    if (mainTab === 'options') {
      setActiveSubTab('hot-trades');
    } else {
      setActiveSubTab('quick-trades');
    }
  };

  if (!isVisible) {
    console.log("❌ TradingPromptsInline not visible, returning null");
    return null;
  }

  console.log("✅ TradingPromptsInline rendering content");

  const currentPrompts = promptsData[activeMainTab][activeSubTab];

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          Turbocharge your trading with these prompts.
        </h2>
      </div>

      <div className="border border-[#3a4553] rounded-2xl p-8" style={{ backgroundColor: '#1e1e1e' }}>
        {/* Main Tabs */}
        <div className="flex gap-1 mb-6 bg-[#3a4553] rounded-lg p-1">
          <button 
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-medium transition-all ${
              activeMainTab === 'options' 
                ? 'bg-[#5a6573] text-white' 
                : 'text-[#8a9bb3] hover:text-white hover:bg-[#4a5563]'
            }`}
            onClick={() => handleMainTabChange('options')}
          >
            <i className="bi bi-diagram-3"></i>
            Options
          </button>
          <button 
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-medium transition-all ${
              activeMainTab === 'stocks' 
                ? 'bg-[#5a6573] text-white' 
                : 'text-[#8a9bb3] hover:text-white hover:bg-[#4a5563]'
            }`}
            onClick={() => handleMainTabChange('stocks')}
          >
            <i className="bi bi-bar-chart-fill"></i>
            Stocks
          </button>
        </div>

        {/* Sub Tabs */}
        <div className="flex gap-8 mb-6 border-b border-[#3a4553]">
          {activeMainTab === 'options' ? (
            <>
              <button 
                className={`flex items-center gap-2 pb-3 text-sm font-medium transition-all border-b-2 ${
                  activeSubTab === 'hot-trades'
                    ? 'text-[#4fa8d8] border-[#4fa8d8]'
                    : 'text-[#8a9bb3] border-transparent hover:text-white'
                }`}
                onClick={() => handleSubTabChange('hot-trades')}
              >
                <i className="bi bi-fire"></i>
                Hot Trades
              </button>
              <button 
                className={`flex items-center gap-2 pb-3 text-sm font-medium transition-all border-b-2 ${
                  activeSubTab === 'market-moves'
                    ? 'text-[#4fa8d8] border-[#4fa8d8]'
                    : 'text-[#8a9bb3] border-transparent hover:text-white'
                }`}
                onClick={() => handleSubTabChange('market-moves')}
              >
                <i className="bi bi-graph-up-arrow"></i>
                Market Moves
              </button>
            </>
          ) : (
            <>
              <button 
                className={`flex items-center gap-2 pb-3 text-sm font-medium transition-all border-b-2 ${
                  activeSubTab === 'quick-trades'
                    ? 'text-[#4fa8d8] border-[#4fa8d8]'
                    : 'text-[#8a9bb3] border-transparent hover:text-white'
                }`}
                onClick={() => handleSubTabChange('quick-trades')}
              >
                <i className="bi bi-clock-fill"></i>
                Quick Trades
              </button>
              <button 
                className={`flex items-center gap-2 pb-3 text-sm font-medium transition-all border-b-2 ${
                  activeSubTab === 'top-picks'
                    ? 'text-[#4fa8d8] border-[#4fa8d8]'
                    : 'text-[#8a9bb3] border-transparent hover:text-white'
                }`}
                onClick={() => handleSubTabChange('top-picks')}
              >
                <i className="bi bi-star-fill"></i>
                Top Picks
              </button>
            </>
          )}
        </div>

        {/* Prompts List */}
        <div className="space-y-4">
          {currentPrompts.map((prompt) => (
            <div 
              key={prompt.id} 
              className="bg-[#1e252f] border border-[#3a4553] rounded-lg p-5 flex justify-between items-start gap-5 hover:bg-[#252d3a] hover:border-[#4a5563] transition-all hover:-translate-y-0.5"
            >
              <p className="text-white text-sm leading-relaxed flex-1">
                {prompt.text}
              </p>
              <button 
                className="bg-white text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg shrink-0"
                onClick={() => handleUsePrompt(prompt.text)}
              >
                Use prompt
                <i className="bi bi-send text-xs"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TradingPromptsInline;