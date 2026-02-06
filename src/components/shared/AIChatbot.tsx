import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Paperclip, Minimize2, Maximize2, Trash2, FileText, HelpCircle, Loader2, GripVertical, Plus, MessageSquare, Edit2, Check, MoreVertical, History, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { geminiAIService, type ChatMessage } from '@/services/geminiAI';
import { chatHistoryService, type ChatSession } from '@/services/chatHistory';
import { useAuth } from '@/contexts/AuthContext';
import ReactMarkdown from 'react-markdown';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [width, setWidth] = useState(384);
  const [isResizing, setIsResizing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const minWidth = 320;
  const maxWidth = 800;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    if (isOpen) {
      loadChatSessions();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle window resize for mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setWidth(Math.min(window.innerWidth - 32, 384));
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle resize dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !chatRef.current) return;

      const rect = chatRef.current.getBoundingClientRect();
      const newWidth = rect.right - e.clientX;
      const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      setWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  const loadChatSessions = async () => {
    // Create a temporary session for all users (no Firestore)
    const tempSessionId = 'temp-' + Date.now();
    setCurrentSessionId(tempSessionId);
    setMessages([]);
    await geminiAIService.startChat([]); // Initialize chat with empty history
    console.log('Session initialized:', tempSessionId);
  };

  const refreshChatSessionsList = async () => {
    // Disabled to save Firestore quota
    return;
  };

  const createNewChat = async () => {
    console.log('=== CREATE NEW CHAT ===');
    console.log('User:', user?.id || 'public');
    
    // Create a temporary session (no Firestore)
    const tempSessionId = 'temp-' + Date.now();
    console.log('Creating temp session:', tempSessionId);
    setCurrentSessionId(tempSessionId);
    setMessages([]);
    await geminiAIService.startChat([]); // Initialize chat with empty history
    toast.success('New chat created');
  };

  const switchToSession = async (sessionId: string) => {
    try {
      const session = await chatHistoryService.getChatSession(sessionId);
      if (session) {
        setCurrentSessionId(sessionId);
        setMessages(session.messages);
        if (session.messages.length > 0) {
          await geminiAIService.startChat(session.messages);
        } else {
          await geminiAIService.startChat([]); // Initialize with empty history
        }
        setShowHistory(false);
      }
    } catch (error) {
      toast.error('Failed to load chat session');
    }
  };

  const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    
    try {
      await chatHistoryService.deleteChatSession(sessionId);
      
      // If deleting current session, create a new one
      if (sessionId === currentSessionId) {
        await createNewChat();
      } else {
        await loadChatSessions();
      }
      
      toast.success('Chat deleted');
    } catch (error) {
      toast.error('Failed to delete chat');
    }
  };

  const startEditingTitle = (sessionId: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(sessionId);
    setEditingTitle(currentTitle);
  };

  const saveTitle = async (sessionId: string) => {
    if (!editingTitle.trim()) return;
    
    try {
      await chatHistoryService.renameChatSession(sessionId, editingTitle);
      await refreshChatSessionsList();
      setEditingSessionId(null);
      toast.success('Chat renamed');
    } catch (error) {
      toast.error('Failed to rename chat');
    }
  };

  const loadChatHistory = async () => {
    if (!user || !currentSessionId) return;
    try {
      const session = await chatHistoryService.getChatSession(currentSessionId);
      if (session) {
        setMessages(session.messages);
        if (session.messages.length > 0) {
          await geminiAIService.startChat(session.messages);
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select an image, PDF, or text file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setFilePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    console.log('=== HANDLE SEND MESSAGE CALLED ===');
    console.log('Input message:', inputMessage);
    console.log('Selected file:', selectedFile?.name);
    console.log('Is loading:', isLoading);
    console.log('Current session ID:', currentSessionId);
    
    if ((!inputMessage.trim() && !selectedFile) || isLoading || !currentSessionId) {
      console.log('=== SEND MESSAGE BLOCKED ===');
      console.log('Reason:', {
        noMessage: !inputMessage.trim() && !selectedFile,
        isLoading,
        noSessionId: !currentSessionId
      });
      return;
    }

    console.log('=== SENDING MESSAGE ===');
    console.log('Current Session ID:', currentSessionId);
    console.log('User:', user?.id || 'public');
    console.log('Message:', inputMessage.trim());

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim() || 'Uploaded file',
      timestamp: new Date(),
    };

    if (selectedFile) {
      userMessage.fileAttachment = {
        name: selectedFile.name,
        type: selectedFile.type,
        data: filePreview || '',
      };
    }

    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      let fileData;
      if (selectedFile && filePreview) {
        const base64Data = filePreview.split(',')[1];
        fileData = {
          mimeType: selectedFile.type,
          data: base64Data,
        };
      }

      console.log('Calling geminiAIService.sendMessage...');
      const response = await geminiAIService.sendMessage(userMessage.content, fileData);
      console.log('Response received:', response.substring(0, 100));

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      const updatedMessages = [...currentMessages, assistantMessage];
      setMessages(updatedMessages);
      
      // Stop loading immediately after setting messages
      setIsLoading(false);
      
      // Firestore saving disabled to save quota
      // if (user && !currentSessionId.startsWith('temp-')) {
      //   chatHistoryService.saveChatSession(currentSessionId, updatedMessages)
      //     .then(() => refreshChatSessionsList())
      //     .catch(err => console.error('Error saving chat:', err));
      // }
      
      removeFile();
    } catch (error: any) {
      console.error('=== ERROR SENDING MESSAGE ===', error);
      toast.error(error.message || 'Failed to send message');
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error.message || 'Failed to get response from AI. Please try again.'}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleStopLoading = () => {
    setIsLoading(false);
    toast.info('Stopped loading');
  };

  const handleSummarize = async () => {
    if (!selectedFile || !filePreview || !currentSessionId) return;

    setIsLoading(true);
    try {
      const base64Data = filePreview.split(',')[1];
      const summary = await geminiAIService.analyzeDocument(base64Data, selectedFile.type, 'summarize');

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: `Summarize: ${selectedFile.name}`,
        timestamp: new Date(),
        fileAttachment: {
          name: selectedFile.name,
          type: selectedFile.type,
          data: filePreview,
        },
      };

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: summary,
        timestamp: new Date(),
      };

      const currentMessages = [...messages, userMessage];
      const updatedMessages = [...currentMessages, assistantMessage];
      setMessages(updatedMessages);
      
      // Stop loading immediately
      setIsLoading(false);
      
      // Firestore saving disabled to save quota
      
      removeFile();
      toast.success('Document summarized successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to summarize document');
      setIsLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!selectedFile || !filePreview || !currentSessionId) return;

    setIsLoading(true);
    try {
      const base64Data = filePreview.split(',')[1];
      const questions = await geminiAIService.analyzeDocument(base64Data, selectedFile.type, 'questions');

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: `Generate practice questions: ${selectedFile.name}`,
        timestamp: new Date(),
        fileAttachment: {
          name: selectedFile.name,
          type: selectedFile.type,
          data: filePreview,
        },
      };

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: questions,
        timestamp: new Date(),
      };

      const currentMessages = [...messages, userMessage];
      const updatedMessages = [...currentMessages, assistantMessage];
      setMessages(updatedMessages);
      
      // Stop loading immediately
      setIsLoading(false);
      
      // Firestore saving disabled to save quota
      
      removeFile();
      toast.success('Practice questions generated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate questions');
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!currentSessionId) return;
    
    try {
      if (user && !currentSessionId.startsWith('temp-')) {
        await chatHistoryService.deleteChatSession(currentSessionId);
      }
      await createNewChat();
      toast.success('Chat cleared');
    } catch (error) {
      toast.error('Failed to clear chat');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    console.log('Key pressed:', e.key);
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      console.log('Enter pressed, calling handleSendMessage');
      handleSendMessage();
    }
  };

  console.log('=== CHATBOT RENDER ===');
  console.log('isOpen:', isOpen);
  console.log('currentSessionId:', currentSessionId);
  console.log('messages count:', messages.length);
  console.log('isLoading:', isLoading);
  console.log('inputMessage:', inputMessage);

  if (!isOpen) return null;

  const chatHeight = isMinimized ? 64 : isMobile ? 'calc(100vh - 100px)' : 600;
  const chatWidth = isMobile ? 'calc(100vw - 32px)' : width;

  return (
    <Card 
      ref={chatRef}
      className={`fixed z-50 flex flex-col bg-background border shadow-2xl transition-all duration-300 ${
        isMobile ? 'left-4 right-4 bottom-4' : 'bottom-4'
      }`}
      style={{ 
        width: isMobile ? 'auto' : `${chatWidth}px`,
        height: isMinimized ? '64px' : isMobile ? chatHeight : '600px',
        maxHeight: 'calc(100vh - 2rem)',
        right: isMobile ? 'auto' : '16px',
      }}
    >
      {/* Resize Handle - Desktop only */}
      {!isMobile && !isMinimized && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-primary/50 transition-colors group"
          onMouseDown={() => setIsResizing(true)}
        >
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-primary rounded-full p-1">
              <GripVertical className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground flex-shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={createNewChat}
            title="New Chat"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <h3 className="font-semibold text-sm md:text-base">AI Study Assistant</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={handleClearHistory}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* History Sidebar */}
          {showHistory && (
            <div className="absolute left-0 top-[72px] bottom-0 w-64 bg-background border-r shadow-lg z-10 flex flex-col">
              <div className="p-3 border-b">
                <h4 className="font-semibold text-sm">Chat History</h4>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {chatSessions.map((session) => (
                    <div
                      key={session.id}
                      className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                        session.id === currentSessionId
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => switchToSession(session.id)}
                    >
                      {editingSessionId === session.id ? (
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="h-7 text-xs"
                            autoFocus
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') saveTitle(session.id);
                              if (e.key === 'Escape') setEditingSessionId(null);
                            }}
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => saveTitle(session.id)}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{session.title}</p>
                              {session.preview && (
                                <p className="text-xs text-muted-foreground truncate mt-1">
                                  {session.preview}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(session.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                                >
                                  <MoreVertical className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => startEditingTitle(session.id, session.title, e as any)}>
                                  <Edit2 className="h-3 w-3 mr-2" />
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => deleteSession(session.id, e as any)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-3 w-3 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {chatSessions.length === 0 && (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      No chat history yet
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Messages */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-3 md:p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground px-4">
                <HelpCircle className="h-10 w-10 md:h-12 md:w-12 mb-3 md:mb-4 opacity-50" />
                <p className="text-xs md:text-sm">Ask me anything about your studies!</p>
                <p className="text-xs mt-2">Upload files for summaries or practice questions</p>
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg p-2 md:p-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.fileAttachment && (
                        <div className="mb-2 text-xs opacity-75">
                          📎 {message.fileAttachment.name}
                        </div>
                      )}
                      <div className="text-xs md:text-sm prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                      <div className="text-xs opacity-50 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* File Preview */}
          {selectedFile && (
            <div className="px-3 md:px-4 py-2 border-t bg-muted/50 flex-shrink-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Paperclip className="h-4 w-4 flex-shrink-0" />
                  <span className="text-xs md:text-sm truncate">{selectedFile.name}</span>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleSummarize}
                    disabled={isLoading}
                    title="Summarize"
                    className="h-7 w-7 md:h-8 md:w-8 p-0"
                  >
                    <FileText className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleGenerateQuestions}
                    disabled={isLoading}
                    title="Generate Questions"
                    className="h-7 w-7 md:h-8 md:w-8 p-0"
                  >
                    <HelpCircle className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={removeFile}
                    disabled={isLoading}
                    className="h-7 w-7 md:h-8 md:w-8 p-0"
                  >
                    <X className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 md:p-4 border-t flex-shrink-0">
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*,.pdf,.txt"
                onChange={handleFileSelect}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="h-9 w-9 md:h-10 md:w-10 flex-shrink-0"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                value={inputMessage}
                onChange={(e) => {
                  console.log('Input changed:', e.target.value);
                  setInputMessage(e.target.value);
                }}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything..."
                disabled={isLoading}
                className="flex-1 text-sm"
              />
              {isLoading ? (
                <Button
                  onClick={handleStopLoading}
                  size="icon"
                  variant="destructive"
                  className="h-9 w-9 md:h-10 md:w-10 flex-shrink-0"
                  title="Stop generating"
                >
                  <StopCircle className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    console.log('=== SEND BUTTON CLICKED ===');
                    console.log('Input value:', inputMessage);
                    console.log('Input trimmed:', inputMessage.trim());
                    console.log('Has file:', !!selectedFile);
                    console.log('Button disabled:', !inputMessage.trim() && !selectedFile);
                    handleSendMessage();
                  }}
                  disabled={!inputMessage.trim() && !selectedFile}
                  size="icon"
                  className="h-9 w-9 md:h-10 md:w-10 flex-shrink-0"
                  title="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </Card>
  );
};
