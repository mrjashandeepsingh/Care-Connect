import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function AssistantInput({ onSendMessage, disabled }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSendMessage(text.trim());
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        placeholder={disabled ? "Waiting for AI response..." : "Type your message here..."}
        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 text-sm bg-white dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-500 disabled:bg-slate-50 dark:disabled:bg-slate-950 transition-all"
        maxLength={500}
      />
      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className="p-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 transition-colors flex items-center justify-center"
        title="Send message"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}
