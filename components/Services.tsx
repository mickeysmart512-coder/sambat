'use client';
import Link from 'next/link';

const packages = [
  {
    id: "club",
    name: "Club & Party Shutdown",
    badge: "HIGH ENERGY",
    subtitle: "Nightclubs, Raves & Pool Parties",
    priceRange: "From ₦100,000",
    features: [
      "2-4 Hours High-Octane Crowd Hyping",
      "Signature Drops & Chants",
      "Crowd Synchronization & Interaction",
      "Seamless Synergy with Resident DJs",
      "Full Party Hype Protocol"
    ],
    color: "var(--accent-blue)",
    ctaText: "BOOK CLUB PERFORMANCE"
  },
  {
    id: "wedding",
    name: "Wedding Vibe Experience",
    badge: "MOST POPULAR",
    subtitle: "Receptions, After-Parties & Traditional",
    priceRange: "From ₦150,000",
    features: [
      "Custom Grand Bridal Entry Hype",
      "Coordination with Event Planners & MC",
      "Classy yet Explosive Turnup Energy",
      "Custom DJ Mix Consultation",
      "Nationwide Travel Available"
    ],
    color: "var(--accent-gold)",
    popular: true,
    ctaText: "BOOK WEDDING EXPERIENCE"
  },
  {
    id: "corporate",
    name: "Concerts & Corporate Galas",
    badge: "FESTIVAL GRADE",
    subtitle: "Brand Activations, Galas & Concerts",
    priceRange: "From ₦200,000",
    features: [
      "Mainstage Stadium & Arena Presence",
      "Audience Energizer & Sponsor Announcements",
      "Custom Script & Event Brief Alignment",
      "Full Stage Tech Rider Compliance",
      "VIP & Celebrity Engagement"
    ],
    color: "var(--accent-pink)",
    ctaText: "INQUIRE CONCERT / GALA"
  }
];

export default function Services() {
  return (
    <section id="services" className="section-padding" style={{
      background: 'linear-gradient(to bottom, #070709 0%, #0d0e14 100%)',
      position: 'relative'
    }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
          <div className="badge-live" style={{ marginBottom: '1rem', background: 'rgba(255, 215, 0, 0.1)', borderColor: 'rgba(255, 215, 0, 0.3)', color: 'var(--accent-gold)' }}>
            <span>PERFORMANCE PACKAGES</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            CHOOSE YOUR <span className="neon-text-blue">EVENT VIBE</span>
          </h2>
          <p style={{ color: '#aaa', maxWidth: '650px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.7 }}>
            Whether you need a dynamic wedding reception, an uncontrollable club turnup, or an arena-shaking concert host, select a package below for an instant quote.
          </p>
        </div>

        {/* Packages Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '2.5rem',
          alignItems: 'stretch'
        }}>
          {packages.map((pkg, idx) => (
            <div 
              key={idx} 
              className="glass-card" 
              style={{ 
                padding: '3rem 2.2rem', 
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderTop: `4px solid ${pkg.color}`,
                boxShadow: pkg.popular ? '0 25px 60px rgba(0,0,0,0.8), 0 0 30px rgba(255, 215, 0, 0.15)' : 'var(--shadow-card)',
                transform: pkg.popular ? 'scale(1.03)' : 'none',
                zIndex: pkg.popular ? 2 : 1
              }}
            >
              {pkg.badge && (
                <div style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: pkg.color,
                  color: '#000',
                  padding: '4px 16px',
                  borderRadius: '30px',
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  letterSpacing: '0.1em',
                  boxShadow: `0 0 20px ${pkg.color}66`
                }}>
                  {pkg.badge}
                </div>
              )}
              
              <div>
                <span style={{ fontSize: '0.8rem', color: '#888', fontWeight: 600 }}>{pkg.subtitle}</span>
                <h3 style={{ fontSize: '1.6rem', marginTop: '0.4rem', marginBottom: '1.2rem', fontWeight: 900 }}>
                  {pkg.name}
                </h3>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '1.2rem',
                  borderRadius: '12px',
                  marginBottom: '2rem',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Starting From</span>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: pkg.color, marginTop: '0.2rem' }}>
                    {pkg.priceRange}
                  </div>
                </div>

                <ul style={{ listStyle: 'none', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  {pkg.features.map((feat, i) => (
                    <li key={i} style={{ 
                      fontSize: '0.9rem', 
                      color: '#ddd',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.8rem',
                      lineHeight: 1.5
                    }}>
                      <span style={{ color: pkg.color, fontWeight: 900, fontSize: '1rem', flexShrink: 0 }}>✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link 
                href={`/booking?eventType=${pkg.id}`} 
                className="btn-neon-outline" 
                style={{ 
                  width: '100%', 
                  textAlign: 'center', 
                  borderColor: pkg.color, 
                  color: pkg.popular ? '#000' : '#fff',
                  background: pkg.popular ? pkg.color : 'rgba(255, 255, 255, 0.04)',
                  boxShadow: pkg.popular ? `0 0 25px ${pkg.color}55` : 'none'
                }}
              >
                {pkg.ctaText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
