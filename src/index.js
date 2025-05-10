import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();






/**
 * TradeGPT Sidebar Fix
 * 
 * This script fixes the issues with sidebar toggling on TradeGPT:
 * 1. Ensures left toggle button only controls left sidebar
 * 2. Ensures right toggle button only controls right sidebar
 * 3. Fixes "Cannot read properties of null" errors
 * 4. Works on mobile devices
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('TradeGPT Sidebar Fix Initializing...');
  
  // ====== Helper Functions ======
  
  // Safe element query with fallbacks
  function findElement(selectors) {
    if (typeof selectors === 'string') {
      return document.querySelector(selectors);
    }
    
    for (let i = 0; i < selectors.length; i++) {
      const element = document.querySelector(selectors[i]);
      if (element) return element;
    }
    
    return null;
  }
  
  // Clear any existing event listeners by cloning
  function resetEventListeners(element) {
    if (!element) return null;
    const clone = element.cloneNode(true);
    if (element.parentNode) {
      element.parentNode.replaceChild(clone, element);
    }
    return clone;
  }
  
  // ====== Find UI Elements ======
  
  // Find sidebars using multiple selectors for reliability
  const leftSidebar = findElement([
    '.left-sidebar', 
    '[class*="bg-sidebar-bg"]',
    '.app-container > div:first-child'
  ]);
  
  const rightSidebar = findElement([
    '.watchlist-sidebar', 
    '[class*="w-[300px]"]',
    '[class*="border-l border-[#3a3a4c]"]'
  ]);
  
  // Log what we found
  console.log('Left sidebar found:', !!leftSidebar);
  console.log('Right sidebar found:', !!rightSidebar);
  
  // Create mobile header if needed
  let mobileHeader = findElement('.mobile-header');
  if (!mobileHeader) {
    mobileHeader = document.createElement('div');
    mobileHeader.className = 'mobile-header';
    mobileHeader.innerHTML = `
      <button class="toggle-button left-toggle">
        <i class="bi bi-list" style="font-size: 1.5rem;"></i>
      </button>
      <div class="logo">TradeGPT</div>
      <button class="toggle-button right-toggle">
        <i class="bi bi-graph-up" style="font-size: 1.5rem;"></i>
      </button>
    `;
    document.body.insertBefore(mobileHeader, document.body.firstChild);
  }
  
  // Get toggle buttons
  let leftToggleBtn = resetEventListeners(findElement([
    '.left-toggle',
    '.mobile-header button:first-child', 
    'button:first-child'
  ]));
  
  let rightToggleBtn = resetEventListeners(findElement([
    '.right-toggle',
    '.mobile-header button:last-child', 
    'button:last-child'
  ]));
  
  // Create overlay if needed
  let overlay = findElement('.sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
  }
  
  // ====== Apply Essential Styles ======
  
  // Overlay styles
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 30;
    display: none;
  `;
  
  // Mobile header styles
  mobileHeader.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background-color: #161b25;
    border-bottom: 1px solid #3a3a4c;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 35;
  `;
  
  // Add styles to left sidebar
  if (leftSidebar) {
    const currentStyles = window.getComputedStyle(leftSidebar);
    leftSidebar.style.cssText += `
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 272px;
      z-index: 40;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
      overflow-y: auto;
      background-color: ${currentStyles.backgroundColor || '#161b25'};
    `;
  }
  
  // Add styles to right sidebar
  if (rightSidebar) {
    const currentStyles = window.getComputedStyle(rightSidebar);
    rightSidebar.style.cssText += `
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 300px;
      z-index: 40;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      overflow-y: auto;
      background-color: ${currentStyles.backgroundColor || '#161b25'};
    `;
  }
  
  // Make sure content area has proper padding for mobile header
  const contentArea = findElement([
    '.content-area',
    '.chat-area',
    '[class*="flex-col h-screen"]'
  ]);
  
  if (contentArea) {
    const currentPaddingTop = window.getComputedStyle(contentArea).paddingTop;
    const numericPadding = parseInt(currentPaddingTop);
    
    if (isNaN(numericPadding) || numericPadding < 60) {
      contentArea.style.paddingTop = '60px';
    }
  }
  
  // ====== Toggle Functions ======
  
  // Left sidebar toggle function - ONLY toggles left sidebar
  function toggleLeftSidebar() {
    console.log('Toggling ONLY left sidebar');
    if (!leftSidebar) return;
    
    const isVisible = leftSidebar.style.transform === 'translateX(0px)';
    
    if (isVisible) {
      // Close left sidebar
      leftSidebar.style.transform = 'translateX(-100%)';
      overlay.style.display = 'none';
    } else {
      // Open left sidebar
      leftSidebar.style.transform = 'translateX(0)';
      
      // Make sure right sidebar is closed
      if (rightSidebar) {
        rightSidebar.style.transform = 'translateX(100%)';
      }
      
      overlay.style.display = 'block';
    }
  }
  
  // Right sidebar toggle function - ONLY toggles right sidebar
  function toggleRightSidebar() {
    console.log('Toggling ONLY right sidebar');
    if (!rightSidebar) return;
    
    const isVisible = rightSidebar.style.transform === 'translateX(0px)';
    
    if (isVisible) {
      // Close right sidebar
      rightSidebar.style.transform = 'translateX(100%)';
      overlay.style.display = 'none';
    } else {
      // Open right sidebar
      rightSidebar.style.transform = 'translateX(0)';
      
      // Make sure left sidebar is closed
      if (leftSidebar) {
        leftSidebar.style.transform = 'translateX(-100%)';
      }
      
      overlay.style.display = 'block';
    }
  }
  
  // ====== Add Event Listeners ======
  
  // Left toggle button
  if (leftToggleBtn) {
    leftToggleBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleLeftSidebar();
    });
    console.log('Left toggle button handler added');
  }
  
  // Right toggle button
  if (rightToggleBtn) {
    rightToggleBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleRightSidebar();
    });
    console.log('Right toggle button handler added');
  }
  
  // Overlay click
  overlay.addEventListener('click', function() {
    if (leftSidebar) {
      leftSidebar.style.transform = 'translateX(-100%)';
    }
    if (rightSidebar) {
      rightSidebar.style.transform = 'translateX(100%)';
    }
    overlay.style.display = 'none';
  });
  
  // ====== Global Functions ======
  
  // Define global toggleWatchlist function - fixes the original error
  window.toggleWatchlist = toggleRightSidebar;
  
  // ====== Media Query Management ======
  
  // Handle resize events to show/hide mobile header
  function handleResize() {
    const isMobile = window.innerWidth <= 768;
    
    // Show/hide mobile header based on screen size
    if (mobileHeader) {
      mobileHeader.style.display = isMobile ? 'flex' : 'none';
    }
    
    // Reset sidebar positions on desktop
    if (!isMobile) {
      if (leftSidebar) {
        leftSidebar.style.transform = '';
      }
      if (rightSidebar) {
        rightSidebar.style.transform = '';
      }
    } else {
      // Ensure sidebars are hidden on mobile by default
      if (leftSidebar && leftSidebar.style.transform === '') {
        leftSidebar.style.transform = 'translateX(-100%)';
      }
      if (rightSidebar && rightSidebar.style.transform === '') {
        rightSidebar.style.transform = 'translateX(100%)';
      }
    }
  }
  
  // Initialize based on current screen size
  handleResize();
  
  // Listen for window resize events
  window.addEventListener('resize', handleResize);
  
  console.log('TradeGPT Sidebar Fix Initialized Successfully');
});

// Backup initialization for when DOMContentLoaded might have already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(function() {
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);
  }, 100);
}