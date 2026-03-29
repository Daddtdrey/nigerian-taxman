import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, Mail, KeyRound, Loader2 } from 'lucide-react';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        // Optionally show "Check email to verify" or just succeed
        onAuthSuccess();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onAuthSuccess();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-6 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-3xl p-10 shadow-2xl shadow-nigeria-green/10 dark:shadow-none border border-neutral-100 dark:border-neutral-700 relative overflow-hidden transition-colors">
        
        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-nigeria-green-light dark:bg-nigeria-green-dark/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

        <div className="flex flex-col items-center justify-center space-y-4 mb-8">
          <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center shadow-lg shadow-neutral-900/20">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-black text-neutral-900 dark:text-white mt-2">
            NigeriaTax<span className="text-nigeria-green">Man</span>
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium tracking-wide">
            {isSignUp ? "Create an account to continue" : "Sign in to access your dashboard"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl px-4 py-3 border border-neutral-200 dark:border-neutral-700 focus-within:border-nigeria-green transition-colors">
              <Mail className="w-5 h-5 text-neutral-400" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full bg-transparent border-none outline-none text-sm text-neutral-900 dark:text-white font-medium"
              />
            </div>

            <div className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl px-4 py-3 border border-neutral-200 dark:border-neutral-700 focus-within:border-nigeria-green transition-colors">
              <KeyRound className="w-5 h-5 text-neutral-400" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength={6}
                className="w-full bg-transparent border-none outline-none text-sm text-neutral-900 dark:text-white font-medium"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs px-4 py-3 rounded-lg font-semibold">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-nigeria-green hover:bg-nigeria-green-dark text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? "Create Account" : "Secure Sign In")}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-neutral-500 dark:text-neutral-400 relative z-10">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button 
            type="button" 
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }} 
            className="text-nigeria-green font-bold hover:underline cursor-pointer"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>

      </div>
    </div>
  );
};
