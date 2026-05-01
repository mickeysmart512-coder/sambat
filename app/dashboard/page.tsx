'use client';
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';

export default function DashboardPage() {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings');
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };
    fetchBookings();
  }, []);

  return (
    <main style={{ minHeight: '100vh', background: '#000' }}>
      <Navigation />
      
      <section style={{ padding: '8rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
            <div>
              <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>USER <span className="text-gradient">DASHBOARD</span></h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 10px #4ade80' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '1px' }}>DJ SAMBAT IS AVAILABLE FOR BOOKINGS</span>
              </div>
              <p style={{ color: '#888' }}>Welcome back, John Doe. Here are your booking updates.</p>
            </div>
            <button className="btn-primary" onClick={() => window.location.href = '/booking'}>New Booking</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <p style={{ color: '#666', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Bookings</p>
              <h3 style={{ fontSize: '2rem', fontWeight: 900 }}>12</h3>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <p style={{ color: '#666', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Active Requests</p>
              <h3 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-gold)' }}>1</h3>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <p style={{ color: '#666', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Completed</p>
              <h3 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-blue)' }}>11</h3>
            </div>
          </div>

          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>BOOKING HISTORY</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                    <th style={{ padding: '1rem', color: '#666', fontSize: '0.7rem' }}>ID</th>
                    <th style={{ padding: '1rem', color: '#666', fontSize: '0.7rem' }}>DATE</th>
                    <th style={{ padding: '1rem', color: '#666', fontSize: '0.7rem' }}>EVENT</th>
                    <th style={{ padding: '1rem', color: '#666', fontSize: '0.7rem' }}>PRICE</th>
                    <th style={{ padding: '1rem', color: '#666', fontSize: '0.7rem' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '1rem', fontWeight: 700, fontSize: '0.9rem' }}>{booking.id}</td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{booking.eventDate || booking.date}</td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{booking.eventType || booking.type}</td>
                      <td style={{ padding: '1rem', fontWeight: 800 }}>₦{(booking.totalPrice || 0).toLocaleString()}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.2rem 0.6rem', 
                          borderRadius: '4px', 
                          fontSize: '0.65rem', 
                          fontWeight: 800,
                          background: booking.status === 'Confirmed' ? 'rgba(0,255,0,0.1)' : booking.status === 'Pending' ? 'rgba(255,255,0,0.1)' : 'rgba(255,255,255,0.1)',
                          color: booking.status === 'Confirmed' ? '#4ade80' : booking.status === 'Pending' ? '#fbbf24' : '#fff'
                        }}>
                          {booking.status?.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
