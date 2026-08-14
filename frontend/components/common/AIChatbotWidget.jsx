import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, RefreshCw, Sparkles, AlertCircle, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../services/api";

const AIChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I am your Karpagam College of Engineering (KCE) SmartLab AI Assistant. Ask me about equipment availability, lab locations, or our booking workflow!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [isOnline, setIsOnline] = useState(true);

  const chatEndRef = useRef(null);

  // Fetch available models on mount
  useEffect(() => {
    fetchModels();
  }, []);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const fetchModels = async () => {
    try {
      const res = await api.get("/api/business/ai/models");
      const list = res.data || [];
      setModels(list);
      if (list.length > 0) {
        setSelectedModel(list[0]);
      }
      setIsOnline(true);
    } catch (err) {
      console.warn("Could not reach AI service models api:", err);
      setIsOnline(false);
    }
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    // Add user message
    const userMsg = { role: "user", content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    // Build conversation history in correct API format
    const history = messages
      .slice(1) // skip the initial greeting
      .map(m => ({
        role: m.role,
        content: m.content
      }));

    try {
      const res = await api.post("/api/business/ai/chat", {
        message: text,
        history: history,
        model: selectedModel
      });

      const responseText = res.data?.response || "I didn't receive a response from the model.";
      const source = res.data?.source || "AI Engine";
      
      // Update online status based on source
      if (source.includes("Fallback")) {
        setIsOnline(false);
      } else {
        setIsOnline(true);
      }

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: responseText,
          timestamp: new Date(),
          source: source
        }
      ]);
    } catch (err) {
      toast.error("Failed to reach AI Assistant");
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I am currently unable to process your request. Please ensure the local backend services are running and try again.",
          timestamp: new Date(),
          error: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestionChips = [
    "What machines are available?",
    "How does the QR access pass work?",
    "Where is the CAD/Mechatronics lab?",
    "Steps to report a faulty machine"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-gradient-to-r from-orange-500 to-[#cc6926] hover:from-orange-600 hover:to-[#b5581b] rounded-full shadow-2xl flex items-center justify-center text-white cursor-pointer relative border border-orange-400/20"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {/* Status Dot */}
        <span className={`absolute top-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
          isOnline ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
        }`} />
      </motion.button>

      {/* Expanded Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-18 right-0 w-[92vw] sm:w-[400px] h-[550px] bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-950 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-500">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    SmartLab AI
                    <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-500" : "bg-blue-500"}`} />
                    <span className="text-[10px] text-slate-400">
                      {isOnline ? "Google Gemini AI (Online)" : "SmartLab AI Assistant"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-1 ${
                      m.role === "user"
                        ? "bg-orange-600 text-white rounded-tr-none"
                        : m.error
                        ? "bg-red-500/10 border border-red-500/20 text-red-400 rounded-tl-none"
                        : "bg-slate-900 border border-slate-800/80 text-slate-100 rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.content}</p>
                    <div className="flex justify-between items-center text-[9px] text-slate-400 pt-1 mt-1 border-t border-slate-800/50">
                      <span>
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {m.source && (
                        <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[8px] font-mono text-orange-400/80">
                          {m.source}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 border border-slate-800/80 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && !loading && (
              <div className="px-4 py-2 border-t border-slate-800/40 bg-slate-950/50">
                <p className="text-[10px] text-slate-400 mb-2 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-orange-500" />
                  Try asking:
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestionChips.map((chip, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(chip)}
                      className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-800/80 hover:border-orange-500/30 transition text-left cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-4 bg-slate-950 border-t border-slate-800/80 flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about KCE labs..."
                disabled={loading}
                className="flex-1 bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none transition disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl transition cursor-pointer flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChatbotWidget;
