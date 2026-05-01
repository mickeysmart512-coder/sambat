'use client';
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';

export default function AdminDashboard() {
  const [tours, setTours] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [statePrices, setStatePrices] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'tours' | 'pricing' | 'negotiate'>('overview');

  // Negotiation State
  const [negotiationPrice, setNegotiationPrice] = useState('');
  const [revealedCode, setRevealedCode] = useState<any>(null);

  // New State Price State
  const [newStatePrice, setNewStatePrice] = useState({ stateName: '', price: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [toursRes, bookingsRes, settingsRes, statePricesRes] = await Promise.all([
      fetch('/api/tours'),
      fetch('/api/bookings'),
      fetch('/api/settings'),
      fetch('/api/state-prices')
    ]);
    
    setTours(await toursRes.json());
    setBookings(await bookingsRes.json());
    setSettings(await settingsRes.json());
    setStatePrices(await statePricesRes.json());
  };

  const handleUpdateSetting = async (key: string, value: string) => {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    });
    if (res.ok) {
      setSettings((prev: any) => ({ ...prev, [key]: value }));
    }
  };

  const handleAddStatePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/state-prices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStatePrice)
    });
    if (res.ok) {
      setNewStatePrice({ stateName: '', price: '' });
      fetchData();
    }
  };

  const generateNegotiationCode = async () => {
    if (!negotiationPrice) return;
    const res = await fetch('/api/negotiation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        price: negotiationPrice,
        expiresAt: new Date(Date.now() + 15 * 60000).toISOString() // 15 mins
      })
    });
    if (res.ok) {
      setRevealedCode(await res.json());
      setNegotiationPrice('');
    }
  };

  const totalEarnings = bookings
    .filter(b => b.status === 'Confirmed' || b.status === 'PENDING') // Assuming pending is unpaid but we track potential? No, let's say confirmed for earnings.
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const upcomingEvents = tours
    .filter(t => t.status !== 'SOLD OUT') // Or filter by date
    .sort((a, b) => new Date(a.dateTime || 0).getTime() - new Date(b.dateTime || 0).getTime());

  return (
    <main style={{ minHeight: '100vh', background: '#050505', color: '#fff' }}>
      <Navigation />
      
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', paddingTop: '80px' }}>
        {/* Sidebar */}
        <aside style={{ width: '280px', background: '#0a0a0a', borderRight: '1px solid var(--glass-border)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h4 style={{ color: '#444', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '2px' }}>Management</h4>
          {[
            { id: 'overview', label: 'OVERVIEW', icon: '📊' },
            { id: 'bookings', label: 'BOOKINGS', icon: '📅' },
            { id: 'tours', label: 'TOUR DATES', icon: '🌍' },
            { id: 'pricing', label: 'PRICING SETTINGS', icon: '💰' },
            { id: 'negotiate', label: 'NEGOTIATE PRICE', icon: '💬' },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === item.id ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                color: activeTab === item.id ? 'var(--accent-gold)' : '#888',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: 700,
                fontSize: '0.85rem',
                transition: '0.2s'
              }}>
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </aside>

        {/* Main Content Area */}
        <section style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
          <div className="container">
            
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
                  <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-gold)' }}>
                    <p style={{ color: '#888', fontSize: '0.8rem', fontWeight: 700 }}>TOTAL EARNINGS</p>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.5rem' }}>₦{totalEarnings.toLocaleString()}</h2>
                  </div>
                  <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-blue)' }}>
                    <p style={{ color: '#888', fontSize: '0.8rem', fontWeight: 700 }}>ACTIVE BOOKINGS</p>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.5rem' }}>{bookings.length}</h2>
                  </div>
                </div>

                <div className="glass-card">
                  <h3 style={{ marginBottom: '2rem' }}>UPCOMING SHOWS</h3>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {tours.slice(0, 5).map((t, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', alignItems: 'center' }}>
                        <div>
                          <div style={{ color: 'var(--accent-gold)', fontWeight: 800 }}>{t.date}</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{t.city} - {t.venue}</div>
                        </div>
                        <div style={{ padding: '0.5rem 1rem', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-gold)', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 800 }}>
                          {t.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="glass-card">
                <h3 style={{ marginBottom: '2rem' }}>MANAGE BOOKING REQUESTS</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                        <th style={{ padding: '1rem' }}>CLIENT</th>
                        <th style={{ padding: '1rem' }}>EVENT INFO</th>
                        <th style={{ padding: '1rem' }}>LOCATION</th>
                        <th style={{ padding: '1rem' }}>QUOTE</th>
                        <th style={{ padding: '1rem' }}>STATUS</th>
                        <th style={{ padding: '1rem' }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontWeight: 700 }}>{b.fullName}</div>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>{b.phone}</div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontWeight: 700 }}>{b.eventType.toUpperCase()}</div>
                            <div style={{ fontSize: '0.8rem', color: '#888' }}>{b.eventDate} @ {b.eventTime}</div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontWeight: 700 }}>{b.state}</div>
                            <div style={{ fontSize: '0.8rem', color: '#888' }}>{b.location}</div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontWeight: 800, color: 'var(--accent-gold)' }}>₦{b.totalPrice?.toLocaleString()}</div>
                            {b.isNegotiated && <div style={{ fontSize: '0.6rem', background: '#000', padding: '2px 5px', borderRadius: '4px', display: 'inline-block' }}>NEGOTIATED</div>}
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{ color: b.status === 'Confirmed' ? '#4ade80' : '#fbbf24', fontSize: '0.8rem', fontWeight: 800 }}>{b.status}</span>
                          </td>
                          <td style={{ padding: '1rem' }}>
                             <button style={{ color: 'var(--accent-blue)', background: 'none', border: 'none', cursor: 'pointer', marginRight: '1rem', fontWeight: 700 }}>CONFIRM</button>
                             <button style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>CANCEL</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                <div className="glass-card">
                  <h3 style={{ marginBottom: '2rem' }}>BASE EVENT PRICES</h3>
                  {['wedding', 'club', 'birthday', 'corporate'].map(type => (
                    <div key={type} style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.7rem', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{type} base price (₦)</label>
                      <input 
                        type="number" 
                        value={settings[`price_${type}`] || ''} 
                        onChange={(e) => handleUpdateSetting(`price_${type}`, e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  ))}
                </div>

                <div className="glass-card">
                  <h3 style={{ marginBottom: '2rem' }}>STATE SPECIFIC PRICING</h3>
                  <form onSubmit={handleAddStatePrice} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                    <input 
                      type="text" placeholder="State" required
                      value={newStatePrice.stateName} onChange={e => setNewStatePrice({...newStatePrice, stateName: e.target.value})}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <input 
                      type="number" placeholder="Price (₦)" required
                      value={newStatePrice.price} onChange={e => setNewStatePrice({...newStatePrice, price: e.target.value})}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>ADD</button>
                  </form>
                  
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    {statePrices.map((sp, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                        <span style={{ fontWeight: 700 }}>{sp.stateName}</span>
                        <span style={{ color: 'var(--accent-gold)', fontWeight: 800 }}>₦{sp.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'negotiate' && (
              <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>NEGOTIATION CODE GENERATOR</h3>
                <p style={{ color: '#888', marginBottom: '2rem' }}>Generate a one-time use code for a client after agreeing on a price via WhatsApp.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'left' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#666', marginBottom: '0.5rem' }}>AGREED PRICE (₦)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 120000"
                      value={negotiationPrice}
                      onChange={e => setNegotiationPrice(e.target.value)}
                      style={{ ...inputStyle, fontSize: '1.5rem', textAlign: 'center', padding: '1.5rem' }}
                    />
                  </div>
                  
                  <button onClick={generateNegotiationCode} className="btn-primary" style={{ padding: '1.5rem' }}>
                    REVEAL ONE-TIME CODE
                  </button>

                  {revealedCode && (
                    <div style={{ marginTop: '2rem', padding: '2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '2px dashed var(--accent-gold)' }}>
                      <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.5rem' }}>SHARE THIS CODE WITH CLIENT</p>
                      <h2 style={{ fontSize: '3rem', letterSpacing: '8px', color: 'var(--accent-gold)', fontWeight: 900 }}>{revealedCode.code}</h2>
                      <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '1rem' }}>EXPIRES IN 15 MINUTES</p>
                      <button 
                        onClick={() => { navigator.clipboard.writeText(revealedCode.code); alert('Code copied!'); }}
                        style={{ marginTop: '1rem', background: 'none', border: '1px solid #333', color: '#fff', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' }}>
                        COPY CODE
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </section>
      </div>
    </main>
  );
}

const inputStyle = {
  padding: '0.8rem',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--glass-border)',
  borderRadius: '8px',
  color: '#fff',
  outline: 'none',
  fontSize: '0.9rem',
  width: '100%'
};
