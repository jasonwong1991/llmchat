import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles, Brain, Shield, Zap, Users } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import toast from 'react-hot-toast';

const WelcomeScreen: React.FC = () => {
  const { createConversation } = useChatStore();

  const handleStartChat = async () => {
    try {
      await createConversation('新的智能对话');
      toast.success('对话已开始！');
    } catch (error) {
      toast.error('创建对话失败');
    }
  };

  const features = [
    {
      icon: Brain,
      title: '智能理解',
      description: '深度理解语境和情感，提供更贴心的回复',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Sparkles,
      title: '情感分析',
      description: '实时分析对话情感，调整回复风格和语气',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Shield,
      title: '内容安全',
      description: '智能内容审核，确保对话环境安全健康',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: '实时响应',
      description: '毫秒级响应速度，流畅的对话体验',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Users,
      title: '个性化',
      description: '根据用户偏好定制AI个性和对话风格',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: MessageCircle,
      title: '上下文记忆',
      description: '记住对话历史，提供连贯的多轮对话',
      color: 'from-rose-500 to-pink-500'
    }
  ];

  const quickStarters = [
    '你好，我想了解一下AI技术',
    '帮我分析一下今天的心情',
    '推荐一些学习资源',
    '聊聊最近的科技趋势',
    '我需要一些创意灵感',
    '解释一个复杂的概念'
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              className="relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <motion.div
                className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-3 h-3 text-white" />
              </motion.div>
            </motion.div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            欢迎使用 
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {' '}LLMChater
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            智能对话系统，理解情感与语境，为您提供个性化的AI对话体验
          </p>
          
          <motion.button
            onClick={handleStartChat}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            开始智能对话
          </motion.button>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
              whileHover={{ y: -5 }}
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Starters */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">快速开始对话</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {quickStarters.map((starter, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  handleStartChat();
                  // You could also pre-fill the message here
                }}
                className="text-left p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200 hover:bg-white/80 hover:border-indigo-300 transition-all duration-200 text-gray-700 hover:text-indigo-600"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <span className="text-sm">"{starter}"</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex items-center justify-center space-x-8 text-gray-600"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">99.9%</div>
            <div className="text-sm">响应准确率</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">&lt;100ms</div>
            <div className="text-sm">平均响应时间</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">24/7</div>
            <div className="text-sm">全天候服务</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomeScreen;