'use client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main style={{ background: '#070709', minHeight: '100vh', color: '#fff' }}>
      <Navigation />
      
      <section className="section-padding" style={{ paddingTop: '10rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '5rem', alignItems: 'center' }}>
            <div className="fade-in">
              <div style={{ position: 'relative' }}>
                <img 
                  src="https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?q=80&w=2076&auto=format&fit=crop" 
                  alt="DJ Sambat in Action" 
                  style={{ width: '100%', borderRadius: '24px', boxShadow: '0 0 50px rgba(0,242,255,0.2)' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '-25px',
                  right: '-20px',
                  background: 'var(--accent-blue)',
                  color: '#000',
                  padding: '1.5rem 2rem',
                  borderRadius: '16px',
                  fontWeight: 900,
                  fontSize: '1.4rem',
                  boxShadow: 'var(--glow-blue)'
                }}>
                  EST. 2018
                </div>
              </div>
            </div>

            <div className="fade-in">
              <div className="badge-live" style={{ marginBottom: '1rem' }}>
                <span className="pulse-dot" />
                <span>NIGERIA'S OFFICIAL HYPEMAN &amp; MC</span>
              </div>
              <h1 style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)', fontWeight: 900, lineHeight: 1, marginBottom: '1.5rem' }}>
                THE <span className="neon-text-blue">VOICE</span> OF THE NIGHT
              </h1>
              <p style={{ fontSize: '1.15rem', color: '#ccc', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                DJ Sambat is not just a performer; he is an undeniable force of nature on every stage. As Nigeria's ultimate Hypeman, MC, and Vibe Controller, he has mastered the psychology of celebration — elevating weddings, festivals, and club shutdown sets into high-octane spectacles.
              </p>
              <p style={{ color: '#888', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                From the biggest club circuits in Victoria Island to high-society destination weddings across West Africa, Sambat merges charismatic authority, effortless crowd interaction, and signature street-luxury energy that ensures no one stays seated.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h4 style={{ color: 'var(--accent-gold)', marginBottom: '0.4rem', fontSize: '0.9rem' }}>SPECIALTIES</h4>
                  <p style={{ fontSize: '0.85rem', color: '#bbb' }}>Crowd Control, Grand Bridal Entries, Mainstage Hosting, DJ Synergy</p>
                </div>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h4 style={{ color: 'var(--accent-gold)', marginBottom: '0.4rem', fontSize: '0.9rem' }}>TRACK RECORD</h4>
                  <p style={{ fontSize: '0.85rem', color: '#bbb' }}>500+ Verified Events across 15+ Nigerian states</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/booking" className="btn-neon-blue">
                  ⚡ BOOK SAMBAT FOR YOUR EVENT
                </Link>
                <Link href="/experiences" className="btn-secondary">
                  WATCH LIVE FOOTAGE
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="section-padding" style={{ background: '#0a0a0f', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: '0.8rem' }}>
              WHY CLIENTS CHOOSE <span className="neon-text-gold">SAMBAT</span>
            </h2>
            <p style={{ color: '#888', maxWidth: '600px', margin: '0 auto' }}>
              The standard for professional event hosting and unmatched stage charisma.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { title: "Electric Stage Presence", desc: "Commanding the microphone with infectious energy that engages every corner of the room from start to finish." },
              { title: "Versatile Formats", desc: "Effortlessly transitioning between high-society black-tie galas, opulent traditional weddings, and raw festival crowds." },
              { title: "Rider & Tech Synergy", desc: "Professional coordination with event planners, sound engineers, and resident DJs for seamless timing and execution." }
            ].map((card, i) => (
              <div key={i} className="glass-card" style={{ padding: '2.5rem', borderTop: '3px solid var(--accent-blue)' }}>
                <h3 style={{ marginBottom: '1rem', color: '#fff', fontSize: '1.25rem' }}>{card.title}</h3>
                <p style={{ color: '#aaa', lineHeight: 1.7, fontSize: '0.95rem' }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
