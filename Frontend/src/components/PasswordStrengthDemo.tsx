import React from 'react';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

export function PasswordStrengthDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Password Strength Indicator
          </h1>
          <p className="text-gray-600">
            Try typing a password to see the strength indicator in action
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <PasswordStrengthIndicator />
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            This component provides real-time feedback on password strength
          </p>
        </div>
      </div>
    </div>
  );
} 