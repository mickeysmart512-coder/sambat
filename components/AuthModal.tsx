'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createClient();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onClose();
        window.location.reload(); // Refresh to update auth state
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '450px',
        padding: '3rem',
        position: 'relative',
        border: '1px solid var(--glass-border)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'none',
            border: 'none',
            color: '#666',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          &times;
        </button>

        <h2 style={{ fontSize: '2rem', fontWeight: 900, textAlign: 'center', marginBottom: '0.5rem' }}>
          {isLogin ? 'WELCOME ' : 'JOIN THE '}
          <span className="text-gradient">{isLogin ? 'BACK' : 'EXPERIENCE'}</span>
        </h2>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: '2rem', fontSize: '0.9rem' }}>
          {isLogin ? 'Enter your details to access your dashboard' : 'Sign up to start booking exclusive events'}
        </p>

        {error && (
          <div style={{ background: 'rgba(255,0,0,0.1)', color: '#ff4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.8rem', border: '1px solid rgba(255,0,0,0.2)' }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{ background: 'rgba(0,255,0,0.1)', color: '#4ade80', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.8rem', border: '1px solid rgba(0,255,0,0.2)' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#666', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '1px' }}>Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              style={{
                width: '100%',
                padding: '1rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                color: '#fff',
                outline: 'none'
              }}
            />
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#666', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '1px' }}>Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '1rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                color: '#fff',
                outline: 'none'
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary" 
            style={{ width: '100%', padding: '1rem', fontSize: '1rem', marginBottom: '1.5rem' }}
          >
            {loading ? 'PROCESSING...' : isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: 'var(--accent-gold)', cursor: 'pointer', fontWeight: 700 }}
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </span>
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
