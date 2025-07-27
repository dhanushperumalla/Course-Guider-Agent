import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export function EmailConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Confirming your email...');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get the access_token and refresh_token from URL parameters
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const type = searchParams.get('type');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        console.log('Email confirmation params:', { type, accessToken: !!accessToken, refreshToken: !!refreshToken, error, errorDescription });

        if (error) {
          setStatus('error');
          setMessage(`Error: ${errorDescription || error}`);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (type === 'email_confirmation' && accessToken && refreshToken) {
          // Set the session with the tokens from the email confirmation
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error('Error setting session:', sessionError);
            setStatus('error');
            setMessage('Failed to confirm email. Please try again.');
            setTimeout(() => navigate('/login'), 3000);
          } else if (data.user) {
            setStatus('success');
            setMessage('Email confirmed successfully! Redirecting to chat...');
            setTimeout(() => navigate('/chat'), 2000);
          }
        } else if (type === 'recovery') {
          // Handle password recovery
          setStatus('success');
          setMessage('Password recovery link processed. You can now reset your password.');
          setTimeout(() => navigate('/login'), 3000);
        } else {
          // Handle other auth callbacks or missing parameters
          setStatus('error');
          setMessage('Invalid confirmation link. Please try again.');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (error) {
        console.error('Error during email confirmation:', error);
        setStatus('error');
        setMessage('An error occurred during email confirmation. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleEmailConfirmation();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181824] via-[#23243a] to-[#181824] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#23243a]/80 rounded-xl shadow-xl p-8 border border-[#23243a]/40">
        <div className="text-center">
          {status === 'loading' && (
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-900/30">
              <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
            </div>
          )}
          {status === 'success' && (
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-900/30">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          )}
          {status === 'error' && (
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-900/30">
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          )}
          
          <h2 className="mt-6 text-center text-2xl font-extrabold text-white">
            Email Confirmation
          </h2>
          
          <p className="mt-2 text-center text-sm text-blue-200">
            {message}
          </p>

          {status === 'error' && (
            <div className="mt-4">
              <button
                onClick={() => navigate('/login')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 