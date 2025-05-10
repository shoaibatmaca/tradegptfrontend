// src/components/PromptCard.js

import React from 'react';

const PromptCard = ({ title, subtitle, icon, onClick }) => {
  const getIconClass = (iconName) => {
    switch (iconName) {
      case 'ev':
        return 'bi-battery-charging';
      case 'ai':
        return 'bi-cpu';
      case 'nvda':
        return 'bi-gpu-card';
      case 'qqq':
        return 'bi-graph-down-arrow';
      default:
        return 'bi-stars';
    }
  };

  return (
    <div 
      className="bg-gradient-to-br from-card-bg to-gray-700 rounded-xl p-4 cursor-pointer flex items-center gap-4 hover:shadow-lg hover:-translate-y-1 transition-all border border-gray-600 hover:border-primary-accent/30"
      onClick={onClick}
    >
      <div className="bg-primary-accent/15 w-12 h-12 rounded-xl flex items-center justify-center text-primary-accent text-xl">
        <i className={`bi ${getIconClass(icon)}`}></i>
      </div>
      <div>
        <h3 className="text-primary-text text-base font-semibold">{title}</h3>
        <p className="text-secondary-text text-sm">{subtitle}</p>
      </div>
    </div>
  );
};

export default PromptCard;
