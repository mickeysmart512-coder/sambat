'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import AuthModal from './AuthModal';

export default function Hero() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    };
    checkUser();
  }, []);

  const handleBookClick = () => {
    if (user) {
      window.location.href = '/booking';
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <section style={{
      height: '100vh',
      width: '100%',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      
      {/* Background Image with Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url("/hero-bg.png")', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: -1
      }} />
      
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%)',
        zIndex: 0
      }} />

      <div className="container" style={{
        position: 'relative',
        zIndex: 1,
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '1.2rem',
          color: 'var(--accent-blue)',
          fontWeight: 700,
          letterSpacing: '5px',
          marginBottom: '1rem',
          textTransform: 'uppercase'
        }}>The State's Finest</h2>
        
        <h1 className="section-title" style={{ fontSize: 'clamp(3rem, 15vw, 6rem)', lineHeight: '0.9' }}>
          DJ <span className="text-gradient">SAMBAT</span>
        </h1>
        
        <p style={{
          fontSize: 'clamp(1rem, 4vw, 1.5rem)',
          maxWidth: '600px',
          margin: '1.5rem auto',
          color: '#ccc',
          fontWeight: 400
        }}>
          Hypeman • Party Viber • Vibe Controller. <br/>
          Bringing the heat to every stage, every club, every moment.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            className="btn-primary" 
            style={{ padding: '0.8rem 1.5rem', fontSize: '0.8rem' }}
            onClick={handleBookClick}
          >
            Book The Experience
          </button>
          <button className="btn-secondary" style={{ padding: '0.8rem 1.5rem', fontSize: '0.8rem' }}>Watch Live</button>
        </div>
      </div>

      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        bottom: '50px',
        left: '50%',
        transform: 'translateX(-50%)',
        animation: 'bounce 2s infinite'
      }}>
        <div style={{ width: '2px', height: '60px', background: 'linear-gradient(to bottom, var(--accent-gold), transparent)' }} />
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {transform: translateY(0) translateX(-50%);}
          40% {transform: translateY(-10px) translateX(-50%);}
          60% {transform: translateY(-5px) translateX(-50%);}
        }
      `}</style>
    </section>
  );
}
