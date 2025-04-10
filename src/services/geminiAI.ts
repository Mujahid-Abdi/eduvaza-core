import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error('Gemini API key is not configured');
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  fileAttachment?: {
    name: string;
    type: string;
    data: string;
  };
}

export interface ChatHistory {
  userId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

class GeminiAIService {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  private chat: any = null;

  async startChat(history: ChatMessage[] = []) {
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    this.chat = this.model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      },
    });

    return this.chat;
  }

  async sendMessage(message: string, fileData?: { mimeType: string; data: string }): Promise<string> {
    try {
      console.log('=== GeminiAI Service: sendMessage ===');
      console.log('Chat initialized:', !!this.chat);
      console.log('Message:', message.substring(0, 50));
      console.log('Has file:', !!fileData);
      
      if (!this.chat) {
        console.log('Chat not initialized, starting new chat...');
        await this.startChat();
      }

      let result;
      if (fileData) {
        console.log('Sending message with file...');
        const imagePart = {
          inlineData: {
            data: fileData.data,
            mimeType: fileData.mimeType,
          },
        };
        result = await this.chat.sendMessage([message, imagePart]);
      } else {
        console.log('Sending text message...');
        result = await this.chat.sendMessage(message);
      }

      console.log('Getting response...');
      const response = await result.response;
      const text = response.text();
      console.log('Response received, length:', text.length);
      return text;
    } catch (error: any) {
      console.error('=== GeminiAI Service ERROR ===', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
      });
      
      // Check for quota exceeded error
      if (error.message && (error.message.includes('quota') || error.message.includes('429'))) {
        throw new Error('Daily API quota exceeded. Please try again tomorrow or upgrade your Gemini API plan at https://ai.google.dev/pricing');
      }
      
      throw new Error(error.message || 'Failed to get response from AI');
    }
  }

  async summarizeText(text: string): Promise<string> {
    try {
      const prompt = `Please provide a comprehensive summary of the following text. Focus on the main ideas, key points, and important details:\n\n${text}`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error('Error summarizing text:', error);
      throw new Error('Failed to summarize text');
    }
  }

  async generatePracticeQuestions(text: string, count: number = 5): Promise<string> {
    try {
      const prompt = `Based on the following educational content, generate ${count} practice questions with answers. Format each question clearly with the answer below it:\n\n${text}`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error('Error generating practice questions:', error);
      throw new Error('Failed to generate practice questions');
    }
  }

  async analyzeDocument(fileData: string, mimeType: string, task: 'summarize' | 'questions'): Promise<string> {
    try {
      const imagePart = {
        inlineData: {
          data: fileData,
          mimeType: mimeType,
        },
      };

      let prompt = '';
      if (task === 'summarize') {
        prompt = 'Please analyze this document and provide a comprehensive summary of its content, highlighting the main points and key information.';
      } else {
        prompt = 'Please analyze this document and generate 5-10 practice questions based on its content. Include answers for each question.';
      }

      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error('Error analyzing document:', error);
      throw new Error('Failed to analyze document');
    }
  }

  resetChat() {
    this.chat = null;
  }
}

export const geminiAIService = new GeminiAIService();
