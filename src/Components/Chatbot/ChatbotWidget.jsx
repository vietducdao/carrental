import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, X, Send, Bot, RefreshCw, User as UserIcon } from "lucide-react";
import { useChat } from "../../context/ChatContext";
import { useLanguage } from "../../context/LanguageContext";

// Parse simple markdown links: [label](url) → clickable element.
// Internal paths (starting with "/") render as React Router <Link>, external as <a target="_blank">.
const renderRich = (text, onLinkClick) => {
  if (!text) return null;
  const parts = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={`t-${key++}`}>{text.slice(lastIndex, match.index)}</span>);
    }
    const [, label, href] = match;
    const isInternal = href.startsWith("/");
    if (isInternal) {
      parts.push(
        <Link
          key={`l-${key++}`}
          to={href}
          onClick={onLinkClick}
          className="underline decoration-dotted underline-offset-2 font-semibold hover:opacity-80 transition"
        >
          {label}
        </Link>
      );
    } else {
      parts.push(
        <a
          key={`l-${key++}`}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="underline decoration-dotted underline-offset-2 font-semibold hover:opacity-80 transition"
        >
          {label}
        </a>
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(<span key={`t-${key++}`}>{text.slice(lastIndex)}</span>);
  }
  return parts;
};

const ChatbotWidget = () => {
  const { isOpen, toggleChat, closeChat, messages, isLoading, sendMessage, clearChat } = useChat();
  // Auto-close chat when user clicks a link inside a message
  const handleLinkClick = () => closeChat();
  const { t } = useLanguage();
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-focus input when the widget opens
  useEffect(() => {
    if (isOpen) {
      const id = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(id);
    }
  }, [isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    await sendMessage(text);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) handleSend(e);
  };

  // Quick suggestions — only show before the user has sent anything
  const showSuggestions = messages.length <= 1 && !isLoading;
  const suggestions = [
    t.chatbot.suggestCars || "Tôi muốn thuê xe SUV cho gia đình",
    t.chatbot.suggestPrice || "Bảng giá thuê xe tự lái",
    t.chatbot.suggestBooking || "Cách đặt xe?",
    t.chatbot.suggestContact || "Liên hệ tư vấn",
  ];

  const handleClear = async () => {
    if (!window.confirm(t.chatbot.confirmClear || "Xóa toàn bộ cuộc trò chuyện?")) return;
    await clearChat();
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#f5b754] text-black shadow-lg hover:bg-amber-400 transition flex items-center justify-center"
        aria-label={t.chatbot.title}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[360px] max-h-[calc(100vh-8rem)] sm:max-h-[600px] flex flex-col bg-[#1a1a1a] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#f5b754] to-amber-500">
            <div className="w-9 h-9 rounded-full bg-black/20 flex items-center justify-center relative">
              <Bot size={18} className="text-black" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#f5b754] rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-black text-sm truncate">{t.chatbot.title}</p>
              <p className="text-black/70 text-[11px] truncate">{t.chatbot.subtitle}</p>
            </div>
            <button
              onClick={handleClear}
              title={t.chatbot.clear || "Xóa lịch sử"}
              className="p-1.5 text-black/70 hover:text-black hover:bg-black/10 rounded-lg transition"
            >
              <RefreshCw size={15} />
            </button>
            <button
              onClick={closeChat}
              title={t.chatbot.close || "Đóng"}
              className="p-1.5 text-black/70 hover:text-black hover:bg-black/10 rounded-lg transition"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 scroll-smooth">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-[#f5b754]/20 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                    <Bot size={13} className="text-[#f5b754]" />
                  </div>
                )}
                <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                  msg.role === "user"
                    ? "bg-[#f5b754] text-black font-medium rounded-br-sm"
                    : "bg-[#252525] text-gray-200 border border-gray-800 rounded-bl-sm"
                }`}>
                  {msg.role === "assistant" ? renderRich(msg.content, handleLinkClick) : msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-[#f5b754]/30 flex items-center justify-center ml-2 flex-shrink-0 mt-0.5">
                    <UserIcon size={13} className="text-[#f5b754]" />
                  </div>
                )}
              </div>
            ))}

            {/* Quick suggestion chips before first user message */}
            {showSuggestions && (
              <div className="flex flex-wrap gap-1.5 pt-1 pl-9">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => sendMessage(s)}
                    className="text-xs px-3 py-1.5 rounded-full bg-[#252525] border border-[#f5b754]/30 text-gray-300 hover:bg-[#f5b754]/10 hover:border-[#f5b754]/60 hover:text-white transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-[#f5b754]/20 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                  <Bot size={13} className="text-[#f5b754]" />
                </div>
                <div className="bg-[#252525] border border-gray-800 rounded-2xl rounded-bl-sm px-3.5 py-2.5">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-gray-800 bg-[#141414]">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={t.chatbot.placeholder}
              disabled={isLoading}
              className="flex-1 bg-[#222] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#f5b754] transition disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-[#f5b754] text-black flex items-center justify-center hover:bg-amber-400 transition disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              aria-label={t.chatbot.send || "Gửi"}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
