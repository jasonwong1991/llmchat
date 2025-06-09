import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import WelcomeScreen from '../components/WelcomeScreen';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';
import socketService from '../services/socket';
import toast from 'react-hot-toast';

const ChatPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { currentConversation, loadConversations, addMessage, setTyping } = useChatStore();
  const { user } = useAuthStore();

  useEffect(() => {
    // Load conversations on mount
    loadConversations();

    // Initialize socket connection
    const initSocket = async () => {
      try {
        await socketService.connect();
        
        // Set up socket event listeners
        socketService.onNewMessage((message) => {
          addMessage(message);
          setTyping(false);
        });

        socketService.onMessageError((error) => {
          toast.error(error.error);
          setTyping(false);
        });

        socketService.onUserTyping((data) => {
          if (data.userId !== user?.id) {
            setTyping(data.isTyping);
          }
        });

      } catch (error) {
        console.error('Socket connection failed:', error);
        toast.error('连接服务器失败，请刷新页面重试');
      }
    };

    initSocket();

    // Cleanup on unmount
    return () => {
      socketService.removeAllListeners();
      socketService.disconnect();
    };
  }, [loadConversations, addMessage, setTyping, user?.id]);

  // Join conversation when current conversation changes
  useEffect(() => {
    if (currentConversation && socketService.isConnected()) {
      socketService.joinConversation(currentConversation.id);
    }
  }, [currentConversation]);

  return (
    <div className="h-screen flex bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative z-20"
      >
        <Sidebar 
          isOpen={isSidebarOpen} 
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {currentConversation ? (
          <ChatArea conversation={currentConversation} />
        ) : (
          <WelcomeScreen />
        )}
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatPage;