import React from 'react';
import { Bot, User } from 'lucide-react';

export default function AssistantMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''} mb-4`}>
      {/* Avatar Icon */}
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
        isUser
          ? 'bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
          : 'bg-teal-50 border-teal-100 text-teal-600 dark:bg-teal-950/30 dark:border-teal-900/50 dark:text-teal-400'
      }`}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Bubble */}
      <div className="max-w-[75%] space-y-1">
        <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-teal-600 text-white font-medium rounded-tr-none'
            : 'bg-slate-100 border border-slate-200/60 text-slate-800 rounded-tl-none dark:bg-slate-850 dark:border-slate-750 dark:text-slate-200'
        }`}>
          {message.content}
        </div>
        
        {/* Timestamp */}
        <p className={`text-[10px] text-slate-400 dark:text-slate-500 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
        </p>
      </div>
    </div>
  );
}
