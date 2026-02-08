"use client";
import { useState, useRef, useEffect } from 'react';

export default function YieldAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! I am your Monbux Yield Agent. Ask me about Stacks (STX) staking or APY strategies." }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      const modelName = "gemini-2.5-flash"; // The version that works for you!
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `You are a helpful crypto assistant for Monbux. Keep answers short (under 50 words). User asked: ${userMessage}` }] }]
          })
        }
      );

      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";

      setMessages(prev => [...prev, { role: "ai", text: aiText }]);

    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", text: "Connection error. Please try again." }]);
    }
    setLoading(false);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* 1. The Chat Window (Only shows when open) */}
      {isOpen && (
        <div className="mb-4 w-80 bg-gray-900 border border-purple-500 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-96">
          
          {/* Header */}
          <div className="bg-purple-700 p-3 flex justify-between items-center">
            <h3 className="font-bold text-white text-sm">🤖 Monbux Agent</h3>
            <button onClick={() => setIsOpen(false)} className="text-purple-200 hover:text-white">✕</button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-900">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-2 rounded-lg text-sm ${
                  msg.role === 'user' 
                    ? 'bg-purple-600 text-white rounded-br-none' 
                    : 'bg-gray-700 text-gray-200 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-gray-500 animate-pulse">Thinking...</div>}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about yield..."
              className="flex-1 bg-gray-900 text-white text-sm rounded-md px-3 py-2 outline-none border border-gray-700 focus:border-purple-500"
            />
            <button 
              onClick={sendMessage}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-md transition-colors"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* 2. The Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg flex items-center justify-center text-2xl transition-transform hover:scale-105"
      >
        {isOpen ? '✕' : '🤖'}
      </button>
    </div>
  );
}