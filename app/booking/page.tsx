'use client';
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

const NIGERIAN_STATES = [
  'Lagos', 'Abuja (FCT)', 'Rivers', 'Oyo', 'Kano', 'Ogun', 'Enugu', 'Edo', 'Delta', 'Anambra',
  'Kaduna', 'Plateau', 'Akwa Ibom', 'Imo', 'Bauchi', 'Benue', 'Borno', 'Cross River', 
  'Ebonyi', 'Ekiti', 'Gombe', 'Jigawa', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Nasarawa', 
  'Niger', 'Ondo', 'Osun', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

const EVENT_TYPES = [
  { id: 'wedding', name: 'Wedding Experience', icon: '💍', desc: 'Bridal entry hype & energetic reception' },
  { id: 'club', name: 'Club / Party Headline', icon: '🎧', desc: 'High-octane club set & crowd shutdown' },
  { id: 'corporate', name: 'Concert & Corporate', icon: '🎤', desc: 'Festival mainstage & brand activations' },
  { id: 'birthday', name: 'Birthday / Private VIP', icon: '🎂', desc: 'Intimate celebrity turnup & celebrations' },
];

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [statePrices, setStatePrices] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [createdBooking, setCreatedBooking] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    eventDate: '',
    eventTime: '',
    eventType: 'wedding',
    state: 'Lagos',
    location: '',
    venue: '',
    message: '',
    negotiationCode: ''
  });

  const [isNegotiating, setIsNegotiating] = useState(false);
  const [negotiationTimer, setNegotiationTimer] = useState(900);
  const [appliedCodeData, setAppliedCodeData] = useState<any>(null);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);

  // Auto-fill from Supabase Auth and URL query
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const u = data?.user;
      if (u) {
        const fullName = u.user_metadata?.full_name || '';
        const parts = fullName.split(' ');
        setFormData(prev => ({
          ...prev,
          email: u.email || prev.email,
          firstName: parts[0] || prev.firstName,
          lastName: parts.slice(1).join(' ') || prev.lastName
        }));
      }
    }).catch(() => {});

    // Check query params for eventType
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlEventType = urlParams.get('eventType');
      if (urlEventType) {
        setFormData(prev => ({ ...prev, eventType: urlEventType }));
      }
    }

    // Fetch settings and state prices
    Promise.all([
      fetch('/api/settings').then(res => res.json()),
      fetch('/api/state-prices').then(res => res.json())
    ]).then(([settingsData, pricesData]) => {
      setSettings(settingsData);
      setStatePrices(Array.isArray(pricesData) ? pricesData : []);
    }).catch(err => console.error(err));
  }, []);

  // Timer countdown for negotiation modal
  useEffect(() => {
    if (!isNegotiating || negotiationTimer <= 0) return;
    const interval = setInterval(() => {
      setNegotiationTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isNegotiating, negotiationTimer]);

  // Calculate estimated price dynamically
  const calculatePrice = () => {
    if (appliedCodeData) return appliedCodeData.price;
    if (!settings) return 150000;

    let base = parseFloat(settings[`price_${formData.eventType}`] || '150000');
    
    // Check state override
    const stateMatch = statePrices.find(sp => sp.stateName === formData.state);
    if (stateMatch) {
      return stateMatch.price;
    }

    // Default travel fee for non-Lagos states
    if (formData.state && formData.state !== 'Lagos') {
      const travelFee = parseFloat(settings.travel_fee || '40000');
      base += travelFee;
    }

    return base;
  };

  const estimatedPrice = calculatePrice();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNegotiateWhatsApp = () => {
    setIsNegotiating(true);
    setNegotiationTimer(900); // 15 mins
    const waNum = (settings?.whatsapp_number || '2348000000000').replace(/[^0-9]/g, '');
    const message = `Hi Sambat, I'm booking an experience for ${formData.eventDate || '[Date]'} in ${formData.state} (${formData.eventType.toUpperCase()}) and would like to agree on a negotiated rate. Client: ${formData.firstName} ${formData.lastName}.`;
    window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const verifyCode = async () => {
    if (!formData.negotiationCode) return;
    setIsVerifyingCode(true);
    setCodeError(null);
    try {
      const res = await fetch(`/api/negotiation?code=${encodeURIComponent(formData.negotiationCode.trim())}`);
      const data = await res.json();
      if (res.ok && data) {
        setAppliedCodeData(data);
      } else {
        setCodeError(data?.error || 'Invalid or expired negotiation code.');
      }
    } catch (err) {
      setCodeError('Error verifying code. Please try again.');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const payload = {
      ...formData,
      fullName: `${formData.firstName} ${formData.lastName}`.trim(),
      totalPrice: estimatedPrice,
      isNegotiated: !!appliedCodeData,
      agreedPrice: appliedCodeData ? appliedCodeData.price : null,
      negotiationCode: appliedCodeData ? appliedCodeData.code : null
    };
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        const data = await response.json();
        setCreatedBooking(data);
        setSubmitted(true);
      } else {
        alert('Failed to submit booking. Please check details and try again.');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Error submitting booking. Please check connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (submitted) {
    return (
      <main style={{ minHeight: '100vh', background: '#070709', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <Navigation />
        <div className="glass-card" style={{ textAlign: 'center', maxWidth: '580px', padding: '3.5rem 2.5rem', border: '1px solid var(--accent-gold)' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ color: 'var(--accent-gold)', fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.8rem' }}>
            BOOKING REQUEST SENT!
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#ccc', marginBottom: '2rem', lineHeight: 1.7 }}>
            Your date for <strong style={{ color: '#fff' }}>{formData.eventDate}</strong> in <strong style={{ color: '#fff' }}>{formData.state}</strong> has been received. DJ Sambat's management team will contact you directly to confirm rider &amp; itinerary.
          </p>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2.5rem', textAlign: 'left', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#888', fontSize: '0.85rem' }}>Reference ID:</span>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.85rem' }}>{createdBooking?.id || 'PENDING'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#888', fontSize: '0.85rem' }}>Total Locked Quote:</span>
              <span style={{ color: 'var(--accent-gold)', fontWeight: 900, fontSize: '1.1rem' }}>₦{estimatedPrice.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888', fontSize: '0.85rem' }}>Status:</span>
              <span style={{ color: '#fbbf24', fontWeight: 800, fontSize: '0.85rem' }}>PENDING CONFIRMATION</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard" className="btn-neon-blue">
              VIEW IN MY DASHBOARD
            </Link>
            <Link href="/" className="btn-secondary">
              BACK TO HOME
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: 'radial-gradient(circle at 50% 0%, rgba(0, 242, 255, 0.08) 0%, transparent 60%), #070709' }}>
      <Navigation />
      
      <section style={{ padding: '8rem 0 5rem' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="badge-live" style={{ marginBottom: '1rem' }}>
              <span className="pulse-dot" />
              <span>OFFICIAL EVENT BOOKING RESERVATION</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)', fontWeight: 900, marginBottom: '0.8rem' }}>
              BOOK THE <span className="text-gradient">EXPERIENCE</span>
            </h1>
            <p style={{ color: '#aaa', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
              Secure DJ Sambat for your upcoming wedding, concert, club headline, or private celebration.
            </p>

            {/* Stepper Indicator */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: step >= 1 ? 'var(--accent-blue)' : '#333',
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '0.8rem'
                }}>1</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: step >= 1 ? '#fff' : '#666' }}>EVENT &amp; LOCATION</span>
              </div>
              <div style={{ width: '40px', height: '2px', background: step === 2 ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: step === 2 ? 'var(--accent-gold)' : '#333',
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '0.8rem'
                }}>2</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: step === 2 ? '#fff' : '#666' }}>QUOTE &amp; CONFIRM</span>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="glass-card" style={{ padding: '3rem 2.5rem', position: 'relative' }}>
            
            {/* Live Instant Quote Floating Badge */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.2rem 1.8rem',
              background: 'rgba(0, 242, 255, 0.05)',
              borderRadius: '16px',
              border: '1px solid rgba(0, 242, 255, 0.25)',
              marginBottom: '2.5rem',
              boxShadow: '0 0 25px rgba(0, 242, 255, 0.1)'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Live Estimated Investment
                </span>
                <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.2rem' }}>
                  Includes base performance fee + {formData.state} travel logistics
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                {appliedCodeData && (
                  <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '0.9rem', marginRight: '0.8rem' }}>
                    ₦{calculatePrice().toLocaleString()}
                  </span>
                )}
                <span style={{ fontSize: '2rem', fontWeight: 900, color: appliedCodeData ? '#4ade80' : 'var(--accent-gold)' }}>
                  ₦{estimatedPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* STEP 1: EVENT DETAILS */}
            {step === 1 ? (
              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* Visual Event Type Selector Cards */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                    1. SELECT YOUR EVENT CATEGORY
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    {EVENT_TYPES.map(cat => {
                      const isSelected = formData.eventType === cat.id;
                      return (
                        <div
                          key={cat.id}
                          onClick={() => setFormData(prev => ({ ...prev, eventType: cat.id }))}
                          style={{
                            padding: '1.2rem',
                            borderRadius: '14px',
                            background: isSelected ? 'rgba(0, 242, 255, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                            border: isSelected ? '2px solid var(--accent-blue)' : '1px solid var(--glass-border)',
                            cursor: 'pointer',
                            transition: 'var(--transition)',
                            boxShadow: isSelected ? '0 0 20px rgba(0, 242, 255, 0.25)' : 'none'
                          }}
                        >
                          <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{cat.icon}</div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: isSelected ? 'var(--accent-blue)' : '#fff', marginBottom: '0.3rem' }}>
                            {cat.name}
                          </h4>
                          <p style={{ fontSize: '0.75rem', color: '#888', lineHeight: 1.4 }}>{cat.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* State & Venue Details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-blue)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                      EVENT STATE (NIGERIA)
                    </label>
                    <select name="state" required value={formData.state} onChange={handleInputChange}>
                      {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-blue)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                      VENUE / CITY
                    </label>
                    <input 
                      type="text" 
                      name="location" 
                      required 
                      value={formData.location} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Landmark Event Centre, VI, Lagos" 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-blue)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                      EVENT DATE
                    </label>
                    <input 
                      type="date" 
                      name="eventDate" 
                      required 
                      value={formData.eventDate} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-blue)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                      START TIME
                    </label>
                    <input 
                      type="time" 
                      name="eventTime" 
                      required 
                      value={formData.eventTime} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>

                {/* Client Contact Details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-blue)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                      FIRST NAME
                    </label>
                    <input 
                      type="text" 
                      name="firstName" 
                      required 
                      value={formData.firstName} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Chukwuma" 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-blue)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                      LAST NAME
                    </label>
                    <input 
                      type="text" 
                      name="lastName" 
                      required 
                      value={formData.lastName} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Adeleke" 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-blue)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                      PHONE (WHATSAPP ACTIVE)
                    </label>
                    <input 
                      type="tel" 
                      name="phone" 
                      required 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      placeholder="+234..." 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-blue)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                      EMAIL ADDRESS
                    </label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      placeholder="john@example.com" 
                    />
                  </div>
                </div>

                <button type="submit" className="btn-neon-blue" style={{ width: '100%', padding: '1.2rem', fontSize: '1.05rem', marginTop: '1rem' }}>
                  PROCEED TO QUOTE &amp; NEGOTIATE →
                </button>
              </form>
            ) : (
              /* STEP 2: SUMMARY, NEGOTIATION & CONFIRMATION */
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ color: 'var(--accent-gold)', marginBottom: '1.2rem', fontWeight: 900, fontSize: '1.5rem' }}>
                    BOOKING ITINERARY SUMMARY
                  </h3>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.5rem',
                    textAlign: 'left',
                    background: 'rgba(255,255,255,0.02)',
                    padding: '2rem',
                    borderRadius: '16px',
                    border: '1px solid var(--glass-border)'
                  }}>
                    <div>
                      <span style={{ color: '#888', fontSize: '0.75rem', fontWeight: 800 }}>PRIMARY CLIENT</span>
                      <p style={{ fontWeight: 800, color: '#fff', marginTop: '0.2rem' }}>{formData.firstName} {formData.lastName}</p>
                      <span style={{ fontSize: '0.75rem', color: '#aaa' }}>{formData.phone} • {formData.email}</span>
                    </div>

                    <div>
                      <span style={{ color: '#888', fontSize: '0.75rem', fontWeight: 800 }}>DATE &amp; TIME</span>
                      <p style={{ fontWeight: 800, color: 'var(--accent-gold)', marginTop: '0.2rem' }}>{formData.eventDate}</p>
                      <span style={{ fontSize: '0.75rem', color: '#aaa' }}>@ {formData.eventTime}</span>
                    </div>

                    <div>
                      <span style={{ color: '#888', fontSize: '0.75rem', fontWeight: 800 }}>EXPERIENCE TYPE</span>
                      <p style={{ fontWeight: 800, color: 'var(--accent-blue)', marginTop: '0.2rem', textTransform: 'uppercase' }}>{formData.eventType}</p>
                    </div>

                    <div>
                      <span style={{ color: '#888', fontSize: '0.75rem', fontWeight: 800 }}>VENUE LOCATION</span>
                      <p style={{ fontWeight: 800, color: '#fff', marginTop: '0.2rem' }}>{formData.state}</p>
                      <span style={{ fontSize: '0.75rem', color: '#aaa' }}>{formData.location}</span>
                    </div>
                  </div>
                </div>

                {/* Additional Event Message */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-blue)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                    SPECIAL REQUESTS / EVENT VIBE NOTES (OPTIONAL)
                  </label>
                  <textarea 
                    name="message" 
                    rows={3} 
                    value={formData.message} 
                    onChange={handleInputChange} 
                    placeholder="Tell us about the crowd, special guest entrances, preferred playlist genres, or stage instructions..." 
                  />
                </div>

                {/* Negotiation Bar */}
                <div style={{
                  padding: '2rem',
                  borderRadius: '16px',
                  background: 'rgba(255, 215, 0, 0.04)',
                  border: '1px solid rgba(255, 215, 0, 0.2)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h4 style={{ color: 'var(--accent-gold)', fontSize: '1rem', fontWeight: 900 }}>
                        HAVE A CUSTOM BUDGET OR TALKED TO SAMBAT?
                      </h4>
                      <p style={{ color: '#aaa', fontSize: '0.85rem' }}>
                        Chat with Sambat directly on WhatsApp to agree on a custom rate, or enter your unlock code.
                      </p>
                    </div>
                    <button 
                      type="button" 
                      onClick={handleNegotiateWhatsApp} 
                      className="btn-secondary"
                      style={{ border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)' }}
                    >
                      💬 NEGOTIATE ON WHATSAPP
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    <input 
                      type="text" 
                      name="negotiationCode" 
                      placeholder="Paste 8-digit unlock code from Sambat" 
                      value={formData.negotiationCode}
                      onChange={handleInputChange}
                      style={{ flex: 1 }} 
                    />
                    <button 
                      type="button" 
                      onClick={verifyCode} 
                      disabled={isVerifyingCode} 
                      className="btn-primary" 
                      style={{ whiteSpace: 'nowrap', padding: '0.9rem 1.8rem' }}
                    >
                      {isVerifyingCode ? 'VERIFYING...' : 'APPLY CODE'}
                    </button>
                  </div>
                  
                  {codeError && (
                    <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem' }}>{codeError}</p>
                  )}
                  {appliedCodeData && (
                    <p style={{ color: '#4ade80', fontSize: '0.85rem', fontWeight: 800, marginTop: '0.5rem' }}>
                      ✓ Code {appliedCodeData.code} applied! New negotiated price locked at ₦{(appliedCodeData.price || 0).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Final Submission Buttons */}
                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="btn-neon-blue" 
                  style={{ width: '100%', padding: '1.4rem', fontSize: '1.15rem' }}
                >
                  {submitting ? 'LOCKING IN RESERVATION...' : '⚡ CONFIRM & SUBMIT BOOKING REQUEST'}
                </button>
                
                <div style={{ textAlign: 'center' }}>
                  <button 
                    type="button" 
                    onClick={() => setStep(1)} 
                    style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}
                  >
                    ← EDIT BOOKING DETAILS
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* WhatsApp Negotiation Overlay Modal */}
      {isNegotiating && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div className="glass-card" style={{ maxWidth: '480px', textAlign: 'center', border: '2px solid var(--accent-gold)', padding: '3rem 2rem' }}>
            <h3 style={{ color: 'var(--accent-gold)', fontSize: '1.6rem', marginBottom: '1rem', fontWeight: 900 }}>
              DIRECT NEGOTIATION ACTIVE
            </h3>
            <p style={{ color: '#ccc', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
              WhatsApp opened in a new tab. Once you agree on a price with Sambat, enter the exclusive code here to lock in your custom rate.
            </p>
            
            <div style={{ fontSize: '3rem', fontWeight: 900, color: '#fff', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
              {formatTime(negotiationTimer)}
            </div>
            <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '2rem' }}>Code session window remaining</p>
            
            <button 
              onClick={() => setIsNegotiating(false)} 
              className="btn-primary" 
              style={{ width: '100%' }}
            >
              RETURN TO BOOKING FORM
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
