
import { useState, useCallback, useEffect } from 'react';
import { User, CompanyStats, Employee } from '../types';
import { GeminiSupportService } from '../services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
  action?: 'open_modal';
}

export const useChatLogic = (
  user: User | null, 
  stats: CompanyStats, 
  employees: Employee[],
  onTriggerAddEmployee: () => void
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const geminiService = new GeminiSupportService();

  // Initial greeting
  useEffect(() => {
    if (user && messages.length === 0) {
      setMessages([
        {
          id: 'initial',
          role: 'bot',
          text: `Hello ${user.username}! Salario Intelligence Node is online. I've indexed ${employees.length} employee records and current budget metrics. How can I assist your administration today?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [user, messages.length, employees.length]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !user) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const lowercaseText = text.toLowerCase();
      let triggerAction: 'open_modal' | undefined;
      
      // Keywords for UI triggers
      if (
        lowercaseText.includes("add employee") || 
        lowercaseText.includes("new employee") || 
        lowercaseText.includes("onboard")
      ) {
        triggerAction = 'open_modal';
        setTimeout(onTriggerAddEmployee, 1500);
      }

      // Get advanced context-aware response
      const aiResponse = await geminiService.getSupportResponse(text, stats, user.username, employees);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: aiResponse,
        timestamp: new Date(),
        action: triggerAction
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: "I encountered a synchronization error with the workforce database. Please check your connection.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [user, stats, employees, onTriggerAddEmployee]);

  return {
    messages,
    sendMessage,
    isTyping,
  };
};
