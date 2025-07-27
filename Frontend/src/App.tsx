import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Send, Loader2, LogOut, User, Edit, Trash2, ChevronDown } from 'lucide-react';
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
import { Profile } from './components/Profile';
import { EmailConfirmation } from './components/Auth/EmailConfirmation';

function ChatInterface() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [sessionId, setSessionId] = useState(uuidv4());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    loadMessages();
  }, [sessionId]);

  const loadSessions = async () => {
    if (!user?.id) return;

    try {
      // First try with user_id filter
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error && error.code === '42703') {
        // Column doesn't exist, fallback to loading all messages (temporary)
        console.log('user_id column not found, loading all messages temporarily');
        const { data: allMessages } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false });

        if (allMessages) {
          const sessionsMap = new Map<string, ChatSession>();
          
          allMessages.forEach(msg => {
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
      } else if (messagesData) {
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
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const loadMessages = async () => {
    if (!user?.id) return;

    try {
      // First try with user_id filter
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error && error.code === '42703') {
        // Column doesn't exist, fallback to loading messages without user filter (temporary)
        console.log('user_id column not found, loading messages without user filter temporarily');
        const { data: allData, error: fallbackError } = await supabase
          .from('messages')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true });

        if (fallbackError) {
          console.error('Error loading messages:', fallbackError);
          return;
        }

        if (allData) {
          const formattedMessages = allData.map(msg => {
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
      } else if (error) {
        console.error('Error loading messages:', error);
        return;
      } else if (data) {
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
    } catch (error) {
      console.error('Error loading messages:', error);
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
    if (!user?.id) return;

    try {
      // First try with user_id filter
      const { data: firstMessage, error } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (error && error.code === '42703') {
        // Column doesn't exist, fallback to loading without user filter (temporary)
        console.log('user_id column not found, renaming without user filter temporarily');
        const { data: fallbackMessage } = await supabase
          .from('messages')
          .select('*')
          .eq('session_id', id)
          .order('created_at', { ascending: true })
          .limit(1)
          .single();

        if (fallbackMessage) {
          await supabase
            .from('messages')
            .update({ title: newTitle })
            .eq('id', fallbackMessage.id);

          setSessions(prev =>
            prev.map(session =>
              session.id === id
                ? { ...session, title: newTitle }
                : session
            )
          );
        }
      } else if (firstMessage) {
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
    } catch (error) {
      console.error('Error renaming session:', error);
    }
  };

  const handleClearChat = async () => {
    if (!user?.id) return;

    if (window.confirm('Are you sure you want to clear all chat history?')) {
      try {
        // Get all sessions for the current user
        const { data: sessions } = await supabase
          .from('messages')
          .select('session_id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (sessions && sessions.length > 0) {
          // Extract unique session IDs
          const sessionIds = [...new Set(sessions.map(s => s.session_id))];
          
          // Delete all messages for these sessions
          for (const sessionId of sessionIds) {
            const { error } = await supabase
              .from('messages')
              .delete()
              .eq('session_id', sessionId)
              .eq('user_id', user.id);
            
            if (error) {
              console.error('Error deleting session:', sessionId, error);
            }
          }
          
          alert('Chat history cleared successfully!');
          window.location.reload();
        } else {
          alert('No chat history found.');
        }
      } catch (error) {
        console.error('Error clearing chat:', error);
        alert('Failed to clear chat history. Please try again.');
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) return;

    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // First clear all chat history without showing another confirmation
        const { data: sessions } = await supabase
          .from('messages')
          .select('session_id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (sessions && sessions.length > 0) {
          // Extract unique session IDs
          const sessionIds = [...new Set(sessions.map(s => s.session_id))];
          
          // Delete all messages for these sessions
          for (const sessionId of sessionIds) {
            await supabase
              .from('messages')
              .delete()
              .eq('session_id', sessionId)
              .eq('user_id', user.id);
          }
        }

        // Try to delete the user account using a different approach
        // Since we can't use admin functions from client, we'll try to update the user
        // to make their account unusable and then sign them out
        try {
          // Update user metadata to mark as deleted
          await supabase.auth.updateUser({
            data: { 
              deleted: true,
              deleted_at: new Date().toISOString()
            }
          });
        } catch (updateError) {
          console.log('Could not update user metadata:', updateError);
        }
        
        // Sign out the user
        await signOut();
        navigate('/login');
        alert('Your account has been marked for deletion and all your data has been cleared. Please contact support if you need to completely remove your account.');
      } catch (error) {
        console.error('Error deleting account:', error);
        // Fallback: clear data and sign out
        await signOut();
        navigate('/login');
        alert('Error deleting account. Your data has been cleared and you have been signed out.');
      }
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
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">
                  {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-1 z-50">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                  
                  <button
                    onClick={() => {
                      handleClearChat();
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Chat
                  </button>
                  
                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <button
                    onClick={() => {
                      signOut();
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                  
                  <button
                    onClick={() => {
                      handleDeleteAccount();
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </button>
                </div>
              )}
            </div>
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
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route path="/auth/callback" element={<EmailConfirmation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
