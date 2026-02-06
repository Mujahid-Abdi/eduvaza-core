import { db } from '@/lib/firebase';
import { collection, doc, setDoc, getDoc, updateDoc, query, where, getDocs, orderBy, Timestamp, deleteDoc, addDoc } from 'firebase/firestore';
import type { ChatMessage, ChatHistory } from './geminiAI';

const CHAT_SESSIONS_COLLECTION = 'chatSessions';

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  preview?: string; // First message preview
}

export class ChatHistoryService {
  // Legacy methods for backward compatibility
  async saveChatHistory(userId: string, messages: ChatMessage[]): Promise<void> {
    try {
      const chatHistoryRef = doc(db, 'chatHistory', userId);
      const chatHistory: Omit<ChatHistory, 'messages'> & { messages: any[] } = {
        userId,
        messages: messages.map(msg => ({
          ...msg,
          timestamp: Timestamp.fromDate(msg.timestamp),
        })),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await setDoc(chatHistoryRef, chatHistory, { merge: true });
    } catch (error) {
      console.error('Error saving chat history:', error);
      throw error;
    }
  }

  async getChatHistory(userId: string): Promise<ChatMessage[]> {
    try {
      const chatHistoryRef = doc(db, 'chatHistory', userId);
      const chatHistoryDoc = await getDoc(chatHistoryRef);

      if (chatHistoryDoc.exists()) {
        const data = chatHistoryDoc.data();
        return data.messages.map((msg: any) => ({
          ...msg,
          timestamp: msg.timestamp.toDate(),
        }));
      }

      return [];
    } catch (error) {
      console.error('Error getting chat history:', error);
      return [];
    }
  }

  async clearChatHistory(userId: string): Promise<void> {
    try {
      const chatHistoryRef = doc(db, 'chatHistory', userId);
      await setDoc(chatHistoryRef, {
        userId,
        messages: [],
        updatedAt: Timestamp.now(),
      }, { merge: true });
    } catch (error) {
      console.error('Error clearing chat history:', error);
      throw error;
    }
  }

  // New session-based methods
  async createChatSession(userId: string, title?: string): Promise<string> {
    try {
      const sessionRef = await addDoc(collection(db, CHAT_SESSIONS_COLLECTION), {
        userId,
        title: title || 'New Chat',
        messages: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        preview: '',
      });
      return sessionRef.id;
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw error;
    }
  }

  async getChatSessions(userId: string): Promise<ChatSession[]> {
    try {
      const q = query(
        collection(db, CHAT_SESSIONS_COLLECTION),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const sessions: ChatSession[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sessions.push({
          id: doc.id,
          userId: data.userId,
          title: data.title,
          messages: data.messages.map((msg: any) => ({
            ...msg,
            timestamp: msg.timestamp.toDate(),
          })),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          preview: data.preview || '',
        });
      });
      
      return sessions;
    } catch (error) {
      console.error('Error getting chat sessions:', error);
      return [];
    }
  }

  async getChatSession(sessionId: string): Promise<ChatSession | null> {
    try {
      const sessionRef = doc(db, CHAT_SESSIONS_COLLECTION, sessionId);
      const sessionDoc = await getDoc(sessionRef);
      
      if (sessionDoc.exists()) {
        const data = sessionDoc.data();
        return {
          id: sessionDoc.id,
          userId: data.userId,
          title: data.title,
          messages: data.messages.map((msg: any) => ({
            ...msg,
            timestamp: msg.timestamp.toDate(),
          })),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          preview: data.preview || '',
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting chat session:', error);
      return null;
    }
  }

  async saveChatSession(sessionId: string, messages: ChatMessage[], title?: string): Promise<void> {
    try {
      const sessionRef = doc(db, CHAT_SESSIONS_COLLECTION, sessionId);
      
      // Generate preview from first user message
      const firstUserMessage = messages.find(m => m.role === 'user');
      const preview = firstUserMessage?.content.substring(0, 100) || '';
      
      // Auto-generate title from first message if not provided
      const sessionTitle = title || (firstUserMessage?.content.substring(0, 50) || 'New Chat');
      
      await updateDoc(sessionRef, {
        messages: messages.map(msg => ({
          ...msg,
          timestamp: Timestamp.fromDate(msg.timestamp),
        })),
        title: sessionTitle,
        preview,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error saving chat session:', error);
      throw error;
    }
  }

  async deleteChatSession(sessionId: string): Promise<void> {
    try {
      const sessionRef = doc(db, CHAT_SESSIONS_COLLECTION, sessionId);
      await deleteDoc(sessionRef);
    } catch (error) {
      console.error('Error deleting chat session:', error);
      throw error;
    }
  }

  async renameChatSession(sessionId: string, newTitle: string): Promise<void> {
    try {
      const sessionRef = doc(db, CHAT_SESSIONS_COLLECTION, sessionId);
      await updateDoc(sessionRef, {
        title: newTitle,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error renaming chat session:', error);
      throw error;
    }
  }
}

export const chatHistoryService = new ChatHistoryService();
