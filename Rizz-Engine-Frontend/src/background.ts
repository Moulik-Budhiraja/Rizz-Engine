// background.js - Service worker for managing side panel communication

console.log('Rizz Engine background script loaded');

// Enable side panel on Instagram pages
chrome.tabs.onUpdated.addListener(async (tabId, _info, tab) => {
  if (!tab.url) return;
  
  if (tab.url.includes('instagram.com')) {
    // Enable side panel for Instagram tabs
    await chrome.sidePanel.setOptions({
      tabId,
      enabled: true
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);
  
  // Forward content script messages to all side panels
  // Note: In MV3, we can't directly send to side panel, so we store the data
  // and the side panel will request it
  if (sender.tab) {
    // Store the latest data for this tab
    chrome.storage.session.set({
      [`tab_${sender.tab.id}_data`]: {
        ...message,
        tabId: sender.tab.id,
        timestamp: Date.now()
      }
    });
  }
  
  sendResponse({ received: true });
});