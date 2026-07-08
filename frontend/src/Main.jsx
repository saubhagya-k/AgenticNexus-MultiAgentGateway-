import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import FloatingKite from './component/FloatingKite';

const Main = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userId] = useState('user-' + Math.random().toString(36).substring(7));
  const chatBoxRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((prev) => [...prev, { text: userMsg, sender: 'user' }]);
    setInput('');

    try {
      const res = await axios.post('/api/chat', {
        message: userMsg,
        user_id: userId,
      });
      setMessages((prev) => [...prev, { text: res.data.response, sender: 'ai' }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { text: 'Error: ' + err.message, sender: 'ai' },
      ]);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4"
      style={{ position: 'relative' }}   // anchor for absolute dolphins
    >
      {/* FloatingDolphin — decorative overlays */}
      <FloatingKite top="10%" left="15%" size={70} duration={14} />
      <FloatingKite top="25%" left="60%" size={45} duration={18} />
      <FloatingKite top="55%" left="80%" size={55} duration={11} />

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[600px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="text-3xl">🤖</span> AI Chat Bot
          </h1>
          <p className="text-blue-100 text-sm">Powered by Gemini 2.5 Flash</p>
        </div>

        {/* Chat messages */}
        <div
          ref={chatBoxRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        >
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm italic">
              Start a conversation by typing a message below.
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm opacity-80">
                    {msg.sender === 'user' ? 'You' : 'AI'}
                  </span>
                </div>
                <div className="mt-1 leading-relaxed">{msg.text}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="border-t border-gray-200 bg-white px-4 py-3 flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition duration-200 shadow-md hover:shadow-lg active:scale-95"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Main;