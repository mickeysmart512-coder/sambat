'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { createClient } from '@/lib/supabase/client';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);

  const supabase = createClient();

  useEffect(() => {
    const fetchUserAndBookings = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) {
          router.push('/auth');
          return;
        }
        setUser(currentUser);

        const response = await fetch(`/api/bookings?email=${encodeURIComponent(currentUser.email || '')}`);
        if (response.ok) {
          const data = await response.json();
          setBookings(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndBookings();
  }, [router]);

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--accent-gold)', fontSize: '1.2rem', fontWeight: 700 }}>LOADING DASHBOARD...</p>
      </main>
    );
  }

  const clientName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Client';
  const totalCount = bookings.length;
  const activeCount = bookings.filter(b => (b.status || '').toUpperCase() === 'PENDING').length;
  const confirmedCount = bookings.filter(b => (b.status || '').toUpperCase() === 'CONFIRMED').length;

  return (
    <main style={{ minHeight: '100vh', background: '#000' }}>
      <Navigation />
      
      <section style={{ padding: '8rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>USER <span className="text-gradient">DASHBOARD</span></h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 10px #4ade80' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '1px' }}>DJ SAMBAT IS AVAILABLE FOR BOOKINGS</span>
              </div>
              <p style={{ color: '#888' }}>Welcome back, <strong style={{ color: '#fff' }}>{clientName}</strong> ({user?.email}). Here are your booking updates.</p>
            </div>
            <button className="btn-primary" onClick={() => router.push('/booking')}>+ New Booking</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '3px solid var(--glass-border)' }}>
              <p style={{ color: '#666', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Bookings</p>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.5rem' }}>{totalCount}</h3>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '3px solid var(--accent-gold)' }}>
              <p style={{ color: '#666', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Pending Review</p>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-gold)', marginTop: '0.5rem' }}>{activeCount}</h3>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '3px solid var(--accent-blue)' }}>
              <p style={{ color: '#666', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Confirmed Events</p>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-blue)', marginTop: '0.5rem' }}>{confirmedCount}</h3>
            </div>
          </div>

          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '1px' }}>YOUR BOOKINGS</h3>
              <span style={{ fontSize: '0.8rem', color: '#888' }}>{bookings.length} {bookings.length === 1 ? 'request' : 'requests'} found</span>
            </div>
            
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '1.5rem' }}>You don't have any event bookings yet.</p>
                <button className="btn-primary" onClick={() => router.push('/booking')}>Book Your First Experience</button>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '650px' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                      <th style={{ padding: '1rem', color: '#666', fontSize: '0.7rem' }}>DATE / TIME</th>
                      <th style={{ padding: '1rem', color: '#666', fontSize: '0.7rem' }}>EVENT TYPE</th>
                      <th style={{ padding: '1rem', color: '#666', fontSize: '0.7rem' }}>LOCATION</th>
                      <th style={{ padding: '1rem', color: '#666', fontSize: '0.7rem' }}>TOTAL QUOTE</th>
                      <th style={{ padding: '1rem', color: '#666', fontSize: '0.7rem' }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => {
                      const st = (booking.status || 'PENDING').toUpperCase();
                      const isConfirmed = st === 'CONFIRMED';
                      const isPending = st === 'PENDING';
                      return (
                        <tr key={booking.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                          <td style={{ padding: '1.2rem 1rem' }}>
                            <div style={{ fontWeight: 800, color: '#fff' }}>{booking.eventDate}</div>
                            {booking.eventTime && <div style={{ fontSize: '0.75rem', color: '#888' }}>{booking.eventTime}</div>}
                          </td>
                          <td style={{ padding: '1.2rem 1rem', fontSize: '0.9rem', textTransform: 'capitalize' }}>
                            {booking.eventType}
                          </td>
                          <td style={{ padding: '1.2rem 1rem', fontSize: '0.85rem', color: '#bbb' }}>
                            <div>{booking.state}</div>
                            <div style={{ fontSize: '0.75rem', color: '#777' }}>{booking.location}</div>
                          </td>
                          <td style={{ padding: '1.2rem 1rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                            ₦{(booking.totalPrice || 0).toLocaleString()}
                          </td>
                          <td style={{ padding: '1.2rem 1rem' }}>
                            <span style={{ 
                              padding: '0.35rem 0.8rem', 
                              borderRadius: '6px', 
                              fontSize: '0.7rem', 
                              fontWeight: 800,
                              letterSpacing: '0.5px',
                              background: isConfirmed ? 'rgba(74, 222, 128, 0.15)' : isPending ? 'rgba(251, 191, 36, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              color: isConfirmed ? '#4ade80' : isPending ? '#fbbf24' : '#ef4444',
                              border: isConfirmed ? '1px solid rgba(74, 222, 128, 0.3)' : isPending ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
                            }}>
                              {st}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
