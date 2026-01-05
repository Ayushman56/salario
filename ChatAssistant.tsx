
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User as UserIcon, Sparkles } from 'lucide-react';
import { useChatLogic } from './hooks/useChatLogic';
import { User, CompanyStats, Employee } from './types';

interface ChatAssistantProps {
  user: User | null;
  stats: CompanyStats;
  employees: Employee[];
  onTriggerAddEmployee: () => void;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ 
  user, 
  stats, 
  employees,
  onTriggerAddEmployee 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  
  // Now passing the full employees list for advanced context
  const { messages, sendMessage, isTyping } = useChatLogic(
    user, 
    stats, 
    employees,
    onTriggerAddEmployee
  );
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] print:hidden">
      {/* Floating Trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative w-20 h-20 bg-emerald-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl hover:bg-emerald-700 hover:scale-110 transition-all duration-300 border-4 border-white"
        >
          <MessageSquare size={32} />
          <div className="absolute right-full mr-6 px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap uppercase tracking-widest shadow-xl">
            Ask Salario AI
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[420px] h-[600px] bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-500">
          {/* Header */}
          <div className="p-8 bg-slate-900 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Bot size={24} />
              </div>
              <div>
                <h4 className="text-lg font-black tracking-tight">Salario Intelligence</h4>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Neural Network Active</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-3 hover:bg-white/10 rounded-2xl transition-colors text-slate-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* Message Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth bg-slate-50/30"
          >
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
              >
                <div className={`flex gap-4 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center shadow-sm ${
                    msg.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-400 border border-slate-100'
                  }`}>
                    {msg.role === 'user' ? <UserIcon size={18} /> : <Bot size={18} />}
                  </div>
                  <div className={`px-6 py-4 rounded-[1.8rem] text-sm font-medium leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-emerald-600 text-white rounded-tr-none shadow-emerald-100' 
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                  }`}>
                    {msg.text}
                    {msg.action === 'open_modal' && (
                      <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center gap-2">
                        <Sparkles size={14} className="text-emerald-400" />
                        <span className="text-[10px] font-black uppercase tracking-tighter text-emerald-100">Executing: Enlist Module</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-4 max-w-[90%]">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center">
                    <Bot size={18} />
                  </div>
                  <div className="bg-white px-6 py-4 rounded-[1.8rem] rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                    <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-8 bg-white border-t border-slate-100">
            <div className="flex gap-4">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Inquire about company health..."
                className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-400"
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed transition-all shadow-xl shadow-emerald-200 shrink-0"
              >
                <Send size={22} />
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest mt-4 opacity-50">
              Powered by Salario Intelligence Node
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
