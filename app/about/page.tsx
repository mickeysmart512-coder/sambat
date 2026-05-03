'use client';
import Navigation from '@/components/Navigation';

export default function AboutPage() {
  return (
    <main style={{ background: '#050505', minHeight: '100vh' }}>
      <Navigation />
      
      <section className="section-padding" style={{ paddingTop: '10rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '5rem', alignItems: 'center' }}>
            <div className="fade-in">
              <div style={{ position: 'relative' }}>
                <img 
                  src="https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?q=80&w=2076&auto=format&fit=crop" 
                  alt="DJ Sambat in Action" 
                  style={{ width: '100%', borderRadius: '24px', boxShadow: '0 0 50px rgba(0,242,255,0.2)' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '-30px',
                  right: '-30px',
                  background: 'var(--accent-blue)',
                  color: '#000',
                  padding: '2rem',
                  borderRadius: '16px',
                  fontWeight: 900,
                  fontSize: '1.5rem',
                  boxShadow: 'var(--glow-blue)'
                }}>
                  EST. 2018
                </div>
              </div>
            </div>

            <div className="fade-in" style={{ animationDelay: '0.3s' }}>
              <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1, marginBottom: '2rem' }}>
                THE <span className="neon-text-blue">VOICE</span> OF THE NIGHT
              </h1>
              <p style={{ fontSize: '1.2rem', color: '#ccc', lineHeight: 1.8, marginBottom: '2rem' }}>
                DJ Sambat is not just a DJ; he is a force of nature on the stage. As Nigeria's ultimate Hypeman and Vibe Controller, he has mastered the art of crowd psychology, turning every event into a high-octane celebration.
              </p>
              <p style={{ color: '#888', lineHeight: 1.8, marginBottom: '3rem' }}>
                From the biggest club nights in Lagos to luxury destination weddings in Accra, Sambat brings a unique blend of charismatic energy, flawless crowd control, and signature street-luxury vibes that keeps the dancefloor packed until the lights come on.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h4 style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>SKILLS</h4>
                  <p style={{ fontSize: '0.8rem', color: '#888' }}>Crowd Hyping, DJ Sets, Event Hosting</p>
                </div>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h4 style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>EXPERIENCE</h4>
                  <p style={{ fontSize: '0.8rem', color: '#888' }}>500+ Events across West Africa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="section-padding" style={{ background: '#080808' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '3rem', fontWeight: 900, marginBottom: '5rem' }}>
            WHY <span className="neon-text-gold">SAMBAT?</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { title: "Electric Energy", desc: "A presence that ignites the room from the first second." },
              { title: "Versatility", desc: "From corporate gala nights to high-energy street festivals." },
              { title: "Professionalism", desc: "Flawless coordination with planners and technical teams." }
            ].map((card, i) => (
              <div key={i} className="glass-card fade-in" style={{ padding: '3rem', animationDelay: `${i * 0.2}s` }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--accent-blue)' }}>{card.title}</h3>
                <p style={{ color: '#888', lineHeight: 1.6 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
