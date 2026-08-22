import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import AssistantMessage from '../components/Assistant/AssistantMessage';
import AssistantInput from '../components/Assistant/AssistantInput';
import { Bot, Trash2, Sparkles } from 'lucide-react';

export default function AssistantPage() {
  const { setTheme } = useTheme();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('careconnect_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved chat history", e);
      }
    }
    return [
      {
        role: 'assistant',
        content: "Hi! I'm your Care Connect AI assistant. I can answer your questions, help you navigate (e.g. 'go to dashboard', 'find a doctor'), or change the theme (e.g., 'switch to dark mode'). What can I help you with today?",
        timestamp: new Date().toISOString()
      }
    ];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem('careconnect_chat_history', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Central frontend action execution handler
  const executeAssistantAction = (action) => {
    if (!action) return;

    console.log("[*] Executing Assistant Action:", action);

    switch (action.type) {
      case 'theme':
        if (action.value === 'dark' || action.value === 'light') {
          setTheme(action.value);
        }
        break;
      case 'navigate':
        navigate(action.value);
        break;
      default:
        console.warn("[!] Unsupported action type:", action.type);
    }
  };

  const handleSendMessage = async (text) => {
    setError(null);
    setLoading(true);

    const userMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await api.assistant.chat(text);
      
      const assistantMessage = {
        role: 'assistant',
        content: res.response || "I couldn't process that request.",
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (res.action) {
        // Execute the action with a brief delay so the user can read the response first
        setTimeout(() => {
          executeAssistantAction(res.action);
        }, 800);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setError("Sorry, I couldn't process that request.");
      
      const assistantErrorMessage = {
        role: 'assistant',
        content: "Sorry, I couldn't process that request.",
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, assistantErrorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      const resetMessages = [
        {
          role: 'assistant',
          content: "Hi! I'm your Care Connect AI assistant. What can I help you with?",
          timestamp: new Date().toISOString()
        }
      ];
      setMessages(resetMessages);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-8rem)] flex flex-col">
      {/* Chat Container Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col flex-1 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                Care Connect Assistant
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-[10px] font-bold text-teal-700 dark:text-teal-400 border border-teal-100 dark:border-teal-900">
                  <Sparkles className="w-2.5 h-2.5" />
                  QWEN-AI
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Ask questions, change themes, or navigate</p>
            </div>
          </div>

          <button
            onClick={handleClearChat}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
            title="Clear Chat History"
            aria-label="Clear chat history"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-slate-50/20 dark:bg-slate-950/5">
          {messages.map((msg, index) => (
            <AssistantMessage key={index} message={msg} />
          ))}

          {/* Typing Loading Indicator */}
          {loading && (
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 text-teal-600 dark:bg-teal-950/30 dark:border-teal-900/50 dark:text-teal-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-850 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5">
                <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900">
          <AssistantInput onSendMessage={handleSendMessage} disabled={loading} />
          <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-2.5 leading-relaxed">
            AI responses may execute automatic navigation or UI modifications based on intent.
          </p>
        </div>
      </div>
    </div>
  );
}
