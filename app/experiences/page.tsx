'use client';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

const experiences = [
  { id: 1, title: 'Summer Vibes 2024', location: 'Lagos, Nigeria', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZ25icmRscXJqYmRscXJqYmRscXJqYmRscXJqYmRscXJqJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l41lTfuxV5lZJv5eU/giphy.gif' },
  { id: 2, title: 'Club Night Extravaganza', location: 'Abuja, Nigeria', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZ25icmRscXJqYmRscXJqYmRscXJqYmRscXJqYmRscXJqJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxP5O0d9NnO/giphy.gif' },
  { id: 3, title: 'Wedding Bliss', location: 'Ibadan, Nigeria', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZ25icmRscXJqYmRscXJqYmRscXJqYmRscXJqYmRscXJqJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/26vUAAO27x1O9Rk40/giphy.gif' },
  { id: 4, title: 'Festival Main Stage', location: 'Accra, Ghana', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZ25icmRscXJqYmRscXJqYmRscXJqYmRscXJqYmRscXJqJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l0MYK0VnZ7YV7lD4k/giphy.gif' },
  { id: 5, title: 'Private Rooftop Party', location: 'Victoria Island, Lagos', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZ25icmRscXJqYmRscXJqYmRscXJqYmRscXJqYmRscXJqJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxP5O0d9NnO/giphy.gif' },
  { id: 6, title: 'Beach Bash', location: 'Oniru Beach, Lagos', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZ25icmRscXJqYmRscXJqYmRscXJqYmRscXJqYmRscXJqJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l41lTfuxV5lZJv5eU/giphy.gif' },
];

export default function ExperiencesPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#000' }}>
      <Navigation />
      
      <section style={{ padding: '10rem 0 5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 className="section-title">The <span className="text-gradient">Experience</span></h2>
            <p style={{ color: '#888', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
              Witness the energy, the crowd, and the vibe. Every performance is a unique journey curated by DJ Sambat.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
            gap: '2.5rem' 
          }}>
            {experiences.map((exp) => (
              <div key={exp.id} className="glass-card" style={{ padding: '0', overflow: 'hidden', transition: 'transform 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ position: 'relative', height: '400px', width: '100%' }}>
                  <img 
                    src={exp.gif} 
                    alt={exp.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '0', 
                    left: '0', 
                    right: '0', 
                    padding: '2rem', 
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{exp.title}</h3>
                    <p style={{ color: 'var(--accent-gold)', fontSize: '0.9rem', fontWeight: 700 }}>{exp.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '6rem' }}>
            <Link href="/booking" className="btn-primary" style={{ padding: '1.5rem 4rem', fontSize: '1.2rem' }}>
              BOOK THE EXPERIENCE
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
