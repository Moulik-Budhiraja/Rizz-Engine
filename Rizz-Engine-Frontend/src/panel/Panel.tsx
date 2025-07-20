import { useState } from "react";
import type { DebugInfo } from "../types";

// interface Message {
//   id: number;
//   text: string;
//   timestamp?: string;
//   hasImage: boolean;
//   hasVideo: boolean;
//   element: Element; // Keep reference for potential actions
// }

function RizzEngineControlPanel() {
  const [messageCount, setMessageCount] = useState(0);
  // const [messages, setMessages] = useState<Message[]>([]);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>();
  const [isConnected, setIsConnected] = useState(false);
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab>();

  // Get current active tab
  const getCurrentTab = async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      setCurrentTab(tab);
      return tab;
    } catch (error) {
      console.error("Error getting current tab:", error);
      return null;
    }
  };

  // Send message to content script
  const sendToContentScript = async (action: string) => {
    try {
      const tab = await getCurrentTab();
      if (!tab?.id) return null;

      const response = await chrome.tabs.sendMessage(tab.id, {
        action,
      });
      setIsConnected(true);
      return response;
    } catch (error) {
      console.error("Error communicating with content script:", error);
      setIsConnected(false);
      return null;
    }
  };

  // Update message elements by requesting from content script
  const updateMessageElements = async () => {
    const response = await sendToContentScript("getMessages");
    if (response) {
      setMessageCount(response.count);
      // setMessages(response.messages);
    }
  };

  // Debug page information
  const debugPage = async () => {
    const response = await sendToContentScript("debugPage");
    if (response) {
      setDebugInfo(response);
    }
  };

  return (
    <>
      <div>
        <h2>Rizz Engine Control Panel</h2>
        <p>Control the Rizz Engine settings here.</p>
        <div>
          <h3>Status</h3>
          <p>
            {isConnected
              ? "Connected to content script"
              : "Not connected to content script"}
          </p>
        </div>
        <div>
          <h3>Message Count</h3>
          <p>Total messages: {messageCount}</p>
          <button onClick={updateMessageElements}>
            Update Message Elements
          </button>
        </div>
        <div>
          <h3>Current Tab</h3>
          {currentTab ? (
            <p>
              {currentTab.title} ({currentTab.url})
            </p>
          ) : (
            <p>No active tab selected</p>
          )}
          <button onClick={getCurrentTab}>Get Current Tab</button>
          {/* <button onClick={debugPage}>Debug Page</button> */}
        </div>
        <div>
          <div>
            <h3>Debug State</h3>
            {/* <p>{debugInfo}</p> */}
            <button onClick={debugPage}>Get Debug Info</button>
            {debugInfo && <pre>{JSON.stringify(debugInfo, null, 2)}</pre>}
          </div>
        </div>
      </div>
      {/* Additional controls can be added here */}
    </>
  );
}

function Panel() {
  const [active, setActive] = useState(false);

  const toggleRizzEngine = () => {
    setActive(!active);
  };
  return (
    <>
      <div>
        <h1>Rizz Engine Panel</h1>
        <p> Welcome to Rizz Engine.</p>
      </div>
      <div>
        <button onClick={toggleRizzEngine}>
          {active ? "Deactivate Rizz Engine" : "Activate Rizz Engine"}
        </button>
        {active && <RizzEngineControlPanel />}
      </div>
    </>
  );
}

export default Panel;
