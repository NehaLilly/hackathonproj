import { useState, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  suggestions?: string[];
}

export interface ChatBotState {
  messages: ChatMessage[];
  isTyping: boolean;
  isOpen: boolean;
}

export const useChatBot = () => {
  const [state, setState] = useState<ChatBotState>({
    messages: [],
    isTyping: false,
    isOpen: false
  });

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));
  }, []);

  const setTyping = useCallback((isTyping: boolean) => {
    setState(prev => ({ ...prev, isTyping }));
  }, []);

  const setOpen = useCallback((isOpen: boolean) => {
    setState(prev => ({ ...prev, isOpen }));
  }, []);

  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, messages: [] }));
  }, []);

  return {
    ...state,
    addMessage,
    setTyping,
    setOpen,
    clearMessages
  };
};