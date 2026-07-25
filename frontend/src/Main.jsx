import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import FloatingKite from './component/FloatingKite';

// ---------------------------------------------------------------------------
// Design tokens
//   Ink        #16233F  – primary text, deep dusk navy
//   Sky Mist   #EAF4FF → #F7F1FF → #FFF6EC – ambient background gradient
//   Ember      #FF6B4A  – primary accent (kite-tail coral), user bubbles, CTA
//   Lagoon     #2FB6B2  – secondary accent, AI avatar, links/focus
//   Paper      #FFFDF9  – card surface
// Display face: Fraunces (warm, slightly eccentric serif — "handwritten kite
// label" energy). Body: Inter. Utility/mono: JetBrains Mono for timestamps.
// Signature element: a single taut "kite string" thread that runs from the
// header down the left edge of the chat log, visually tethering the floating
// kites above to the conversation happening below.
// ---------------------------------------------------------------------------

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap';

const KiteMark = ({ size = 22, color = '#2FB6B2' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2 L20 10 L12 22 L4 10 Z"
      fill={color}
      opacity="0.9"
    />
    <path d="M12 2 L20 10 L12 12 Z" fill="white" opacity="0.25" />
    <path d="M12 12 L12 22 L4 10 Z" fill="black" opacity="0.08" />
    <line x1="12" y1="12" x2="12" y2="19" stroke="white" strokeWidth="0.6" opacity="0.5" />
  </svg>
);

const TypingDots = () => (
  <div className="flex items-center gap-1 py-1">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="typing-dot"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </div>
);

const Main = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [userId] = useState('user-' + Math.random().toString(36).substring(7));
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);

  // Inject display fonts once
  useEffect(() => {
    if (!document.getElementById('kitechat-fonts')) {
      const link = document.createElement('link');
      link.id = 'kitechat-fonts';
      link.rel = 'stylesheet';
      link.href = FONT_HREF;
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  const timestamp = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const sendMessage = async () => {
    if (!input.trim() || isSending) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { text: userMsg, sender: 'user', time: timestamp() }]);
    setInput('');
    setIsSending(true);

    try {
      const res = await axios.post('/api/chat', {
        message: userMsg,
        user_id: userId,
      });
      setMessages((prev) => [
        ...prev,
        { text: res.data.response, sender: 'ai', time: timestamp() },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { text: 'Something went wrong: ' + err.message, sender: 'ai', error: true, time: timestamp() },
      ]);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6"
      style={{
        position: 'relative',
        background:
          'radial-gradient(1200px 600px at 15% 0%, #EAF4FF 0%, transparent 55%), radial-gradient(1200px 700px at 100% 20%, #F3ECFF 0%, transparent 50%), linear-gradient(160deg, #FBFAFF 0%, #FFF8F0 100%)',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <style>{`
        @keyframes dotBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        .typing-dot {
          width: 6px; height: 6px; border-radius: 999px;
          background: #2FB6B2;
          display: inline-block;
          animation: dotBounce 1.1s ease-in-out infinite;
        }
        .kc-scroll::-webkit-scrollbar { width: 8px; }
        .kc-scroll::-webkit-scrollbar-track { background: transparent; }
        .kc-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #FF6B4A55, #2FB6B255);
          border-radius: 999px;
        }
        .kc-bubble-in {
          animation: bubbleIn 0.28s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes bubbleIn {
          from { opacity: 0; transform: translateY(6px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .kc-input:focus {
          box-shadow: 0 0 0 3px #2FB6B233;
        }
        .kc-send:active { transform: scale(0.96); }
      `}</style>

      {/* Ambient floating kites, tethered visually to the header via the
          vertical string rendered inside the card */}
      <FloatingKite top="8%" left="12%" size={64} duration={14} />
      <FloatingKite top="22%" left="62%" size={40} duration={18} />
      <FloatingKite top="58%" left="82%" size={50} duration={11} />

      <div
        className="w-full max-w-2xl flex flex-col h-[640px] rounded-[28px] overflow-hidden"
        style={{
          background: '#FFFDF9',
          boxShadow:
            '0 1px 2px rgba(22,35,63,0.04), 0 20px 48px -12px rgba(22,35,63,0.18)',
          border: '1px solid rgba(22,35,63,0.06)',
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 flex items-center justify-between relative"
          style={{
            background: 'linear-gradient(120deg, #16233F 0%, #223159 60%, #2FB6B2 140%)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.12)' }}
            >
              <KiteMark size={22} color="#FF6B4A" />
            </div>
            <div>
              <h1
                className="text-white tracking-tight leading-none"
                style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: '1.35rem' }}
              >
                Kite Chat
              </h1>
              <p className="text-[13px] mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Powered by Gemini&nbsp;2.5&nbsp;Flash
              </p>
            </div>
          </div>
          <div
            className="hidden sm:flex items-center gap-1.5 text-[12px] px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)', fontFamily: "'JetBrains Mono', monospace" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#4ADE80' }}
            />
            online
          </div>
        </div>

        {/* Chat log */}
        <div
          ref={chatBoxRef}
          className="kc-scroll flex-1 overflow-y-auto px-5 py-6 space-y-4 relative"
          style={{
            background:
              'linear-gradient(180deg, #FFFDF9 0%, #FCFAF6 100%)',
          }}
        >
          {/* signature kite-string thread running down the log */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '22px',
              top: 0,
              bottom: 0,
              width: '1px',
              background: 'linear-gradient(180deg, #2FB6B255 0%, transparent 85%)',
            }}
          />

          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3 px-6">
              <KiteMark size={34} color="#FF6B4A" />
              <p
                style={{ fontFamily: "'Fraunces', serif", fontSize: '1.05rem', color: '#16233F' }}
              >
                Send a message and let the conversation take flight.
              </p>
              <p className="text-sm" style={{ color: '#6B7690' }}>
                Ask a question, brainstorm, or just say hello.
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`kc-bubble-in flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} relative`}
            >
              {msg.sender === 'ai' && (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center mr-2 mt-1 shrink-0"
                  style={{ background: msg.error ? '#FEE2E2' : '#E6F7F6' }}
                >
                  <KiteMark size={14} color={msg.error ? '#DC2626' : '#2FB6B2'} />
                </div>
              )}
              <div className={`max-w-[75%] flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className="px-4 py-2.5 text-[14.5px] leading-relaxed"
                  style={
                    msg.sender === 'user'
                      ? {
                          background: 'linear-gradient(135deg, #FF6B4A, #FF8A5C)',
                          color: 'white',
                          borderRadius: '18px 18px 4px 18px',
                          boxShadow: '0 4px 14px -4px rgba(255,107,74,0.45)',
                        }
                      : {
                          background: msg.error ? '#FEF2F2' : '#FFFFFF',
                          color: msg.error ? '#991B1B' : '#16233F',
                          border: `1px solid ${msg.error ? '#FCA5A5' : 'rgba(22,35,63,0.08)'}`,
                          borderRadius: '18px 18px 18px 4px',
                        }
                  }
                >
                  {msg.text}
                </div>
                <span
                  className="text-[11px] mt-1 px-1"
                  style={{ color: '#9AA3B8', fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex justify-start relative">
              <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2 mt-1 shrink-0" style={{ background: '#E6F7F6' }}>
                <KiteMark size={14} color="#2FB6B2" />
              </div>
              <div
                className="px-4 py-2 rounded-[18px_18px_18px_4px]"
                style={{ background: '#FFFFFF', border: '1px solid rgba(22,35,63,0.08)' }}
              >
                <TypingDots />
              </div>
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="px-4 py-3.5 flex items-end gap-2.5" style={{ borderTop: '1px solid rgba(22,35,63,0.08)', background: '#FFFDF9' }}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            className="kc-input flex-1 px-4 py-2.5 rounded-full outline-none transition-shadow duration-150"
            style={{
              border: '1px solid rgba(22,35,63,0.12)',
              background: '#FFFFFF',
              color: '#16233F',
              fontSize: '14.5px',
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isSending}
            className="kc-send flex items-center justify-center rounded-full transition-all duration-150"
            style={{
              width: '44px',
              height: '44px',
              background: !input.trim() || isSending ? '#E5E1DA' : 'linear-gradient(135deg, #FF6B4A, #FF8A5C)',
              boxShadow: !input.trim() || isSending ? 'none' : '0 4px 14px -3px rgba(255,107,74,0.55)',
              cursor: !input.trim() || isSending ? 'default' : 'pointer',
            }}
            aria-label="Send message"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 11.5L20 4L13 21L10.5 13.5L3 11.5Z"
                fill={!input.trim() || isSending ? '#9AA3B8' : 'white'}
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Main;
