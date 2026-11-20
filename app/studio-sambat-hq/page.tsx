'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tours, setTours] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [statePrices, setStatePrices] = useState<any[]>([]);
  const [catalog, setCatalog] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'tours' | 'pricing' | 'negotiate' | 'catalog'>('overview');

  // New Catalog State
  const [newCatalogUrl, setNewCatalogUrl] = useState('');

  // Negotiation State
  const [negotiationPrice, setNegotiationPrice] = useState('');
  const [revealedCode, setRevealedCode] = useState<any>(null);

  // New State Price State
  const [newStatePrice, setNewStatePrice] = useState({ stateName: '', price: '' });

  // New Tour State
  const [newTour, setNewTour] = useState({
    date: '',
    city: '',
    venue: '',
    status: 'TICKETS'
  });

  const supabase = createClient();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth');
      return;
    }

    try {
      const res = await fetch('/api/auth/check-admin');
      const data = await res.json();
      if (!data.isAdmin) {
        router.push('/');
        return;
      }
      setIsAdmin(true);
      fetchData();
    } catch (err) {
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const [toursRes, bookingsRes, settingsRes, statePricesRes, catalogRes] = await Promise.all([
        fetch('/api/tours'),
        fetch('/api/bookings'),
        fetch('/api/settings'),
        fetch('/api/state-prices'),
        fetch('/api/catalog')
      ]);
      
      const [toursData, bookingsData, settingsData, statePricesData, catalogData] = await Promise.all([
        toursRes.json(),
        bookingsRes.json(),
        settingsRes.json(),
        statePricesRes.json(),
        catalogRes.json()
      ]);

      setTours(Array.isArray(toursData) ? toursData : []);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setSettings(settingsData || {});
      setStatePrices(Array.isArray(statePricesData) ? statePricesData : []);
      setCatalog(Array.isArray(catalogData) ? catalogData : []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  const handleUpdateSetting = async (key: string, value: string) => {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    });
    if (res.ok) {
      setSettings((prev: any) => ({ ...prev, [key]: value }));
      alert(`Updated ${key.replace(/_/g, ' ')} successfully!`);
    }
  };

  const handleUpdateBookingStatus = async (id: string, status: string) => {
    const res = await fetch('/api/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });
    if (res.ok) {
      fetchData();
    }
  };

  const handleAddTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTour.date || !newTour.city || !newTour.venue) return;
    const res = await fetch('/api/tours', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTour)
    });
    if (res.ok) {
      setNewTour({ date: '', city: '', venue: '', status: 'TICKETS' });
      fetchData();
    }
  };

  const handleDeleteTour = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tour date?')) return;
    const res = await fetch('/api/tours', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (res.ok) fetchData();
  };

  const handleAddCatalog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatalogUrl) return;
    const res = await fetch('/api/catalog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: newCatalogUrl })
    });
    if (res.ok) {
      setNewCatalogUrl('');
      fetchData();
    }
  };

  const handleDeleteCatalog = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    const res = await fetch(`/api/catalog/${id}`, { method: 'DELETE' });
    if (res.ok) fetchData();
  };

  const toggleCatalogVisibility = async (id: string, isVisible: boolean) => {
    const res = await fetch(`/api/catalog/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isVisible })
    });
    if (res.ok) fetchData();
  };

  const handleAddStatePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatePrice.stateName || !newStatePrice.price) return;
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

  const handleDeleteStatePrice = async (id: string) => {
    if (!confirm('Delete this state price rule?')) return;
    const res = await fetch('/api/state-prices', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (res.ok) fetchData();
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

  if (loading) return <div style={{ background: '#050505', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)' }}>Loading Admin Portal...</div>;
  if (!isAdmin) return null;

  const totalEarnings = (bookings || [])
    .filter(b => (b.status || '').toUpperCase() === 'CONFIRMED')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  return (
    <main style={{ minHeight: '100vh', background: '#050505', color: '#fff' }}>
      <Navigation />
      
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', paddingTop: '80px' }}>
        {/* Sidebar */}
        <aside style={{ width: '280px', background: '#0a0a0a', borderRight: '1px solid var(--glass-border)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
          <h4 style={{ color: '#444', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '2px' }}>HQ Command Center</h4>
          {[
            { id: 'overview', label: 'OVERVIEW', icon: '📊' },
            { id: 'bookings', label: 'BOOKINGS', icon: '📅' },
            { id: 'tours', label: 'TOUR DATES', icon: '🌍' },
            { id: 'catalog', label: 'CATALOG / GALLERY', icon: '📸' },
            { id: 'pricing', label: 'PRICING SETTINGS', icon: '💰' },
            { id: 'negotiate', label: 'NEGOTIATE CODE', icon: '💬' },
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
                background: activeTab === item.id ? 'rgba(0, 242, 255, 0.1)' : 'transparent',
                color: activeTab === item.id ? 'var(--accent-blue)' : '#888',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: 700,
                fontSize: '0.85rem',
                transition: '0.2s',
                borderLeft: activeTab === item.id ? '3px solid var(--accent-blue)' : '3px solid transparent'
              }}>
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </aside>

        {/* Main Content Area */}
        <section style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
          <div className="container" style={{ maxWidth: '1200px' }}>
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>DASHBOARD <span className="neon-text-blue">OVERVIEW</span></h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                  <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-gold)', padding: '2rem' }}>
                    <p style={{ color: '#888', fontSize: '0.75rem', fontWeight: 800 }}>TOTAL EARNINGS</p>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '0.5rem', color: 'var(--accent-gold)' }}>₦{totalEarnings.toLocaleString()}</h2>
                  </div>
                  <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-blue)', padding: '2rem' }}>
                    <p style={{ color: '#888', fontSize: '0.75rem', fontWeight: 800 }}>ALL BOOKINGS</p>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '0.5rem' }}>{bookings.length}</h2>
                  </div>
                  <div className="glass-card" style={{ borderLeft: '4px solid #4ade80', padding: '2rem' }}>
                    <p style={{ color: '#888', fontSize: '0.75rem', fontWeight: 800 }}>TOUR DATES</p>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '0.5rem', color: '#4ade80' }}>{tours.length}</h2>
                  </div>
                  <div className="glass-card" style={{ borderLeft: '4px solid #f472b6', padding: '2rem' }}>
                    <p style={{ color: '#888', fontSize: '0.75rem', fontWeight: 800 }}>GALLERY MEDIA</p>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '0.5rem', color: '#f472b6' }}>{catalog.length}</h2>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>RECENT INQUIRIES</h3>
                  {bookings.slice(0, 5).map(b => (
                    <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <strong>{b.fullName}</strong> — <span style={{ color: '#888' }}>{b.eventType} ({b.eventDate})</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ color: 'var(--accent-gold)', fontWeight: 800 }}>₦{(b.totalPrice || 0).toLocaleString()}</span>
                        <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '4px', background: b.status === 'CONFIRMED' ? 'rgba(74,222,128,0.2)' : 'rgba(251,191,36,0.2)', color: b.status === 'CONFIRMED' ? '#4ade80' : '#fbbf24' }}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CATALOG / GALLERY TAB */}
            {activeTab === 'catalog' && (
              <div className="glass-card" style={{ padding: '2.5rem' }}>
                <h3 style={{ marginBottom: '1rem', fontWeight: 900 }}>MANAGE CATALOG (INSTAGRAM / TIKTOK REELS)</h3>
                <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '2rem' }}>Add links to real Instagram reels or TikTok posts to display in the live highlights gallery.</p>
                
                <form onSubmit={handleAddCatalog} style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                  <input 
                    type="url" 
                    placeholder="Enter Instagram Reel URL (e.g. https://www.instagram.com/reel/...) or TikTok URL" 
                    value={newCatalogUrl}
                    onChange={e => setNewCatalogUrl(e.target.value)}
                    required
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap', padding: '0 2rem' }}>+ ADD MEDIA</button>
                </form>

                <div style={{ display: 'grid', gap: '1rem' }}>
                  {catalog.length === 0 ? (
                    <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>No catalog items added yet.</p>
                  ) : (
                    catalog.map((item) => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>
                          <span style={{ color: 'var(--accent-gold)', fontWeight: 800, marginRight: '1rem' }}>{item.platform?.toUpperCase() || 'MEDIA'}</span>
                          <span style={{ fontSize: '0.85rem', color: '#ccc' }}>{item.url}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.8rem' }}>
                          <button 
                            onClick={() => toggleCatalogVisibility(item.id, !item.isVisible)}
                            style={{ background: 'none', border: '1px solid #333', color: item.isVisible ? '#4ade80' : '#888', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                          >
                            {item.isVisible ? 'VISIBLE' : 'HIDDEN'}
                          </button>
                          <button 
                            onClick={() => handleDeleteCatalog(item.id)}
                            style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                          >
                            DELETE
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TOUR DATES TAB */}
            {activeTab === 'tours' && (
              <div className="glass-card" style={{ padding: '2.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem', fontWeight: 900 }}>TOUR & EVENT SCHEDULE MANAGEMENT</h3>
                
                {/* Add Tour Form */}
                <form onSubmit={handleAddTour} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 800 }}>DATE (DISPLAY)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. OCT 15" 
                      value={newTour.date} 
                      onChange={e => setNewTour({ ...newTour, date: e.target.value })} 
                      required 
                      style={inputStyle} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 800 }}>CITY / STATE</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Lagos, Nigeria" 
                      value={newTour.city} 
                      onChange={e => setNewTour({ ...newTour, city: e.target.value })} 
                      required 
                      style={inputStyle} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 800 }}>VENUE</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Landmark Centre" 
                      value={newTour.venue} 
                      onChange={e => setNewTour({ ...newTour, venue: e.target.value })} 
                      required 
                      style={inputStyle} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 800 }}>STATUS</label>
                    <select 
                      value={newTour.status} 
                      onChange={e => setNewTour({ ...newTour, status: e.target.value })} 
                      style={inputStyle}
                    >
                      <option value="TICKETS">TICKETS</option>
                      <option value="SOLD OUT">SOLD OUT</option>
                      <option value="LIVE">LIVE</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>+ ADD TOUR DATE</button>
                  </div>
                </form>

                {/* Tour List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {tours.length === 0 ? (
                    <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>No tour dates scheduled.</p>
                  ) : (
                    tours.map(t => (
                      <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                          <span style={{ color: 'var(--accent-gold)', fontWeight: 900, minWidth: '80px' }}>{t.date}</span>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{t.city}</div>
                            <div style={{ color: '#888', fontSize: '0.85rem' }}>{t.venue}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <span style={{ 
                            padding: '0.3rem 0.8rem', 
                            borderRadius: '4px', 
                            fontSize: '0.75rem', 
                            fontWeight: 800,
                            background: t.status === 'SOLD OUT' ? 'rgba(239,68,68,0.2)' : 'rgba(0,242,255,0.2)',
                            color: t.status === 'SOLD OUT' ? '#ef4444' : 'var(--accent-blue)'
                          }}>
                            {t.status}
                          </span>
                          <button 
                            onClick={() => handleDeleteTour(t.id)}
                            style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}
                          >
                            DELETE
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <div className="glass-card" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h3 style={{ fontWeight: 900 }}>MANAGE BOOKING REQUESTS</h3>
                  <span style={{ color: '#888', fontSize: '0.85rem' }}>{bookings.length} Total</span>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '850px' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                        <th style={{ padding: '1rem', color: '#666', fontSize: '0.75rem' }}>CLIENT</th>
                        <th style={{ padding: '1rem', color: '#666', fontSize: '0.75rem' }}>EVENT</th>
                        <th style={{ padding: '1rem', color: '#666', fontSize: '0.75rem' }}>LOCATION / VENUE</th>
                        <th style={{ padding: '1rem', color: '#666', fontSize: '0.75rem' }}>PRICE</th>
                        <th style={{ padding: '1rem', color: '#666', fontSize: '0.75rem' }}>STATUS</th>
                        <th style={{ padding: '1rem', color: '#666', fontSize: '0.75rem' }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>No booking requests yet.</td>
                        </tr>
                      ) : (
                        bookings.map((b) => (
                          <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                            <td style={{ padding: '1.2rem 1rem' }}>
                              <div style={{ fontWeight: 700 }}>{b.fullName}</div>
                              <div style={{ fontSize: '0.8rem', color: '#888' }}>{b.email}</div>
                              {b.phone && <div style={{ fontSize: '0.75rem', color: '#666' }}>{b.phone}</div>}
                            </td>
                            <td style={{ padding: '1.2rem 1rem' }}>
                              <div style={{ fontWeight: 700, textTransform: 'capitalize' }}>{b.eventType}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)' }}>{b.eventDate} {b.eventTime}</div>
                            </td>
                            <td style={{ padding: '1.2rem 1rem' }}>
                              <div style={{ fontSize: '0.85rem' }}>{b.state}</div>
                              <div style={{ fontSize: '0.75rem', color: '#888' }}>{b.location}</div>
                            </td>
                            <td style={{ padding: '1.2rem 1rem' }}>
                              <div style={{ fontWeight: 800, color: 'var(--accent-gold)' }}>₦{(b.totalPrice || 0).toLocaleString()}</div>
                              {b.isNegotiated && <span style={{ fontSize: '0.65rem', color: 'var(--accent-blue)' }}>NEGOTIATED</span>}
                            </td>
                            <td style={{ padding: '1.2rem 1rem' }}>
                              <span style={{ 
                                padding: '0.3rem 0.6rem', 
                                borderRadius: '4px', 
                                fontSize: '0.75rem', 
                                fontWeight: 800,
                                background: (b.status || '').toUpperCase() === 'CONFIRMED' ? 'rgba(74,222,128,0.2)' : (b.status || '').toUpperCase() === 'PENDING' ? 'rgba(251,191,36,0.2)' : 'rgba(239,68,68,0.2)',
                                color: (b.status || '').toUpperCase() === 'CONFIRMED' ? '#4ade80' : (b.status || '').toUpperCase() === 'PENDING' ? '#fbbf24' : '#ef4444'
                              }}>
                                {b.status}
                              </span>
                            </td>
                            <td style={{ padding: '1.2rem 1rem' }}>
                              <div style={{ display: 'flex', gap: '0.4rem' }}>
                                <button 
                                  onClick={() => handleUpdateBookingStatus(b.id, 'CONFIRMED')}
                                  title="Confirm booking"
                                  style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid #4ade80', color: '#4ade80', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700 }}
                                >
                                  CONFIRM
                                </button>
                                <button 
                                  onClick={() => handleUpdateBookingStatus(b.id, 'REJECTED')}
                                  title="Reject booking"
                                  style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#ef4444', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700 }}
                                >
                                  REJECT
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PRICING SETTINGS TAB */}
            {activeTab === 'pricing' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {/* Base Category Prices */}
                <div className="glass-card" style={{ padding: '2.5rem' }}>
                  <h3 style={{ marginBottom: '1.5rem', fontWeight: 900 }}>EVENT BASE PRICING (₦)</h3>
                  <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '2rem' }}>Set default base rates for each event category.</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                    {[
                      { key: 'price_wedding', label: 'Wedding Performance' },
                      { key: 'price_club', label: 'Club Night Set' },
                      { key: 'price_birthday', label: 'Birthday Party' },
                      { key: 'price_corporate', label: 'Corporate Event' },
                      { key: 'travel_fee', label: 'Default Travel Fee' },
                      { key: 'whatsapp_number', label: 'WhatsApp Contact (+234...)' },
                    ].map(field => (
                      <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-gold)' }}>{field.label.toUpperCase()}</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input 
                            type="text" 
                            defaultValue={settings[field.key] || ''} 
                            id={`setting-${field.key}`}
                            style={inputStyle} 
                          />
                          <button 
                            onClick={() => {
                              const val = (document.getElementById(`setting-${field.key}`) as HTMLInputElement)?.value;
                              handleUpdateSetting(field.key, val);
                            }}
                            className="btn-primary" 
                            style={{ padding: '0 1rem', fontSize: '0.75rem' }}
                          >
                            SAVE
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* State-Specific Prices */}
                <div className="glass-card" style={{ padding: '2.5rem' }}>
                  <h3 style={{ marginBottom: '1rem', fontWeight: 900 }}>STATE-SPECIFIC SURCHARGES / RATES</h3>
                  <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '2rem' }}>Define custom override pricing for specific Nigerian states.</p>
                  
                  <form onSubmit={handleAddStatePrice} style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
                    <input 
                      type="text" 
                      placeholder="State Name (e.g. Abuja (FCT), Rivers, Oyo)" 
                      value={newStatePrice.stateName}
                      onChange={e => setNewStatePrice({ ...newStatePrice, stateName: e.target.value })}
                      required
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <input 
                      type="number" 
                      placeholder="Override Total Price (₦)" 
                      value={newStatePrice.price}
                      onChange={e => setNewStatePrice({ ...newStatePrice, price: e.target.value })}
                      required
                      style={{ ...inputStyle, width: '220px' }}
                    />
                    <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap', padding: '0 1.5rem' }}>+ ADD STATE RATE</button>
                  </form>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    {statePrices.map(sp => (
                      <div key={sp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                        <div>
                          <div style={{ fontWeight: 800 }}>{sp.stateName}</div>
                          <div style={{ color: 'var(--accent-gold)', fontWeight: 800, fontSize: '0.85rem' }}>₦{(sp.price || 0).toLocaleString()}</div>
                        </div>
                        <button 
                          onClick={() => handleDeleteStatePrice(sp.id)}
                          style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* NEGOTIATE TAB */}
            {activeTab === 'negotiate' && (
              <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
                <h3 style={{ marginBottom: '1rem', fontWeight: 900 }}>NEGOTIATION CODE GENERATOR</h3>
                <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '2.5rem' }}>
                  Generate a time-limited one-time unlock code for a negotiated client price. Give this code to the client on WhatsApp to apply on the booking page.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <input 
                    type="number" 
                    placeholder="Agreed Price in ₦ (e.g. 120000)"
                    value={negotiationPrice}
                    onChange={e => setNegotiationPrice(e.target.value)}
                    style={{ ...inputStyle, fontSize: '1.5rem', textAlign: 'center', padding: '1.2rem' }}
                  />
                  <button onClick={generateNegotiationCode} className="btn-primary" style={{ padding: '1.2rem', fontSize: '1rem' }}>
                    GENERATE EXCLUSIVE CODE
                  </button>
                  {revealedCode && (
                    <div style={{ marginTop: '1.5rem', border: '2px dashed var(--accent-gold)', borderRadius: '12px', padding: '2rem', background: 'rgba(212,175,55,0.05)' }}>
                      <span style={{ fontSize: '0.8rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>One-Time Client Code (Valid 15 Mins)</span>
                      <h2 style={{ fontSize: '3.5rem', letterSpacing: '10px', color: 'var(--accent-gold)', margin: '1rem 0' }}>{revealedCode.code}</h2>
                      <p style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.9rem' }}>Locked Price: ₦{(revealedCode.price || 0).toLocaleString()}</p>
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
  padding: '0.9rem',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--glass-border)',
  borderRadius: '8px',
  color: '#fff',
  outline: 'none',
  fontSize: '0.9rem',
  width: '100%'
};
