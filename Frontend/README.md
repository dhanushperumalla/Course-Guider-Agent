# Course Guider Agent - Frontend

A React-based frontend application with authentication for the Course Guider Agent.

## Features

- **Authentication System**: Complete login/signup functionality using Supabase
- **Protected Routes**: Only authenticated users can access the chat interface
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Real-time Chat**: AI-powered course guidance through chat interface

## Authentication Flow

1. **Landing Page**: Users see the hero section with login/signup options
2. **Sign Up**: New users can create an account with email verification
3. **Sign In**: Existing users can log in with their credentials
4. **Protected Chat**: Only authenticated users can access `/chat` route
5. **Logout**: Users can log out from the chat interface

## Routes

- `/` - Landing page (public)
- `/login` - Login page (public)
- `/signup` - Signup page (public)
- `/chat` - Chat interface (protected - requires authentication)

## Environment Variables

Make sure you have the following environment variables set in your `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_N8N_END_POINT=your_n8n_endpoint
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Authentication Components

- `Login.tsx` - Login form with email/password
- `Signup.tsx` - Registration form with email verification
- `ProtectedRoute.tsx` - Route wrapper that checks authentication
- `AuthContext.tsx` - React context for managing auth state

## Usage

1. Visit the landing page
2. Click "Create Account" to sign up or "Sign In" to log in
3. After authentication, you'll be redirected to the chat interface
4. Use the chat to get course guidance from the AI assistant
5. Click "Logout" to sign out

## Security Features

- Email verification required for new accounts
- Protected routes prevent unauthorized access
- Secure password handling with Supabase
- Session management with automatic token refresh 