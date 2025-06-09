import { create } from 'zustand';

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  emotion?: string;
  confidence?: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  isTyping: boolean;
  error: string | null;
  
  // Actions
  setConversations: (conversations: Conversation[]) => void;
  setCurrentConversation: (conversation: Conversation | null) => void;
  addMessage: (message: Message) => void;
  createConversation: (title?: string) => Promise<Conversation>;
  loadConversations: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setTyping: (typing: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  isLoading: false,
  isTyping: false,
  error: null,

  setConversations: (conversations) => set({ conversations }),
  
  setCurrentConversation: (conversation) => set({ currentConversation: conversation }),
  
  addMessage: (message) => {
    const { currentConversation } = get();
    if (currentConversation) {
      const updatedConversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, message],
        updatedAt: new Date().toISOString(),
      };
      set({ currentConversation: updatedConversation });
      
      // Update in conversations list
      const { conversations } = get();
      const updatedConversations = conversations.map(conv =>
        conv.id === currentConversation.id ? updatedConversation : conv
      );
      set({ conversations: updatedConversations });
    }
  },

  createConversation: async (title = '新对话') => {
    const token = localStorage.getItem('auth-storage');
    if (!token) throw new Error('未登录');

    const authData = JSON.parse(token);
    const response = await fetch('http://localhost:3001/api/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.state.token}`,
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      throw new Error('创建对话失败');
    }

    const newConversation = await response.json();
    const { conversations } = get();
    set({ 
      conversations: [newConversation, ...conversations],
      currentConversation: newConversation 
    });
    
    return newConversation;
  },

  loadConversations: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('auth-storage');
      if (!token) throw new Error('未登录');

      const authData = JSON.parse(token);
      const response = await fetch('http://localhost:3001/api/conversations', {
        headers: {
          'Authorization': `Bearer ${authData.state.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('加载对话失败');
      }

      const conversations = await response.json();
      set({ conversations, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '加载对话失败',
        isLoading: false 
      });
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setTyping: (typing) => set({ isTyping: typing }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));