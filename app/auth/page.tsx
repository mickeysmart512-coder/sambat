'use client';
import Navigation from '@/components/Navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        window.location.href = '/dashboard';
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        alert('Registration successful! Please check your email to verify your account.');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Navigation />
      
      <div className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>
            {isLogin ? 'WELCOME BACK' : 'JOIN THE TRIBE'}
          </h2>
          <p style={{ color: '#888' }}>
            {isLogin ? 'Login to manage your bookings' : 'Create an account to track your requests'}
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(255,0,0,0.1)', color: '#ff4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.8rem', border: '1px solid rgba(255,0,0,0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--accent-gold)' }}>FULL NAME</label>
              <input type="text" name="fullName" placeholder="John Doe" required style={{
                padding: '1rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                color: '#fff',
                outline: 'none'
              }} />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--accent-gold)' }}>EMAIL</label>
            <input type="email" name="email" required placeholder="john@example.com" style={{
              padding: '1rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--glass-border)',
              borderRadius: '8px',
              color: '#fff',
              outline: 'none'
            }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--accent-gold)' }}>PASSWORD</label>
            <input type="password" name="password" required placeholder="••••••••" style={{
              padding: '1rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--glass-border)',
              borderRadius: '8px',
              color: '#fff',
              outline: 'none'
            }} />
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '1rem', padding: '1.2rem' }}>
            {loading ? 'PROCESSING...' : isLogin ? 'LOGIN' : 'SIGN UP'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--accent-blue)', 
                fontWeight: 700, 
                marginLeft: '0.5rem', 
                cursor: 'pointer',
                textDecoration: 'underline'
              }}>
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
