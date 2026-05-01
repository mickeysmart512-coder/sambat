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

          <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
            {step === 1 ? (
              <form onSubmit={handleNextStep} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--accent-gold)' }}>FIRST NAME</label>
                  <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} placeholder="John" style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--accent-gold)' }}>LAST NAME</label>
                  <input type="text" name="lastName" required value={formData.lastName} onChange={handleInputChange} placeholder="Doe" style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--accent-gold)' }}>PHONE NUMBER</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} placeholder="+234..." style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--accent-gold)' }}>EMAIL</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder="john@example.com" style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--accent-gold)' }}>EVENT DATE</label>
                  <input type="date" name="eventDate" required value={formData.eventDate} onChange={handleInputChange} style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--accent-gold)' }}>EVENT TIME</label>
                  <input type="time" name="eventTime" required value={formData.eventTime} onChange={handleInputChange} style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--accent-gold)' }}>EVENT TYPE</label>
                  <select name="eventType" required value={formData.eventType} onChange={handleInputChange} style={inputStyle}>
                    <option value="">Select Event Type</option>
                    <option value="wedding">Wedding</option>
                    <option value="club">Club Performance</option>
                    <option value="birthday">Birthday Party</option>
                    <option value="corporate">Corporate Event</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--accent-gold)' }}>SELECT STATE</label>
                  <select name="state" required value={formData.state} onChange={handleInputChange} style={inputStyle}>
                    <option value="">Select State</option>
                    {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--accent-gold)' }}>VENUE / LOCATION</label>
                  <div style={{ position: 'relative' }}>
                    <input type="text" name="location" required value={formData.location} onChange={handleInputChange} placeholder="Search for venue..." style={inputStyle} />
                    <div style={{ position: 'absolute', top: '100%', left: '0', right: '0', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '0 0 8px 8px', zIndex: 10, display: formData.location.length > 2 ? 'block' : 'none' }}>
                       {/* Mock Google Maps Dropdown */}
                       <div style={{ padding: '1rem', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)' }} onClick={() => setFormData({...formData, location: `${formData.location} Event Center, Lagos`})}>
                         📍 {formData.location} Event Center, Lagos
                       </div>
                       <div style={{ padding: '1rem', cursor: 'pointer' }} onClick={() => setFormData({...formData, location: `${formData.location} Plaza, VI`})}>
                         📍 {formData.location} Plaza, Victoria Island
                       </div>
                    </div>
                  </div>
                </div>

                <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                  <button type="submit" className="btn-primary" style={{ width: '100%' }}>NEXT STEP</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>BOOKING SUMMARY</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px' }}>
                    <div><span style={{ color: '#666', fontSize: '0.8rem' }}>NAME:</span> <br/> {formData.firstName} {formData.lastName}</div>
                    <div><span style={{ color: '#666', fontSize: '0.8rem' }}>DATE/TIME:</span> <br/> {formData.eventDate} @ {formData.eventTime}</div>
                    <div><span style={{ color: '#666', fontSize: '0.8rem' }}>TYPE:</span> <br/> {formData.eventType.toUpperCase()}</div>
                    <div><span style={{ color: '#666', fontSize: '0.8rem' }}>LOCATION:</span> <br/> {formData.state}, {formData.location}</div>
                  </div>
                </div>

                <div style={{ 
                  padding: '2rem', 
                  background: 'rgba(212, 175, 55, 0.1)', 
                  borderRadius: '12px',
                  border: '1px solid var(--accent-gold)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ color: 'var(--accent-gold)', fontSize: '1rem', fontWeight: 900 }}>TOTAL QUOTE</h4>
                    <p style={{ fontSize: '0.8rem', color: '#888' }}>Includes base price and travel fees.</p>
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-gold)' }}>
                    ₦{estimatedPrice.toLocaleString()}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button type="button" onClick={handleNegotiate} className="btn-secondary" style={{ flex: 1, border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)', padding: '1rem' }}>
                    NEGOTIATE PRICE
                  </button>
                  <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="text" 
                      name="negotiationCode" 
                      placeholder="Code (Optional)" 
                      value={formData.negotiationCode}
                      onChange={handleInputChange}
                      style={{ ...inputStyle, flex: 1 }} 
                    />
                    <button type="button" onClick={verifyCode} disabled={isVerifyingCode} style={{ padding: '0.8rem 1.5rem', background: 'var(--accent-gold)', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', opacity: isVerifyingCode ? 0.5 : 1 }}>
                      APPLY
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1.5rem', fontSize: '1.2rem' }}>
                  PAY & CONFIRM BOOKING
                </button>
                
                <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.9rem' }}>
                  Go back to edit details
                </button>
              </form>
            )}
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
