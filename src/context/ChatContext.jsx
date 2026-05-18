import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import api from "../utils/api";
import { useLanguage } from "./LanguageContext";

const ChatContext = createContext(null);

const SESSION_KEY = "chat_session_id";

const readSessionId = () => {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = (crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`);
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
};

export const ChatProvider = ({ children }) => {
  const { t } = useLanguage();
  const tRef = useRef(t);
  useEffect(() => { tRef.current = t; }, [t]);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: t.chatbot.greeting },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const sessionId = useRef(readSessionId());

  // Load past messages on mount (if user had a previous session)
  useEffect(() => {
    let cancelled = false;
    api.get(`/api/chat/session/${sessionId.current}`)
      .then((res) => {
        if (cancelled) return;
        const past = res.data.messages || [];
        if (past.length) {
          setMessages(past.map((m) => ({ role: m.role, content: m.content })));
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const toggleChat = useCallback(() => setIsOpen((p) => !p), []);
  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);

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
        { role: "assistant", content: tRef.current.chatbot.errorReply },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(async () => {
    try {
      await api.delete(`/api/chat/session/${sessionId.current}`);
    } catch {
      // Even if server delete fails, reset client state
    }
    // Generate a fresh session id so the next message starts a new conversation
    try {
      const newId = crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(SESSION_KEY, newId);
      sessionId.current = newId;
    } catch {}
    setMessages([{ role: "assistant", content: tRef.current.chatbot.greeting }]);
  }, []);

  return (
    <ChatContext.Provider value={{ isOpen, messages, isLoading, toggleChat, openChat, closeChat, sendMessage, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
};
