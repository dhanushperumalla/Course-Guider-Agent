import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Settings, LogOut, User, Trash2, Edit } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // First clear all chat history without showing another confirmation
        const { data: sessions } = await supabase
          .from('messages')
          .select('session_id')
          .order('created_at', { ascending: false });

        if (sessions && sessions.length > 0) {
          // Extract unique session IDs
          const sessionIds = [...new Set(sessions.map(s => s.session_id))];
          
          // Delete all messages for these sessions
          for (const sessionId of sessionIds) {
            await supabase
              .from('messages')
              .delete()
              .eq('session_id', sessionId);
          }
        }
        
        // Then sign out the user
        await supabase.auth.signOut();
        navigate('/login');
        alert('Your account has been signed out and all your data has been deleted.');
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  const handleClearChat = async () => {
    if (window.confirm('Are you sure you want to clear all chat history?')) {
      try {
        // Get all sessions for the current user
        const { data: sessions } = await supabase
          .from('messages')
          .select('session_id')
          .order('created_at', { ascending: false });

        if (sessions && sessions.length > 0) {
          // Extract unique session IDs
          const sessionIds = [...new Set(sessions.map(s => s.session_id))];
          
          // Delete all messages for these sessions
          for (const sessionId of sessionIds) {
            const { error } = await supabase
              .from('messages')
              .delete()
              .eq('session_id', sessionId);
            
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-xl font-semibold text-gray-800">Course Guider Agent</h1>
          
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span>{user?.email}</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-1">
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
                
                <div className="relative group">
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </button>
                  
                  <div className="absolute left-full top-0 ml-1 w-48 bg-white border rounded-lg shadow-lg py-1 hidden group-hover:block">
                    <button
                      onClick={handleClearChat}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear Chat History
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}