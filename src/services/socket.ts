import { io, Socket } from 'socket.io-client';
import { Message } from '../store/chatStore';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io('http://localhost:3001', {
          transports: ['websocket'],
          timeout: 20000,
        });

        this.socket.on('connect', () => {
          console.log('Socket connected:', this.socket?.id);
          this.reconnectAttempts = 0;
          resolve();
        });

        this.socket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
          if (reason === 'io server disconnect') {
            // Server disconnected, try to reconnect
            this.reconnect();
          }
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          this.reconnect();
          reject(error);
        });

      } catch (error) {
        console.error('Socket connection failed:', error);
        reject(error);
      }
    });
  }

  private reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch(console.error);
      }, 1000 * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinConversation(conversationId: string) {
    if (this.socket) {
      this.socket.emit('join-conversation', conversationId);
    }
  }

  sendMessage(conversationId: string, message: string, userId: string) {
    if (this.socket) {
      this.socket.emit('send-message', {
        conversationId,
        message,
        userId,
      });
    }
  }

  onNewMessage(callback: (message: Message) => void) {
    if (this.socket) {
      this.socket.on('new-message', callback);
    }
  }

  onMessageError(callback: (error: { error: string }) => void) {
    if (this.socket) {
      this.socket.on('message-error', callback);
    }
  }

  onUserTyping(callback: (data: { userId: string; isTyping: boolean }) => void) {
    if (this.socket) {
      this.socket.on('user-typing', callback);
    }
  }

  sendTyping(conversationId: string, userId: string, isTyping: boolean) {
    if (this.socket) {
      this.socket.emit('typing', {
        conversationId,
        userId,
        isTyping,
      });
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
export default socketService;