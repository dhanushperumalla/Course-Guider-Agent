import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Send, Loader2, LogOut, User } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { Sidebar } from './components/Sidebar';
import { supabase } from './lib/supabase';
import { Message, DatabaseMessage, ChatSession } from './types';
import HeroGeometric from './components/ui/modern-hero-section';
import { Login } from './components/Auth/Login';
import { EnhancedSignup } from './components/Auth/EnhancedSignup';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PasswordStrengthDemo } from './components/PasswordStrengthDemo';

function ChatInterface() {
  const { user, signOut } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessionId, setSessionId] = useState(uuidv4());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    loadMessages();
  }, [sessionId]);

  const loadSessions = async () => {
    const { data: messagesData } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (messagesData) {
      const sessionsMap = new Map<string, ChatSession>();
      
      messagesData.forEach(msg => {
        if (!sessionsMap.has(msg.session_id)) {
          const message = msg.message as DatabaseMessage;
          sessionsMap.set(msg.session_id, {
            id: msg.session_id,
            created_at: new Date(msg.created_at),
            last_message: message.content.slice(0, 50) + '...',
            title: msg.title
          });
        }
      });

      setSessions(Array.from(sessionsMap.values()));
    }
  };

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    if (data) {
      const formattedMessages = data.map(msg => {
        const message = msg.message as DatabaseMessage;
        return {
          id: msg.id,
          role: message.type === 'ai' ? 'assistant' : 'user',
          content: message.content,
          timestamp: new Date(msg.created_at)
        };
      });
      setMessages(formattedMessages as Message[]);
    }
  };

  const handleNewChat = () => {
    setSessionId(uuidv4());
    setMessages([]);
    setInput('');
  };

  const handleSelectSession = (id: string) => {
    setSessionId(id);
  };

  const handleDeleteSession = (id: string) => {
    setSessions(prev => prev.filter(session => session.id !== id));
    if (id === sessionId) {
      handleNewChat();
    }
  };

  const handleRenameSession = async (id: string, newTitle: string) => {
    // Update the first message of the session with the new title
    const { data: firstMessage } = await supabase
      .from('messages')
      .select('*')
      .eq('session_id', id)
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (firstMessage) {
      await supabase
        .from('messages')
        .update({ title: newTitle })
        .eq('id', firstMessage.id);

      setSessions(prev =>
        prev.map(session =>
          session.id === id
            ? { ...session, title: newTitle }
            : session
        )
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(import.meta.env.VITE_N8N_END_POINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: input,
          session_id: sessionId
        }),
      });

      // Wait for messages to be processed through n8n and stored in Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));

      await loadMessages();
      await loadSessions();
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        sessions={sessions}
        currentSessionId={sessionId}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
      />
      
      <div className="flex flex-col flex-1">
        <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Course Guider Agent</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{user?.email}</span>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              <span className="ml-2 text-gray-600">Thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HeroGeometric />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<EnhancedSignup />} />
          <Route path="/demo" element={<PasswordStrengthDemo />} />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <ChatInterface />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
