import React from 'react';
import { Bot } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AssistantFloatingButton() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide the floating assistant button if we are already on the assistant page
  if (location.pathname === '/assistant') {
    return null;
  }

  return (
    <button
      onClick={() => navigate('/assistant')}
      className="fixed bottom-6 right-6 z-50 p-4 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-lg hover:shadow-teal-500/30 transition-all flex items-center justify-center group"
      aria-label="Open AI Assistant"
      title="Chat with AI Assistant"
    >
      <Bot className="w-6 h-6 animate-pulse" style={{ animationDuration: '3s' }} />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-bold">
        AI Assistant
      </span>
    </button>
  );
}
