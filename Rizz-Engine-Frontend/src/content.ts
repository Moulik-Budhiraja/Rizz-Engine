import type { DebugInfo } from "./types";

// content.js - Runs in Instagram's page context and communicates with side panel
console.log('Rizz Engine content script loaded on Instagram');

// Function to find Instagram messages
function findInstagramMessages() {
  const elements = document.querySelectorAll('[data-virtualized="false"]');
  console.log(`Found ${elements.length} message elements`);
  
  return {
    count: elements.length
    // messages: Array.from(elements).map((el, index) => ({
    //   id: index,
    //   text: el.textContent.trim(),
    //   timestamp: el.querySelector('time')?.getAttribute('datetime'),
    //   hasImage: !!el.querySelector('img'),
    //   hasVideo: !!el.querySelector('video'),
    //   element: el // Keep reference for potential actions
    // }))
  };
}

// Function to get page debug info
function getPageDebugInfo() : DebugInfo {
  return {
    url: window.location.href,
    title: document.title,
    domain: document.domain,
    pathname: window.location.pathname,
    isMessagesPage: window.location.pathname.includes('/direct/'),
    totalElements: document.querySelectorAll('*').length,
    hasInstagramMain: !!document.querySelector('[role="main"]'),
    virtualizedElements: document.querySelectorAll('[data-virtualized]').length,
    virtualizedFalseElements: document.querySelectorAll('[data-virtualized="false"]').length,
    timestamp: new Date().toISOString()
  };
}

// Listen for messages from side panel
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  console.log('Content script received message:', request);
  
  switch (request.action) {
    case 'getMessages': {
      const result = findInstagramMessages();
      sendResponse(result);
      break;
    }
      
    case 'debugPage': {
      const debugInfo = getPageDebugInfo();
      sendResponse(debugInfo);
      break;
    }
      
    default:
      sendResponse({ error: 'Unknown action' });
  }
  
  return true; // Keep message channel open for async responses
});