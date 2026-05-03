'use client';
import Navigation from '@/components/Navigation';
import Gallery from '@/components/Gallery';

export default function ExperiencesPage() {
  return (
    <main style={{ background: '#050505', minHeight: '100vh' }}>
      <Navigation />
      <div style={{ paddingTop: '8rem' }}>
        <Gallery />
      </div>

      <section className="section-padding" style={{ background: '#080808' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>PERFORMANCE <span className="neon-text-gold">CATEGORIES</span></h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[
              { name: "CLUB NIGHTS", img: "https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=2070&auto=format&fit=crop" },
              { name: "WEDDINGS", img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop" },
              { name: "CONCERTS", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop" },
              { name: "PRIVATE PARTIES", img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop" }
            ].map((cat, i) => (
              <div key={i} className="fade-in" style={{ 
                position: 'relative', 
                height: '300px', 
                borderRadius: '16px', 
                overflow: 'hidden',
                animationDelay: `${i * 0.1}s`
              }}>
                <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
                <div style={{ 
                  position: 'absolute', 
                  bottom: '20px', 
                  left: '20px', 
                  fontWeight: 900, 
                  fontSize: '1.2rem',
                  letterSpacing: '0.1em'
                }}>{cat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
