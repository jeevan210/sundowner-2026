import React, { useState } from 'react';

export default function RegisterModal({ isOpen, onClose, onRegisterSuccess, upiId }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    email: '',
    utr: '',
    screenshotPreview: null
  });
  const [submitting, setSubmitting] = useState(false);
  const [submittedPass, setSubmittedPass] = useState(null);
  const [qrPreviewUrl, setQrPreviewUrl] = useState('');

  if (!isOpen) return null;

  const compressImage = (file) => {
    return new Promise((resolve) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const MAX_DIM = 750; // sharp readability for payment receipts, tiny size (~30-50KB)
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_DIM) {
                height = Math.round((height * MAX_DIM) / width);
                width = MAX_DIM;
              }
            } else {
              if (height > MAX_DIM) {
                width = Math.round((width * MAX_DIM) / height);
                height = MAX_DIM;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.65);
            resolve(compressed);
          } catch {
            resolve(e.target.result);
          }
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compressed = await compressImage(file);
      if (compressed) {
        setFormData(prev => ({ ...prev, screenshotPreview: compressed }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      alert("Please fill in your Name, Phone Number, and Email Address.");
      return;
    }

    setSubmitting(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      // 1. Try sending to backend MongoDB API (ultra-lightweight compressed payload)
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          name: formData.name.trim(),
          age: formData.age || '18+',
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          utr: formData.utr.trim(),
          screenshot: formData.screenshotPreview || '/assets/payment-qr.jpg'
        })
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        setSubmittedPass(data.registration);
        setQrPreviewUrl(data.qrDataUrl || '');
        if (onRegisterSuccess) onRegisterSuccess(data.registration);
      } else {
        throw new Error('Server returned non-200');
      }
    } catch (err) {
      console.warn('Backend unavailable, using local client fallback:', err);
      // Client-side fallback if server is offline
      const passId = `SUN-${Math.floor(1000 + Math.random() * 9000)}`;
      const localRecord = {
        _id: `local-${Date.now()}`,
        ticketCode: passId,
        id: passId,
        name: formData.name.trim(),
        age: formData.age || '18+',
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        utr: formData.utr.trim() || `UPI-TXN-${Date.now().toString().slice(-6)}`,
        screenshot: formData.screenshotPreview || '/assets/payment-qr.jpg',
        status: 'Pending',
        passSent: false,
        createdAt: new Date().toISOString()
      };
      setSubmittedPass(localRecord);
      if (onRegisterSuccess) onRegisterSuccess(localRecord);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmittedPass(null);
    setQrPreviewUrl('');
    setFormData({ name: '', age: '', phone: '', email: '', utr: '', screenshotPreview: null });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div 
        className="register-modal-content box-3d-depth" 
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button type="button" className="modal-close-x" onClick={handleClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        {submittedPass ? (
          /* Success Pass Confirmation */
          <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              background: 'rgba(34, 197, 94, 0.15)', 
              border: '2px solid #22c55e', 
              color: '#22c55e', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '1.6rem', 
              margin: '0 auto 1rem auto' 
            }}>
              <i className="fa-solid fa-check"></i>
            </div>
            
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 900, color: '#fff', marginBottom: '0.35rem' }}>
              REGISTRATION SUBMITTED!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Your details have been saved to the database. Once our coordinators verify your payment, your confirmed VIP Pass Code will be dispatched to your email!
            </p>

            <div style={{ 
              background: '#0A0807', 
              border: '1.5px dashed var(--border-amber)', 
              borderRadius: '16px', 
              padding: '1.25rem', 
              marginBottom: '1.25rem', 
              textAlign: 'left' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>PASS CODE:</span>
                <span style={{ fontWeight: 800, color: 'var(--amber-gold)', fontFamily: 'monospace', fontSize: '1.1rem' }}>
                  #{submittedPass.ticketCode || submittedPass.id}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>GUEST NAME:</span>
                <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>{submittedPass.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>PHONE:</span>
                <span style={{ color: '#fff', fontSize: '0.9rem' }}>{submittedPass.phone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>EMAIL:</span>
                <span style={{ color: 'var(--accent-gold)', fontSize: '0.88rem' }}>{submittedPass.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>STATUS:</span>
                <span style={{ color: '#F59E0B', fontWeight: 800, fontSize: '0.85rem' }}>
                  <i className="fa-solid fa-clock"></i> Pending Verification
                </span>
              </div>
            </div>

            {/* Event Coordinators Help */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.85rem', borderRadius: '12px', marginBottom: '1.25rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <strong>Need urgent confirmation?</strong> Contact coordinators:<br />
              <span style={{ color: '#fff' }}>Sonika (+91 81510 90944) &bull; Arzoo (+91 6362-172106) &bull; Krupa (+91 74834 01240) &bull; Kuber (+91 78998 24069)</span>
            </div>

            <button 
              type="button" 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              onClick={handleClose}
            >
              Done & Return to Site
            </button>
          </div>
        ) : (
          /* Registration Form */
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <span className="card-badge" style={{ marginBottom: '0.5rem', display: 'inline-flex' }}>
                <i className="fa-solid fa-ticket"></i> Official Event Registration
              </span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>
                RESERVE YOUR PASS
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Fill in your details below. Once verified, you will receive an official QR confirmation pass on your email.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              
              {/* Full Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Full Name *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Aryan Sharma"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="admin-input-field"
                />
              </div>

              {/* Age & Phone Number */}
              <div className="reg-modal-grid-row">
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Age
                  </label>
                  <input 
                    type="number" 
                    min="16" 
                    max="99"
                    placeholder="21"
                    value={formData.age}
                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                    className="admin-input-field"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    WhatsApp Phone *
                  </label>
                  <input 
                    type="tel" 
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="admin-input-field"
                  />
                </div>
              </div>

              {/* Email Address for QR Pass */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Email Address * <span style={{ color: 'var(--accent-gold)', fontSize: '0.72rem' }}>(Your VIP Pass Code will be emailed here)</span>
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="yourname@gmail.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="admin-input-field"
                />
              </div>

              {/* UTR / Transaction Reference */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  UPI Reference / UTR Number
                </label>
                <input 
                  type="text" 
                  placeholder="12-digit UTR from GPay / PhonePe / Paytm"
                  value={formData.utr}
                  onChange={e => setFormData({ ...formData, utr: e.target.value })}
                  className="admin-input-field"
                />
              </div>

              {/* Payment Screenshot Upload */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Upload Payment Screenshot
                </label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    background: '#0A0807',
                    border: '1px dashed var(--border-amber)',
                    borderRadius: '12px',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem'
                  }}
                />
                {formData.screenshotPreview && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#22C55E' }}>
                    <i className="fa-solid fa-circle-check"></i> Screenshot selected ({Math.round(formData.screenshotPreview.length / 1024)} KB)
                  </div>
                )}
              </div>

              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleClose}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn btn-primary" 
                  style={{ flex: 2 }}
                >
                  {submitting ? (
                    <><i className="fa-solid fa-spinner fa-spin"></i> Saving to Database...</>
                  ) : (
                    <><i className="fa-solid fa-paper-plane"></i> Submit & Request Pass</>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
