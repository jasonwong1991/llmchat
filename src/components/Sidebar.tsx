import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Plus, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Trash2,
  Edit3,
  Clock
} from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { 
    conversations, 
    currentConversation, 
    setCurrentConversation, 
    createConversation,
    isLoading 
  } = useChatStore();
  const { user, logout } = useAuthStore();
  const [showSettings, setShowSettings] = useState(false);

  const handleNewChat = async () => {
    try {
      await createConversation();
      toast.success('新对话已创建');
    } catch (error) {
      toast.error('创建对话失败');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('已退出登录');
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: zhCN 
      });
    } catch {
      return '刚刚';
    }
  };

  return (
    <>
      <motion.div
        className={`h-full bg-white/90 backdrop-blur-sm border-r border-gray-200 flex flex-col shadow-lg ${
          isOpen ? 'w-80' : 'w-16'
        } transition-all duration-300`}
        initial={false}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center"
                >
                  <MessageCircle className="w-8 h-8 text-indigo-600 mr-3" />
                  <h1 className="text-xl font-bold text-gray-800">LLMChater</h1>
                </motion.div>
              )}
            </AnimatePresence>
            
            <button
              onClick={onToggle}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <motion.button
            onClick={handleNewChat}
            disabled={isLoading}
            className={`w-full flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg py-3 px-4 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 ${
              !isOpen ? 'px-2' : ''
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" />
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="ml-2 whitespace-nowrap"
                >
                  新对话
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-4">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                {conversations.map((conversation) => (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`group p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      currentConversation?.id === conversation.id
                        ? 'bg-indigo-50 border border-indigo-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setCurrentConversation(conversation)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 truncate">
                          {conversation.title}
                        </h3>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTime(conversation.updatedAt)}
                        </div>
                        {conversation.messages.length > 0 && (
                          <p className="text-sm text-gray-600 mt-1 truncate">
                            {conversation.messages[conversation.messages.length - 1].content}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button className="p-1 hover:bg-red-100 rounded text-red-600">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {conversations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>还没有对话记录</p>
                    <p className="text-sm">点击上方按钮开始新对话</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile & Settings */}
        <div className="p-4 border-t border-gray-200">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="space-y-2"
              >
                <div className="flex items-center p-2 rounded-lg bg-gray-50">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{user?.username}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="flex-1 flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    设置
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="flex-1 flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    退出
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {!isOpen && (
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleLogout}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">设置</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    主题
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg">
                    <option>浅色模式</option>
                    <option>深色模式</option>
                    <option>自动</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    语言
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg">
                    <option>中文</option>
                    <option>English</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI 个性
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg">
                    <option>友好</option>
                    <option>专业</option>
                    <option>幽默</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    setShowSettings(false);
                    toast.success('设置已保存');
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  保存
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;