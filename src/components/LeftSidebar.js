// src/components/LeftSidebar.js

import React, { useState } from 'react';

const LeftSidebar = ({ collapsed, toggleSidebar }) => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const handleNavItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className={`bg-sidebar-bg text-primary-text h-screen flex flex-col sticky top-0 overflow-y-auto transition-all duration-300 ${collapsed ? 'w-16' : 'w-72'}`}>
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center">
            <i className="bi bi-bar-chart-fill text-2xl mr-2"></i>
            <h3 className="font-bold m-0">TradeGPT</h3>
          </div>
        )}
        {/* <button className="p-1 rounded-full text-secondary-text hover:bg-hover-bg hover:text-white" onClick={toggleSidebar}>
          {collapsed ? (
            <i className="bi bi-chevron-right"></i>
          ) : (
            <i className="bi bi-chevron-left"></i>
          )}
        </button> */}
      </div>

      <div className="p-3 border-b border-gray-700">
        {!collapsed ? (
          <div className="flex items-center bg-input-bg rounded-md bg-[#2c3e50] h-[46px]">
            <span className="p-2 text-secondary-text">
              <i className="bi bi-search"></i>
            </span>
            <input type="text" className="bg-transparent border-0 text-primary-text p-2 focus:outline-none w-full" placeholder="Search" />
          </div>
        ) : (
          <div className="flex justify-center text-secondary-text">
            <i className="bi bi-search"></i>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <ul className="p-2 list-item">
          <li className={`p-2 rounded-md cursor-pointer flex items-center bg-[#2c3e50] h-[52px] hover:bg-hover-bg ${activeItem === 'dashboard' ? 'bg-hover-bg' : ''}`} onClick={() => handleNavItemClick('dashboard')}>
            <i className="bi bi-grid-fill mr-3"></i>
            {!collapsed && <span>Dashboard</span>}
          </li>
          <li className={`p-2 rounded-md cursor-pointer flex items-center hover:bg-hover-bg ${activeItem === 'prompts' ? 'bg-hover-bg' : ''}`} onClick={() => handleNavItemClick('prompts')}>
            <i className="bi bi-lightbulb-fill mr-3"></i>
            {!collapsed && <span>Recommended Prompts</span>}
          </li>
        </ul>

        <div className="text-xs font-semibold text-secondary-text uppercase p-2">
          {!collapsed && <span>Today</span>}
        </div>

        <ul className="p-2 list-item">
          <li className={`p-2 rounded-md cursor-pointer flex items-center hover:bg-hover-bg ${activeItem === 'today' ? 'bg-hover-bg' : ''}`} onClick={() => handleNavItemClick('today')}>
            <i className="bi bi-calendar-day mr-3"></i>
            {!collapsed && <span>Today</span>}
          </li>
          <li className={`p-2 rounded-md cursor-pointer flex items-center hover:bg-hover-bg ${activeItem === 'past' ? 'bg-hover-bg' : ''}`} onClick={() => handleNavItemClick('past')}>
            <i className="bi bi-calendar-range mr-3"></i>
            {!collapsed && <span>Over 30 Days Ago</span>}
          </li>
        </ul>

        <div className="text-xs font-semibold text-secondary-text uppercase p-1">
          {!collapsed && <span>Investment</span>}
        </div>

        <ul className="p-2 list-item">
          <li className={`p-2 rounded-md cursor-pointer flex items-center hover:bg-hover-bg ${activeItem === 'strategies' ? 'bg-hover-bg' : ''}`} onClick={() => handleNavItemClick('strategies')}>
            <i className="bi bi-graph-up mr-3"></i>
            {!collapsed && <span>Investment Strategies Overview</span>}
          </li>
          <li className={`p-2 rounded-md cursor-pointer flex items-center hover:bg-hover-bg ${activeItem === 'insights' ? 'bg-hover-bg' : ''}`} onClick={() => handleNavItemClick('insights')}>
            <i className="bi bi-pie-chart-fill mr-3"></i>
            {!collapsed && <span>Investment Insights and Analysis</span>}
          </li>
        </ul>

        <div className="p-4 mt-4">
          {!collapsed && (
            <span className="inline-block bg-primary-accent text-primary-text text-xs px-2 py-1 rounded">GUIDE</span>
          )}
          <div className={`p-2 mt-2 rounded-md cursor-pointer flex items-center hover:bg-hover-bg ${activeItem === 'intro' ? 'bg-hover-bg' : ''}`} onClick={() => handleNavItemClick('intro')}>
            <i className="bi bi-info-circle-fill mr-3"></i>
            {!collapsed && <span>Intro to TradeGPT</span>}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center">
          <div className="bg-hover-bg w-9 h-9 rounded-full flex items-center justify-center text-secondary-text">
            <i className="bi bi-person-circle"></i>
          </div>
          {!collapsed && (
            <div className="ml-2">
              <div className="text-sm font-medium text-primary-text">Users 5352</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
