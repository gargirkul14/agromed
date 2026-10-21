import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import {
  BotMessageSquare,
  User,
  Send,
  Trash2,
  Sparkles,
  Loader2,
  AlertCircle,
  PhoneCall
} from 'lucide-react';

const SUGGESTIONS = [
  'I sprayed pesticides today and now I feel dizzy.',
  'What precautions should I take while spraying pesticides?',
  'What should I do if fertilizer touches my skin?',
  'How can I prevent heatstroke in the field?'
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Namaste! I am AgroMed AI, your farmer health and occupational safety assistant. How can I help you protect your health today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chat', { message: query });
      if (res.data?.success && res.data.chat) {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: res.data.chat.aiResponse }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, but I am having trouble connecting to the safety server right now. If you are experiencing serious discomfort or chemical exposure symptoms, please visit a primary health center or call 108 immediately.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Conversation history cleared. How can I assist you with farming health and safety?'
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-green-600 text-white flex items-center justify-center">
            <BotMessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900">Ask AgroMed AI Assistant</h2>
            <p className="text-[11px] text-slate-400">Powered by Google Gemini • Dedicated to farmer occupational safety</p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-slate-50 transition"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Suggestion Chips */}
      <div className="flex flex-wrap gap-2 text-xs">
        {SUGGESTIONS.map((sug, i) => (
          <button
            key={i}
            onClick={() => handleSend(sug)}
            className="px-3 py-1.5 rounded-xl bg-green-50 border border-green-200 text-green-800 hover:bg-green-100 font-semibold transition text-left"
          >
            💡 {sug}
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
        
        {/* Messages list */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser ? 'bg-slate-900 text-white' : 'bg-green-600 text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <BotMessageSquare className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl p-4 leading-relaxed font-medium ${
                    isUser
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-800 whitespace-pre-line'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-green-600" />
              <span>AgroMed AI is formulating safety guidance...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your farming health question (e.g. chemical rash, heat exhaustion, mask types)..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs shadow-sm transition disabled:opacity-50 flex items-center space-x-1.5"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </form>

      </div>

      {/* Medical Alert Footer */}
      <p className="text-[11px] text-slate-400 text-center italic">
        AgroMed AI provides educational occupational safety guidance and does not replace medical diagnosis. In critical situations, call emergency hotline <strong>108 / 112</strong>.
      </p>

    </div>
  );
}
