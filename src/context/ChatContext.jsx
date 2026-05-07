import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import api from "../utils/api";
import { useLanguage } from "./LanguageContext";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: t.chatbot.greeting }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const sessionId = useRef(crypto.randomUUID());

  const toggleChat = useCallback(() => setIsOpen((p) => !p), []);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    try {
      const res = await api.post("/api/chat/message", {
        message: text.trim(),
        sessionId: sessionId.current,
      });
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t.chatbot.errorReply },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <ChatContext.Provider value={{ isOpen, messages, isLoading, toggleChat, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
};
