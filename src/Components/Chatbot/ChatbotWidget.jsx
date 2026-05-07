import React, { useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { useChat } from "../../context/ChatContext";
import { useLanguage } from "../../context/LanguageContext";

const ChatbotWidget = () => {
  const { isOpen, toggleChat, messages, isLoading, sendMessage } = useChat();
  const { t } = useLanguage();
  const [input, setInput] = React.useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#f5b754] text-black shadow-lg hover:bg-amber-400 transition flex items-center justify-center"
        aria-label="Chat hỗ trợ"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[340px] max-h-[520px] flex flex-col bg-[#1a1a1a] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#f5b754] to-amber-500">
            <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center">
              <Bot size={18} className="text-black" />
            </div>
            <div>
              <p className="font-bold text-black text-sm">{t.chatbot.title}</p>
              <p className="text-black/70 text-xs">{t.chatbot.subtitle}</p>
            </div>
            <button onClick={toggleChat} className="ml-auto text-black/70 hover:text-black transition">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-[#f5b754]/20 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                    <Bot size={12} className="text-[#f5b754]" />
                  </div>
                )}
                <div className={`max-w-[75%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#f5b754] text-black font-medium"
                    : "bg-[#252525] text-gray-200 border border-gray-800"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-[#f5b754]/20 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                  <Bot size={12} className="text-[#f5b754]" />
                </div>
                <div className="bg-[#252525] border border-gray-800 rounded-xl px-3 py-2">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-gray-800 bg-[#141414]">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={t.chatbot.placeholder}
              className="flex-1 bg-[#222] border border-gray-700 rounded-xl px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#f5b754] transition"
            />
            <button type="submit" disabled={!input.trim() || isLoading}
              className="w-9 h-9 rounded-xl bg-[#f5b754] text-black flex items-center justify-center hover:bg-amber-400 transition disabled:opacity-40">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
