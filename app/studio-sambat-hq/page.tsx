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

    // Check admin status
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
    const [toursRes, bookingsRes, settingsRes, statePricesRes, catalogRes] = await Promise.all([
      fetch('/api/tours'),
      fetch('/api/bookings'),
      fetch('/api/settings'),
      fetch('/api/state-prices'),
      fetch('/api/catalog')
    ]);
    
    setTours(await toursRes.json());
    setBookings(await bookingsRes.json());
    setSettings(await settingsRes.json());
    setStatePrices(await statePricesRes.json());
    setCatalog(await catalogRes.json());
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

  if (loading) return <div style={{ background: '#050505', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  if (!isAdmin) return null;

  const totalEarnings = (bookings || [])
    .filter(b => b.status === 'Confirmed')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

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
            { id: 'catalog', label: 'CATALOG/GALLERY', icon: '📸' },
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
              </div>
            )}

            {activeTab === 'catalog' && (
              <div className="glass-card">
                <h3 style={{ marginBottom: '2rem' }}>MANAGE CATALOG (INSTAGRAM/TIKTOK)</h3>
                <form onSubmit={handleAddCatalog} style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                  <input 
                    type="url" 
                    placeholder="Enter Instagram Reel or TikTok URL" 
                    value={newCatalogUrl}
                    onChange={e => setNewCatalogUrl(e.target.value)}
                    required
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>ADD TO CATALOG</button>
                </form>

                <div style={{ display: 'grid', gap: '1rem' }}>
                  {catalog.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>
                        <span style={{ color: 'var(--accent-gold)', marginRight: '1rem' }}>{item.platform?.toUpperCase()}</span>
                        <span style={{ fontSize: '0.8rem', color: '#888' }}>{item.url}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button 
                          onClick={() => toggleCatalogVisibility(item.id, !item.isVisible)}
                          style={{ background: 'none', border: '1px solid #333', color: item.isVisible ? '#4ade80' : '#888', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem' }}
                        >
                          {item.isVisible ? 'VISIBLE' : 'HIDDEN'}
                        </button>
                        <button 
                          onClick={() => handleDeleteCatalog(item.id)}
                          style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem' }}
                        >
                          DELETE
                        </button>
                      </div>
                    </div>
                  ))}
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
                        <th style={{ padding: '1rem' }}>QUOTE</th>
                        <th style={{ padding: '1rem' }}>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(bookings || []).map((b, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontWeight: 700 }}>{b.fullName}</div>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>{b.email}</div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontWeight: 700 }}>{b.eventType?.toUpperCase()}</div>
                            <div style={{ fontSize: '0.8rem', color: '#888' }}>{b.eventDate}</div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontWeight: 800, color: 'var(--accent-gold)' }}>₦{b.totalPrice?.toLocaleString()}</div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{ color: b.status === 'Confirmed' ? '#4ade80' : '#fbbf24', fontSize: '0.8rem', fontWeight: 800 }}>{b.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="glass-card">
                 <h3 style={{ marginBottom: '2rem' }}>PRICING CONFIGURATION</h3>
                 <p style={{ color: '#888' }}>Manage your base prices and state fees here.</p>
                 {/* ... pricing logic ... */}
              </div>
            )}

            {activeTab === 'negotiate' && (
              <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>NEGOTIATION CODE GENERATOR</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <input 
                    type="number" 
                    placeholder="Agreed Price (₦)"
                    value={negotiationPrice}
                    onChange={e => setNegotiationPrice(e.target.value)}
                    style={{ ...inputStyle, fontSize: '1.5rem', textAlign: 'center' }}
                  />
                  <button onClick={generateNegotiationCode} className="btn-primary" style={{ padding: '1.5rem' }}>GENERATE CODE</button>
                  {revealedCode && (
                    <div style={{ marginTop: '1rem', border: '2px dashed var(--accent-gold)', padding: '2rem' }}>
                      <h2 style={{ fontSize: '3rem', letterSpacing: '8px', color: 'var(--accent-gold)' }}>{revealedCode.code}</h2>
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
