import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, MessageCircle, Sparkles, Lock, Mail, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const { login, register, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('登录成功！');
      } else {
        await register(formData.username, formData.email, formData.password);
        toast.success('注册成功！');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '操作失败');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex rounded-2xl shadow-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
        {/* Left Panel - Branding */}
        <motion.div 
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-12 flex-col justify-center items-center text-white relative overflow-hidden"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center">
            <motion.div
              className="flex items-center justify-center mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <MessageCircle className="w-16 h-16 mr-4" />
              <h1 className="text-4xl font-bold">LLMChater</h1>
            </motion.div>
            
            <motion.p 
              className="text-xl mb-8 opacity-90"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 0.9 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              智能对话系统
            </motion.p>
            
            <motion.div 
              className="space-y-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="flex items-center text-lg">
                <Sparkles className="w-6 h-6 mr-3" />
                <span>智能情感分析</span>
              </div>
              <div className="flex items-center text-lg">
                <MessageCircle className="w-6 h-6 mr-3" />
                <span>多轮对话记忆</span>
              </div>
              <div className="flex items-center text-lg">
                <Lock className="w-6 h-6 mr-3" />
                <span>安全内容审核</span>
              </div>
            </motion.div>
          </div>
          
          {/* Floating Elements */}
          <motion.div
            className="absolute top-20 left-20 w-20 h-20 bg-white/10 rounded-full"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-16 h-16 bg-white/10 rounded-full"
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </motion.div>

        {/* Right Panel - Form */}
        <motion.div 
          className="w-full lg:w-1/2 p-12 flex flex-col justify-center"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-md mx-auto w-full">
            <motion.div 
              className="text-center mb-8"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {isLogin ? '欢迎回来' : '创建账户'}
              </h2>
              <p className="text-gray-600">
                {isLogin ? '登录到您的智能对话助手' : '开始您的AI对话之旅'}
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    用户名
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="请输入用户名"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  邮箱地址
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="请输入邮箱地址"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="请输入密码"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {isLogin ? '登录中...' : '注册中...'}
                  </div>
                ) : (
                  isLogin ? '登录' : '注册'
                )}
              </motion.button>
            </form>

            <motion.div 
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <p className="text-gray-600">
                {isLogin ? '还没有账户？' : '已有账户？'}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    clearError();
                    setFormData({ username: '', email: '', password: '' });
                  }}
                  className="ml-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                >
                  {isLogin ? '立即注册' : '立即登录'}
                </button>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;