import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  MessageSquare,
  Search,
  ArrowLeft,
  Trash2,
  User as UserIcon,
  Bot,
  Clock,
  Hash,
  Mail,
  Loader2,
} from "lucide-react";
import api from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";
import { styles } from "../../assets/adminStyles";
import Pagination from "./Pagination";

const AdminChatPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { lang, t } = useLanguage();
  const bottomRef = useRef(null);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/chat/sessions");
      setSessions(res.data.sessions || []);
    } catch (err) {
      toast.error(err.response?.data?.message || t.admin.chat.loadError);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const openSession = async (session) => {
    setActiveSession(session);
    setLoadingMessages(true);
    try {
      const res = await api.get(`/api/chat/history/${session.sessionId}`);
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error(err.response?.data?.message || t.admin.chat.loadError);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (!loadingMessages && messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loadingMessages]);

  const handleDelete = async () => {
    if (!activeSession) return;
    if (!window.confirm(t.admin.chat.deleteConfirm)) return;
    try {
      setDeleting(true);
      await api.delete(`/api/chat/sessions/${activeSession.sessionId}`);
      setSessions((prev) => prev.filter((s) => s.sessionId !== activeSession.sessionId));
      setActiveSession(null);
      setMessages([]);
      toast.success(t.admin.chat.deleted);
    } catch (err) {
      toast.error(err.response?.data?.message || t.admin.common.error);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sessions;
    return sessions.filter((s) => {
      const name = s.userInfo?.name?.toLowerCase() || "";
      const email = s.userInfo?.email?.toLowerCase() || "";
      const sid = s.sessionId.toLowerCase();
      return name.includes(q) || email.includes(q) || sid.includes(q);
    });
  }, [sessions, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize]);

  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filtered, currentPage, pageSize]
  );

  const fmtDateTime = (d) => d ? new Date(d).toLocaleString(lang === "vi" ? "vi-VN" : "en-US") : "—";

  // Conversation view
  if (activeSession) {
    return (
      <div className="space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setActiveSession(null); setMessages([]); }}
              className={styles.buttonSecondary + " px-4 flex items-center gap-2"}
            >
              <ArrowLeft size={14} /> {t.admin.chat.backToList}
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <MessageSquare size={20} className="text-orange-500" />
                {activeSession.userInfo?.name || t.admin.chat.guest}
              </h1>
              <p className="text-xs text-gray-500 mt-1 font-mono flex items-center gap-2">
                <Hash size={11} className="text-orange-500/70" />
                {activeSession.sessionId.slice(0, 8)}...{activeSession.sessionId.slice(-4)}
                {activeSession.userInfo?.email && (
                  <>
                    <span className="text-gray-700">•</span>
                    <Mail size={11} className="text-orange-500/70" />
                    {activeSession.userInfo.email}
                  </>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-bold uppercase tracking-widest transition flex items-center gap-2 disabled:opacity-50"
          >
            {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            {t.admin.chat.deleteSession}
          </button>
        </div>

        <div className={`${styles.glassDark} rounded-2xl border border-white/5 shadow-2xl overflow-hidden`}>
          {loadingMessages ? (
            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" /></div>
          ) : messages.length === 0 ? (
            <div className="text-center py-20 text-gray-500 leading-relaxed uppercase tracking-widest font-bold text-[10px]">
              {t.admin.common.noResults}
            </div>
          ) : (
            <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-4">
              {messages.map((msg) => (
                <div key={msg._id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    msg.role === "user"
                      ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                      : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  }`}>
                    {msg.role === "user" ? <UserIcon size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`flex-1 max-w-[70%] ${msg.role === "user" ? "text-right" : ""}`}>
                    <div className="flex items-center gap-2 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500"
                         style={{ justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                      <span className={msg.role === "user" ? "text-orange-400" : "text-blue-400"}>
                        {msg.role === "user" ? t.admin.chat.userLabel : t.admin.chat.assistantLabel}
                      </span>
                      <Clock size={10} className="opacity-60" />
                      <span className="font-normal normal-case tracking-normal">{fmtDateTime(msg.createdAt)}</span>
                    </div>
                    <div className={`inline-block px-4 py-3 rounded-2xl text-sm leading-relaxed text-left ${
                      msg.role === "user"
                        ? "bg-orange-500/10 border border-orange-500/20 text-white rounded-tr-sm"
                        : "bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">{t.admin.chat.title}</h1>
        <p className="text-sm text-gray-500 mt-1">{t.admin.chat.subtitle}</p>
      </div>

      <div className={`${styles.glassDark} p-4 rounded-2xl border border-white/5`}>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3.5 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.admin.chat.searchPlaceholder}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-gray-200 focus:outline-none focus:border-orange-500/50 transition placeholder:text-gray-600"
          />
        </div>
      </div>

      <div className={`${styles.glassDark} rounded-2xl border border-white/5 shadow-2xl overflow-hidden`}>
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <MessageSquare className="mx-auto text-gray-700 mb-4 opacity-20" size={64} />
            <p className="uppercase tracking-widest font-bold text-[10px]">{t.admin.chat.empty}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className={styles.tableHeader}>{t.admin.users.table.identity}</th>
                    <th className={styles.tableHeader}>{t.admin.chat.sessionId}</th>
                    <th className={styles.tableHeader}>{t.admin.chat.messages}</th>
                    <th className={styles.tableHeader}>Preview</th>
                    <th className={styles.tableHeader}>{t.admin.chat.lastActivity}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginated.map((s) => (
                    <tr
                      key={s.sessionId}
                      onClick={() => openSession(s)}
                      className="hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <td className={styles.tableCell}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold border shadow-lg uppercase ${
                            s.userInfo
                              ? "bg-gradient-to-br from-orange-500 to-amber-600 border-orange-500/30"
                              : "bg-gradient-to-br from-gray-700 to-gray-800 border-white/5"
                          }`}>
                            {s.userInfo?.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">
                              {s.userInfo?.name || (
                                <span className="italic text-gray-500">{t.admin.chat.guest}</span>
                              )}
                            </p>
                            <p className="text-[10px] text-gray-500">{s.userInfo?.email || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className={styles.tableCell}>
                        <span className="text-[10px] font-mono text-gray-500">
                          {s.sessionId.slice(0, 8)}...{s.sessionId.slice(-4)}
                        </span>
                      </td>
                      <td className={styles.tableCell}>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border border-orange-500/20 bg-orange-500/10 text-orange-400">
                          {s.messageCount} {t.admin.chat.messages}
                        </span>
                      </td>
                      <td className={styles.tableCell + " max-w-md"}>
                        <p className="text-xs text-gray-400 truncate italic">
                          {s.lastRole === "user" ? "👤" : "🤖"} {s.lastMessage}
                        </p>
                      </td>
                      <td className={styles.tableCell}>
                        <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                          <Clock size={11} className="text-orange-500/70" />
                          {fmtDateTime(s.lastAt)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalItems={filtered.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
};

export default AdminChatPage;
