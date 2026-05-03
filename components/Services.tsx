'use client';
import Link from 'next/link';

const packages = [
  {
    name: "Standard Hypeman",
    price: "From ₦150k",
    features: [
      "2-3 Hour Energy Boost",
      "Crowd Control & Interaction",
      "Signature Drops & Ad-libs",
      "Event Consultation",
    ],
    color: "var(--accent-blue)"
  },
  {
    name: "Full Vibe Experience",
    price: "From ₦350k",
    features: [
      "Complete DJ + Hypeman Set",
      "Custom Mix for Entry/Key Moments",
      "Unlimited Crowd Engagement",
      "Full Night Coverage (Up to 6 Hours)",
      "Technical Rider Support"
    ],
    color: "var(--accent-gold)",
    popular: true
  },
  {
    name: "Wedding / Corporate",
    price: "Custom Quote",
    features: [
      "Premium Formal Entertainment",
      "Coordination with MC/Event Planner",
      "Sophisticated yet Energetic vibe",
      "Professional Sound Logistics",
      "Available for Destination Events"
    ],
    color: "var(--accent-pink)"
  }
];

export default function Services() {
  return (
    <section id="services" className="section-padding" style={{ background: '#080808' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: '1rem' }}>
            SELECT YOUR <span className="neon-text-blue">EXPERIENCE</span>
          </h2>
          <p style={{ color: '#888', maxWidth: '600px', margin: '0 auto' }}>
            Elevate your event with tailored packages designed to ignite the crowd and create unforgettable memories.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '2.5rem' 
        }}>
          {packages.map((pkg, idx) => (
            <div key={idx} className="glass-card fade-in" style={{ 
              padding: '3rem', 
              position: 'relative',
              animationDelay: `${idx * 0.2}s`,
              borderTop: pkg.popular ? `4px solid ${pkg.color}` : '1px solid var(--glass-border)',
              transform: pkg.popular ? 'scale(1.05)' : 'none',
              zIndex: pkg.popular ? 2 : 1
            }}>
              {pkg.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: pkg.color,
                  color: '#000',
                  padding: '2px 15px',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  fontWeight: 900
                }}>MOST POPULAR</div>
              )}
              
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{pkg.name}</h3>
              <p style={{ fontSize: '2rem', fontWeight: 900, color: pkg.color, marginBottom: '2rem' }}>{pkg.price}</p>
              
              <ul style={{ listStyle: 'none', marginBottom: '3rem' }}>
                {pkg.features.map((feat, i) => (
                  <li key={i} style={{ 
                    marginBottom: '1rem', 
                    fontSize: '0.9rem', 
                    color: '#ccc',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem'
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={pkg.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    {feat}
                  </li>
                ))}
              </ul>

              <Link href="/auth" className="btn-neon-outline" style={{ width: '100%', textAlign: 'center', borderColor: pkg.color, color: pkg.color }}>
                GET QUOTE
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
