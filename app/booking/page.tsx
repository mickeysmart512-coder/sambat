'use client';
import Navigation from '@/components/Navigation';
import { useState, useEffect } from 'react';

const NIGERIAN_STATES = [
  'Lagos', 'Abuja (FCT)', 'Rivers', 'Oyo', 'Kano', 'Ogun', 'Enugu', 'Edo', 'Delta', 'Anambra',
  'Kaduna', 'Plateau', 'Akwa Ibom', 'Imo', 'Bauchi', 'Benue', 'Borno', 'Cross River', 
  'Ebonyi', 'Ekiti', 'Gombe', 'Jigawa', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Nasarawa', 
  'Niger', 'Ondo', 'Osun', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [statePrices, setStatePrices] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    eventDate: '',
    eventTime: '',
    eventType: '',
    state: '',
    location: '',
    venue: '',
    message: '',
    negotiationCode: ''
  });

  const [isNegotiating, setIsNegotiating] = useState(false);
  const [negotiationTimer, setNegotiationTimer] = useState(0);
  const [appliedCodeData, setAppliedCodeData] = useState<any>(null);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  useEffect(() => {
    // Fetch settings and state prices
    Promise.all([
      fetch('/api/settings').then(res => res.json()),
      fetch('/api/state-prices').then(res => res.json())
    ]).then(([settingsData, pricesData]) => {
      setSettings(settingsData);
      setStatePrices(pricesData);
    });
  }, []);

  useEffect(() => {
    if (!settings) return;
    
    let price = 0;
    const basePrice = settings[`price_${formData.eventType}`];
    if (basePrice) price = parseFloat(basePrice);
    
    // Add state-specific price if found, otherwise use default travel fee logic
    const stateSpecific = statePrices.find(sp => sp.stateName === formData.state);
    if (stateSpecific) {
      price = stateSpecific.price; // Use specific state price
    } else if (formData.state && settings.base_location && 
        formData.state.toLowerCase() !== settings.base_location.toLowerCase()) {
      price += parseFloat(settings.travel_fee || "0");
    }

    // Apply negotiation code if valid
    if (appliedCodeData) {
      price = appliedCodeData.price;
    }
    
    setEstimatedPrice(price);
  }, [formData, settings, statePrices, appliedCodeData]);

  // Negotiation Timer
  useEffect(() => {
    let interval: any;
    if (isNegotiating && negotiationTimer > 0) {
      interval = setInterval(() => {
        setNegotiationTimer(prev => prev - 1);
      }, 1000);
    } else if (negotiationTimer === 0) {
      setIsNegotiating(false);
    }
    return () => clearInterval(interval);
  }, [isNegotiating, negotiationTimer]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleNegotiate = () => {
    setIsNegotiating(true);
    setNegotiationTimer(900); // 15 minutes
    // Open WhatsApp in new tab
    const message = `Hi Sambat, I'm booking an experience for ${formData.eventDate} in ${formData.state} and would like to negotiate the price. My name is ${formData.firstName} ${formData.lastName}.`;
    window.open(`https://wa.me/2348000000000?text=${encodeURIComponent(message)}`, '_blank');
  };

  const verifyCode = async () => {
    if (!formData.negotiationCode) return;
    setIsVerifyingCode(true);
    try {
      const res = await fetch(`/api/negotiation?code=${formData.negotiationCode}`);
      const data = await res.json();
      if (res.ok) {
        setAppliedCodeData(data);
        alert('Code applied successfully!');
      } else {
        alert(data.error || 'Invalid code');
      }
    } catch (err) {
      alert('Error verifying code');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      fullName: `${formData.firstName} ${formData.lastName}`,
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
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Failed to submit booking. Please try again.');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (submitted) {
    return (
      <main style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Navigation />
        <div className="glass-card" style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h2 style={{ color: 'var(--accent-gold)', fontSize: '2.5rem', marginBottom: '1rem' }}>SUCCESS!</h2>
          <p style={{ fontSize: '1.1rem', color: '#ccc', marginBottom: '2rem' }}>
            Payment confirmed. DJ Sambat's team will contact you shortly to finalize details for your event on {formData.eventDate}.
          </p>
          <button className="btn-primary" onClick={() => window.location.href = '/'}>Back To Home</button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#000' }}>
      <Navigation />
      
      <section style={{ padding: '8rem 0 5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title">Book <span className="text-gradient">The Experience</span></h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ width: '40px', height: '4px', background: step >= 1 ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }}></div>
              <div style={{ width: '40px', height: '4px', background: step >= 2 ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }}></div>
            </div>
          </div>

          <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', padding: '3rem' }}>
            {step === 1 ? (
              <form onSubmit={handleNextStep} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 800, fontSize: '0.7rem', color: 'var(--accent-blue)', letterSpacing: '0.1em' }}>FIRST NAME</label>
                  <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} placeholder="John" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 800, fontSize: '0.7rem', color: 'var(--accent-blue)', letterSpacing: '0.1em' }}>LAST NAME</label>
                  <input type="text" name="lastName" required value={formData.lastName} onChange={handleInputChange} placeholder="Doe" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 800, fontSize: '0.7rem', color: 'var(--accent-blue)', letterSpacing: '0.1em' }}>PHONE NUMBER</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} placeholder="+234..." />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 800, fontSize: '0.7rem', color: 'var(--accent-blue)', letterSpacing: '0.1em' }}>EMAIL</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder="john@example.com" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 800, fontSize: '0.7rem', color: 'var(--accent-blue)', letterSpacing: '0.1em' }}>EVENT DATE</label>
                  <input type="date" name="eventDate" required value={formData.eventDate} onChange={handleInputChange} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 800, fontSize: '0.7rem', color: 'var(--accent-blue)', letterSpacing: '0.1em' }}>EVENT TIME</label>
                  <input type="time" name="eventTime" required value={formData.eventTime} onChange={handleInputChange} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 800, fontSize: '0.7rem', color: 'var(--accent-blue)', letterSpacing: '0.1em' }}>EVENT TYPE</label>
                  <select name="eventType" required value={formData.eventType} onChange={handleInputChange}>
                    <option value="">Select Event Type</option>
                    <option value="wedding">Wedding</option>
                    <option value="club">Club Performance</option>
                    <option value="birthday">Birthday Party</option>
                    <option value="corporate">Corporate Event</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 800, fontSize: '0.7rem', color: 'var(--accent-blue)', letterSpacing: '0.1em' }}>SELECT STATE</label>
                  <select name="state" required value={formData.state} onChange={handleInputChange}>
                    <option value="">Select State</option>
                    {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 800, fontSize: '0.7rem', color: 'var(--accent-blue)', letterSpacing: '0.1em' }}>VENUE / LOCATION</label>
                  <div style={{ position: 'relative' }}>
                    <input type="text" name="location" required value={formData.location} onChange={handleInputChange} placeholder="Search for venue..." style={{ width: '100%' }} />
                  </div>
                </div>

                <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                  <button type="submit" className="btn-primary" style={{ width: '100%' }}>NEXT STEP</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ color: 'var(--accent-gold)', marginBottom: '1.5rem', fontWeight: 900 }}>BOOKING SUMMARY</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', textAlign: 'left', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                    <div><span style={{ color: '#666', fontSize: '0.7rem', fontWeight: 800 }}>NAME</span> <br/> {formData.firstName} {formData.lastName}</div>
                    <div><span style={{ color: '#666', fontSize: '0.7rem', fontWeight: 800 }}>DATE/TIME</span> <br/> {formData.eventDate} @ {formData.eventTime}</div>
                    <div><span style={{ color: '#666', fontSize: '0.7rem', fontWeight: 800 }}>TYPE</span> <br/> {formData.eventType.toUpperCase()}</div>
                    <div><span style={{ color: '#666', fontSize: '0.7rem', fontWeight: 800 }}>LOCATION</span> <br/> {formData.state}, {formData.location}</div>
                  </div>
                </div>

                <div style={{ 
                  padding: '2.5rem', 
                  background: 'rgba(0, 242, 255, 0.05)', 
                  borderRadius: '16px',
                  border: '1px solid var(--accent-blue)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: 'var(--glow-blue)'
                }}>
                  <div>
                    <h4 style={{ color: 'var(--accent-blue)', fontSize: '0.8rem', fontWeight: 900, letterSpacing: '0.1em' }}>TOTAL QUOTE</h4>
                    <p style={{ fontSize: '0.75rem', color: '#888' }}>Includes base price and travel fees.</p>
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>
                    ₦{estimatedPrice.toLocaleString()}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button type="button" onClick={handleNegotiate} className="btn-secondary" style={{ flex: 1 }}>
                    NEGOTIATE PRICE
                  </button>
                  <div style={{ flex: 1.5, display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="text" 
                      name="negotiationCode" 
                      placeholder="Enter Code" 
                      value={formData.negotiationCode}
                      onChange={handleInputChange}
                      style={{ flex: 1 }} 
                    />
                    <button type="button" onClick={verifyCode} disabled={isVerifyingCode} className="btn-primary" style={{ padding: '0 1.5rem' }}>
                      APPLY
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn-neon-blue" style={{ width: '100%', padding: '1.5rem', fontSize: '1.2rem' }}>
                  PAY & CONFIRM BOOKING
                </button>
                
                <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                  ← EDIT BOOKING DETAILS
                </button>
              </form>
            )}
          </div>
 </div>
        </div>
      </section>

      {/* Negotiation Popup */}
      {isNegotiating && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="glass-card" style={{ maxWidth: '450px', textAlign: 'center', border: '2px solid var(--accent-gold)' }}>
            <h3 style={{ color: 'var(--accent-gold)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>NEGOTIATION ACTIVE</h3>
            <p style={{ color: '#ccc', marginBottom: '2rem' }}>
              Redirecting you to Sambat's WhatsApp. Agree on a price and paste the unique code he gives you.
            </p>
            
            <div style={{ fontSize: '3rem', fontWeight: 900, color: '#fff', marginBottom: '1rem', fontFamily: 'monospace' }}>
              {formatTime(negotiationTimer)}
            </div>
            <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '2rem' }}>Timer will expire and code will be invalid.</p>
            
            <button onClick={() => setIsNegotiating(false)} className="btn-primary" style={{ width: '100%' }}>CLOSE & BACK TO FORM</button>
          </div>
        </div>
      )}
    </main>
  );
}

const inputStyle = {
  padding: '1rem',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--glass-border)',
  borderRadius: '8px',
  color: '#fff',
  outline: 'none',
  fontSize: '0.9rem',
  width: '100%'
};
