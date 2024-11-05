import React, { useState, useEffect } from 'react';
import { Terminal, X, ChevronUp, ChevronDown } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  timestamp: Date;
}

export const ConsoleMessagesContext = React.createContext<{
  addMessage: (text: string) => void;
}>({
  addMessage: () => {},
});

export function ConsoleMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const addMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text, timestamp: new Date() },
    ]);
    if (!isExpanded) {
      setUnreadCount((prev) => prev + 1);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setUnreadCount(0);
  };

  useEffect(() => {
    const handleConsoleMessage = (event: CustomEvent<string>) => {
      addMessage(event.detail);
    };

    window.addEventListener('console-message', handleConsoleMessage as EventListener);

    return () => {
      window.removeEventListener('console-message', handleConsoleMessage as EventListener);
    };
  }, []);

  useEffect(() => {
    if (isExpanded) {
      setUnreadCount(0);
    }
  }, [isExpanded]);

  return (
    <ConsoleMessagesContext.Provider value={{ addMessage }}>
      <div className="fixed right-6 bottom-32 z-50">
        <div className="relative">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
          >
            <Terminal className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {isExpanded && (
            <div className="absolute bottom-14 right-0 w-96 bg-slate-800 rounded-lg shadow-xl">
              <div className="flex items-center justify-between p-3 border-b border-gray-700">
                <h3 className="text-white font-medium">Console Messages</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={clearMessages}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto p-4 space-y-2">
                {messages.length === 0 ? (
                  <p className="text-gray-400 text-center">No messages yet</p>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className="bg-slate-700 p-3 rounded-lg space-y-1"
                    >
                      <p className="text-white text-sm">{message.text}</p>
                      <p className="text-gray-400 text-xs">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ConsoleMessagesContext.Provider>
  );
}