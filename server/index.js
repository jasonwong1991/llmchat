const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'your-secret-key-change-in-production';

// 数据存储路径
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const CONVERSATIONS_FILE = path.join(DATA_DIR, 'conversations.json');

// 中间件
app.use(cors());
app.use(express.json());

// 确保数据目录存在
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// 读取用户数据
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// 写入用户数据
async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

// 读取对话数据
async function readConversations() {
  try {
    const data = await fs.readFile(CONVERSATIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// 写入对话数据
async function writeConversations(conversations) {
  await fs.writeFile(CONVERSATIONS_FILE, JSON.stringify(conversations, null, 2));
}

// JWT验证中间件
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// 模拟AI响应生成器
function generateAIResponse(message, context = []) {
  const responses = [
    "这是一个很有趣的问题。让我来分析一下...",
    "根据你提供的信息，我认为...",
    "我理解你的观点。从另一个角度来看...",
    "这让我想到了一个相关的概念...",
    "你提出了一个很好的问题。让我详细解释一下...",
    "基于我的理解，这个问题可以这样看待...",
    "我注意到你之前提到了相关的内容，让我结合起来回答...",
    "这是一个复杂的话题，让我们一步步来分析..."
  ];

  // 简单的情感分析
  const emotionalWords = {
    positive: ['开心', '高兴', '喜欢', '好', '棒', '优秀', '完美'],
    negative: ['难过', '生气', '讨厌', '坏', '糟糕', '失望', '沮丧'],
    question: ['什么', '为什么', '怎么', '如何', '?', '？']
  };

  let emotion = 'neutral';
  const lowerMessage = message.toLowerCase();
  
  if (emotionalWords.positive.some(word => lowerMessage.includes(word))) {
    emotion = 'positive';
  } else if (emotionalWords.negative.some(word => lowerMessage.includes(word))) {
    emotion = 'negative';
  } else if (emotionalWords.question.some(word => lowerMessage.includes(word))) {
    emotion = 'question';
  }

  let baseResponse = responses[Math.floor(Math.random() * responses.length)];
  
  // 根据情感调整回复
  switch (emotion) {
    case 'positive':
      baseResponse = "我很高兴听到你这么说！" + baseResponse;
      break;
    case 'negative':
      baseResponse = "我理解你的感受，让我来帮助你。" + baseResponse;
      break;
    case 'question':
      baseResponse = "这是一个很好的问题！" + baseResponse;
      break;
  }

  return {
    text: baseResponse + " 你还有其他想了解的吗？",
    emotion: emotion,
    confidence: Math.random() * 0.3 + 0.7 // 0.7-1.0
  };
}

// 内容安全过滤器
function moderateContent(text) {
  const bannedWords = ['spam', '垃圾', '广告', '违法'];
  const lowerText = text.toLowerCase();
  
  for (const word of bannedWords) {
    if (lowerText.includes(word)) {
      return {
        safe: false,
        reason: '内容包含不当词汇'
      };
    }
  }
  
  return { safe: true };
}

// 用户注册
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: '所有字段都是必需的' });
    }

    const users = await readUsers();
    
    // 检查用户是否已存在
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: '用户已存在' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      settings: {
        theme: 'light',
        language: 'zh-CN',
        aiPersonality: 'friendly'
      }
    };

    users.push(newUser);
    await writeUsers(users);

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        settings: newUser.settings
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 用户登录
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码都是必需的' });
    }

    const users = await readUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(400).json({ error: '用户不存在' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: '密码错误' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        settings: user.settings
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取对话历史
app.get('/api/conversations', authenticateToken, async (req, res) => {
  try {
    const conversations = await readConversations();
    const userConversations = conversations.filter(c => c.userId === req.user.userId);
    res.json(userConversations);
  } catch (error) {
    console.error('获取对话历史错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 创建新对话
app.post('/api/conversations', authenticateToken, async (req, res) => {
  try {
    const { title } = req.body;
    const conversations = await readConversations();
    
    const newConversation = {
      id: uuidv4(),
      userId: req.user.userId,
      title: title || '新对话',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    conversations.push(newConversation);
    await writeConversations(conversations);
    
    res.json(newConversation);
  } catch (error) {
    console.error('创建对话错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// Socket.IO 连接处理
io.on('connection', (socket) => {
  console.log('用户连接:', socket.id);

  socket.on('join-conversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`用户 ${socket.id} 加入对话 ${conversationId}`);
  });

  socket.on('send-message', async (data) => {
    try {
      const { conversationId, message, userId } = data;
      
      // 内容审核
      const moderation = moderateContent(message);
      if (!moderation.safe) {
        socket.emit('message-error', { error: moderation.reason });
        return;
      }

      const conversations = await readConversations();
      const conversationIndex = conversations.findIndex(c => c.id === conversationId);
      
      if (conversationIndex === -1) {
        socket.emit('message-error', { error: '对话不存在' });
        return;
      }

      const userMessage = {
        id: uuidv4(),
        type: 'user',
        content: message,
        timestamp: new Date().toISOString()
      };

      conversations[conversationIndex].messages.push(userMessage);
      conversations[conversationIndex].updatedAt = new Date().toISOString();

      // 发送用户消息
      io.to(conversationId).emit('new-message', userMessage);

      // 生成AI回复
      setTimeout(async () => {
        const context = conversations[conversationIndex].messages.slice(-5); // 最近5条消息作为上下文
        const aiResponse = generateAIResponse(message, context);
        
        const aiMessage = {
          id: uuidv4(),
          type: 'ai',
          content: aiResponse.text,
          emotion: aiResponse.emotion,
          confidence: aiResponse.confidence,
          timestamp: new Date().toISOString()
        };

        conversations[conversationIndex].messages.push(aiMessage);
        await writeConversations(conversations);

        io.to(conversationId).emit('new-message', aiMessage);
      }, 1000 + Math.random() * 2000); // 1-3秒延迟模拟思考时间

    } catch (error) {
      console.error('发送消息错误:', error);
      socket.emit('message-error', { error: '发送消息失败' });
    }
  });

  socket.on('typing', (data) => {
    socket.to(data.conversationId).emit('user-typing', {
      userId: data.userId,
      isTyping: data.isTyping
    });
  });

  socket.on('disconnect', () => {
    console.log('用户断开连接:', socket.id);
  });
});

// 启动服务器
async function startServer() {
  await ensureDataDir();
  server.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
  });
}

startServer().catch(console.error);