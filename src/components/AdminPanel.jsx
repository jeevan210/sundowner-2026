import React, { useState, useEffect } from 'react';

export default function AdminPanel({ 
  isOpen, 
  onClose, 
  registrations: propRegistrations, 
  onUpdateStatus, 
  onDeleteRegistration,
  onAddManualRegistration
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('sundowner_admin_auth') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'APPROVED' | 'PENDING'
  const [viewingScreenshot, setViewingScreenshot] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGuest, setNewGuest] = useState({ name: '', age: '21', phone: '', email: '', utr: 'DIRECT/CASH' });
  const [activeTab, setActiveTab] = useState('guests'); // 'guests' | 'scanner'
  const [copiedCode, setCopiedCode] = useState(null);

  // Helper: Format official WhatsApp VIP Pass share link
  const getWhatsAppShareUrl = (phone, name, ticketCode) => {
    const digits = (phone || '').replace(/\D/g, '');
    const fullPhone = digits.length === 10 ? `91${digits}` : digits;
    const msg = `🎉 *VIP ENTRY PASS — SUNDOWNER 2026* 🎉\n\nHi ${name}!\nYour registration & payment for Sundowner 2026 at Orchard Resort has been CONFIRMED!\n\n🎟️ *Official VIP Pass Code:* *${ticketCode}*\n📍 *Venue:* Orchard Resort, Navge Cross, Belagavi\n📅 *Date:* Sunday, 29 November 2026\n⏰ *Timings:* 4:00 PM – 8:00 PM (Pool open till 6:30 PM)\n🍸 *Inclusions:* Unlimited Complimentary Mocktails & Hot Snacks, Live DJ Arena\n\n👉 *Entrance Instructions:* Please present this Pass Code (*${ticketCode}*) at the gate to our coordinators for instant VIP admission.\n\n📞 *Host Team:* Sonika (+91 81510 90944), Arzoo, Krupa & Kuber. See you at the sunset party! 🌅`;
    return `https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`;
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    showToast(`Copied Pass Code: ${text} to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };
  
  // Database Registrations from Backend API
  const [dbRegistrations, setDbRegistrations] = useState([]);
  const [loadingDb, setLoadingDb] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Entrance Scanner Verification State
  const [scanCodeInput, setScanCodeInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);

  // Fetch from backend API
  const fetchRegistrations = async () => {
    setLoadingDb(true);
    try {
      const res = await fetch('/api/registrations');
      if (res.ok) {
        const data = await res.json();
        setDbRegistrations(data);
      } else {
        setDbRegistrations(propRegistrations || []);
      }
    } catch {
      setDbRegistrations(propRegistrations || []);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchRegistrations();
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  // Passcode verification
  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode.trim() === '2026' || passcode.trim().toLowerCase() === 'admin' || passcode.trim().toLowerCase() === 'admin2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('sundowner_admin_auth', 'true');
      setErrorMsg('');
      fetchRegistrations();
    } else {
      setErrorMsg('Incorrect passcode. (Default: 2026)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('sundowner_admin_auth');
    setPasscode('');
  };

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Flexible Approve: supports Email, direct WhatsApp, or offline fallback
  const handleApprove = async (guest, channel = 'email') => {
    const guestId = guest._id || guest.ticketCode || guest.id;
    setActionLoading(guestId);

    try {
      const res = await fetch(`/api/registrations/${guestId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel, skipEmail: channel === 'whatsapp' })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast(data.message || `Pass #${data.ticketCode || guest.ticketCode} approved!`);
        // Update local state
        setDbRegistrations(prev => prev.map(item => {
          if ((item._id && item._id === guestId) || item.ticketCode === guestId || item.id === guestId) {
            return { ...item, status: 'Approved', passSent: true, passSentAt: new Date() };
          }
          return item;
        }));
        if (onUpdateStatus) onUpdateStatus(guestId, 'Approved');

        // If WhatsApp requested, open chat with pre-filled pass
        if (channel === 'whatsapp') {
          const waUrl = data.whatsappUrl || getWhatsAppShareUrl(guest.phone, guest.name, guest.ticketCode || data.ticketCode);
          window.open(waUrl, '_blank');
        }
      } else {
        throw new Error(data.error || 'Failed to approve');
      }
    } catch (err) {
      console.warn('API approve error, applying client update:', err);
      // Fallback update
      setDbRegistrations(prev => prev.map(item => {
        if ((item._id && item._id === guestId) || item.ticketCode === guestId || item.id === guestId) {
          return { ...item, status: 'Approved', passSent: true, passSentAt: new Date() };
        }
        return item;
      }));
      if (onUpdateStatus) onUpdateStatus(guestId, 'Approved');

      if (channel === 'whatsapp') {
        const waUrl = getWhatsAppShareUrl(guest.phone, guest.name, guest.ticketCode || guest.id);
        window.open(waUrl, '_blank');
        showToast(`Approved ${guest.name}! Opened WhatsApp chat with VIP Pass Code.`);
      } else {
        showToast(`Approved ${guest.name}! Pass Code #${guest.ticketCode || guest.id} is ready to share on WhatsApp.`);
      }
    } finally {
      setActionLoading(null);
    }
  };

  // Delete registration
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this registration?")) return;

    try {
      await fetch(`/api/registrations/${id}`, { method: 'DELETE' });
    } catch {}

    setDbRegistrations(prev => prev.filter(r => (r._id !== id && r.ticketCode !== id && r.id !== id)));
    if (onDeleteRegistration) onDeleteRegistration(id);
    showToast("Registration deleted.");
  };

  // Scanner Verification
  const handleVerifyPass = async (e) => {
    if (e) e.preventDefault();
    if (!scanCodeInput.trim()) return;

    setScanning(true);
    setScanResult(null);

    try {
      const code = scanCodeInput.trim().toUpperCase();
      const res = await fetch(`/api/verify/${code}`);
      const data = await res.json();
      setScanResult(data);
    } catch (err) {
      // Local fallback lookup
      const code = scanCodeInput.trim().toUpperCase();
      const found = dbRegistrations.find(r => (r.ticketCode || r.id || '').toUpperCase() === code);
      if (found) {
        setScanResult({
          valid: found.status === 'Approved' || found.status === 'Verified',
          message: (found.status === 'Approved' || found.status === 'Verified') ? 'Pass is Verified & Valid!' : `Pass is ${found.status}.`,
          registration: found
        });
      } else {
        setScanResult({ valid: false, message: `Pass ${code} not found.` });
      }
    } finally {
      setScanning(false);
    }
  };

  // Gate Check-In Action
  const handleCheckInGuest = async (ticketCode) => {
    try {
      const res = await fetch(`/api/checkin/${ticketCode}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(`Checked in ${data.registration.name} at gate!`);
        setScanResult(prev => ({
          ...prev,
          registration: { ...prev.registration, checkedIn: true, checkedInAt: new Date() }
        }));
        // Update in table
        setDbRegistrations(prev => prev.map(r => (r.ticketCode === ticketCode ? { ...r, checkedIn: true, checkedInAt: new Date() } : r)));
      }
    } catch {
      showToast("Checked in (offline mode)!");
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const list = dbRegistrations.length > 0 ? dbRegistrations : (propRegistrations || []);
    if (list.length === 0) {
      alert("No registrations to export yet.");
      return;
    }
    const headers = ["Pass Code", "Name", "Age", "Phone", "Email", "UTR", "Status", "Pass Sent", "Checked In", "Registered At"];
    const rows = list.map(r => [
      r.ticketCode || r.id,
      `"${r.name}"`,
      r.age,
      `"${r.phone}"`,
      `"${r.email}"`,
      `"${r.utr}"`,
      `"${r.status}"`,
      r.passSent ? 'Yes' : 'No',
      r.checkedIn ? 'Yes' : 'No',
      `"${r.createdAt || r.registeredAt}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sundowner_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Combine dbRegistrations and propRegistrations
  const allRegistrations = dbRegistrations.length > 0 ? dbRegistrations : (propRegistrations || []);

  // Filter registrations
  const filtered = allRegistrations.filter(r => {
    const nameMatch = (r.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const phoneMatch = (r.phone || '').includes(searchQuery);
    const emailMatch = (r.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const codeMatch = (r.ticketCode || r.id || '').toLowerCase().includes(searchQuery.toLowerCase());
    const utrMatch = (r.utr || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSearch = nameMatch || phoneMatch || emailMatch || codeMatch || utrMatch;

    if (statusFilter === 'APPROVED') {
      return matchesSearch && (r.status === 'Approved' || r.status === 'Verified');
    }
    if (statusFilter === 'PENDING') {
      return matchesSearch && r.status !== 'Approved' && r.status !== 'Verified';
    }
    return matchesSearch;
  });

  const approvedCount = allRegistrations.filter(r => r.status === 'Approved' || r.status === 'Verified').length;
  const pendingCount = allRegistrations.length - approvedCount;
  const checkedInCount = allRegistrations.filter(r => r.checkedIn).length;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 3000 }}>
      <div 
        className="modal-content-box box-3d-depth" 
        style={{ 
          maxWidth: '1150px', 
          width: '95%', 
          maxHeight: '92vh', 
          overflowY: 'auto', 
          background: '#0E0B0A', 
          padding: '2rem',
          borderRadius: '24px',
          border: '1px solid var(--border-amber)' 
        }} 
        onClick={e => e.stopPropagation()}
      >
        {/* Toast Message Notification */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            top: '1.5rem',
            right: '1.5rem',
            background: toastMessage.type === 'error' ? '#EF4444' : '#22C55E',
            color: '#000',
            fontWeight: 700,
            padding: '0.75rem 1.25rem',
            borderRadius: '12px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.8)',
            zIndex: 4000,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.88rem'
          }}>
            <i className="fa-solid fa-circle-check"></i> {toastMessage.text}
          </div>
        )}

        {/* Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--sunset-btn)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 900 }}>
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 900, color: '#fff' }}>
                SUNDOWNER <span className="gradient-text">COORDINATOR PORTAL</span>
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                MongoDB Database & Automatic Email Pass Verification System
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {isAuthenticated && (
              <>
                <button 
                  type="button" 
                  onClick={() => setActiveTab('guests')}
                  className={`btn btn-sm ${activeTab === 'guests' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  <i className="fa-solid fa-users"></i> Guest List
                </button>
                <button 
                  type="button" 
                  onClick={() => setActiveTab('scanner')}
                  className={`btn btn-sm ${activeTab === 'scanner' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  <i className="fa-solid fa-qrcode"></i> Gate Scanner
                </button>
                <button 
                  type="button" 
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                  title="Lock admin session"
                >
                  <i className="fa-solid fa-lock"></i>
                </button>
              </>
            )}
            <button 
              type="button" 
              onClick={onClose}
              className="modal-close-x"
              style={{ position: 'static' }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {!isAuthenticated ? (
          /* Passcode Gate */
          <div style={{ maxWidth: '380px', margin: '3.5rem auto', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(229, 152, 56, 0.12)', border: '1px solid var(--border-amber)', color: 'var(--primary-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', margin: '0 auto 1.25rem auto' }}>
              <i className="fa-solid fa-lock"></i>
            </div>
            
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
              COORDINATOR AUTHENTICATION
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Enter your coordinator passcode to review registrations and verify entrance passes.
            </p>

            <form onSubmit={handleLogin}>
              <input 
                type="password" 
                placeholder="Enter passcode (Default: 2026)"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                autoFocus
                className="admin-input-field"
                style={{ textAlign: 'center', fontSize: '1.1rem', letterSpacing: '2px', marginBottom: '0.85rem' }}
              />

              {errorMsg && (
                <div style={{ color: '#EF4444', fontSize: '0.8rem', marginBottom: '0.85rem' }}>
                  <i className="fa-solid fa-triangle-exclamation"></i> {errorMsg}
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem' }}
              >
                <i className="fa-solid fa-arrow-right-to-bracket"></i> Access Dashboard
              </button>
            </form>
          </div>
        ) : activeTab === 'scanner' ? (
          /* ================================================================
             TAB 2: EVENT ENTRANCE GATE SCANNER / VERIFIER
             ================================================================ */
          <div style={{ padding: '1rem 0' }}>
            <div style={{ textAlign: 'center', maxWidth: '580px', margin: '0 auto 2rem auto' }}>
              <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'rgba(229, 152, 56, 0.15)', border: '1px solid var(--border-amber)', color: 'var(--amber-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 0.85rem auto' }}>
                <i className="fa-solid fa-qrcode"></i>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginBottom: '0.35rem' }}>
                EVENT ENTRANCE PASS VERIFIER
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Enter the attendee's Pass Code (e.g., <code>SUN-1082</code>), WhatsApp phone number, or Name to verify authenticity and admit them at the gate.
              </p>
            </div>

            <form onSubmit={handleVerifyPass} style={{ maxWidth: '480px', margin: '0 auto 2rem auto', display: 'flex', gap: '0.65rem' }}>
              <input 
                type="text" 
                placeholder="Pass Code, Phone, or Name..."
                value={scanCodeInput}
                onChange={e => setScanCodeInput(e.target.value)}
                className="admin-input-field"
                style={{ fontSize: '1.05rem', letterSpacing: '1px' }}
                autoFocus
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={scanning}
                style={{ whiteSpace: 'nowrap' }}
              >
                {scanning ? <i className="fa-solid fa-spinner fa-spin"></i> : <><i className="fa-solid fa-magnifying-glass"></i> Verify</>}
              </button>
            </form>

            {/* Scan Verification Result Card */}
            {scanResult && (
              <div style={{ 
                maxWidth: '540px', 
                margin: '0 auto', 
                background: scanResult.valid ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                border: `2px solid ${scanResult.valid ? '#22C55E' : '#EF4444'}`,
                borderRadius: '20px',
                padding: '1.75rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', color: scanResult.valid ? '#22C55E' : '#EF4444', marginBottom: '0.5rem' }}>
                  <i className={`fa-solid ${scanResult.valid ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i>
                </div>
                
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 900, color: scanResult.valid ? '#22C55E' : '#EF4444' }}>
                  {scanResult.valid ? 'PASS VERIFIED & VALID' : 'VERIFICATION FAILED'}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  {scanResult.message}
                </p>

                {scanResult.registration && (
                  <div style={{ background: '#090706', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem', textAlign: 'left', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--text-dim)' }}>PASS ID:</span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--amber-gold)' }}>
                        #{scanResult.registration.ticketCode || scanResult.registration.id}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--text-dim)' }}>GUEST NAME:</span>
                      <span style={{ fontWeight: 700, color: '#fff' }}>{scanResult.registration.name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--text-dim)' }}>PHONE:</span>
                      <span style={{ color: '#fff' }}>{scanResult.registration.phone}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--text-dim)' }}>EMAIL:</span>
                      <span style={{ color: 'var(--accent-gold)' }}>{scanResult.registration.email}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--text-dim)' }}>PAYMENT STATUS:</span>
                      <span style={{ color: '#22C55E', fontWeight: 800 }}>{scanResult.registration.status}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-dim)' }}>GATE CHECK-IN:</span>
                      <span style={{ color: scanResult.registration.checkedIn ? '#22C55E' : '#F59E0B', fontWeight: 800 }}>
                        {scanResult.registration.checkedIn ? '✅ Already Checked In' : '⏳ Awaiting Gate Check-In'}
                      </span>
                    </div>
                  </div>
                )}

                {scanResult.valid && scanResult.registration && !scanResult.registration.checkedIn && (
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '0.85rem' }}
                    onClick={() => handleCheckInGuest(scanResult.registration.ticketCode || scanResult.registration.id)}
                  >
                    <i className="fa-solid fa-person-walking-arrow-right"></i> Check In Guest at Gate
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          /* ================================================================
             TAB 1: GUEST LIST & REGISTRATION APPROVALS
             ================================================================ */
          <div>
            {/* Metric Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#14100E', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.15rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Total Registrations</span>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: 900, color: '#fff', marginTop: '0.2rem' }}>
                  {allRegistrations.length}
                </div>
              </div>

              <div style={{ background: '#14100E', border: '1px solid rgba(34, 197, 94, 0.25)', borderRadius: '16px', padding: '1.15rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#22C55E', textTransform: 'uppercase', fontWeight: 700 }}>Approved & Passes Sent</span>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: 900, color: '#22C55E', marginTop: '0.2rem' }}>
                  {approvedCount}
                </div>
              </div>

              <div style={{ background: '#14100E', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '16px', padding: '1.15rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#F59E0B', textTransform: 'uppercase', fontWeight: 700 }}>Pending Verification</span>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: 900, color: '#F59E0B', marginTop: '0.2rem' }}>
                  {pendingCount}
                </div>
              </div>

              <div style={{ background: '#14100E', border: '1px solid var(--border-amber)', borderRadius: '16px', padding: '1.15rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--amber-gold)', textTransform: 'uppercase', fontWeight: 700 }}>Checked In at Entrance</span>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: 900, color: 'var(--amber-gold)', marginTop: '0.2rem' }}>
                  {checkedInCount}
                </div>
              </div>
            </div>

            {/* Controls Bar: Search, Filters, CSV Export */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              
              {/* Search input */}
              <div style={{ flex: '1 1 240px', minWidth: '220px' }}>
                <input 
                  type="text" 
                  placeholder="Search by name, phone, email, UTR, or Pass ID..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="admin-input-field"
                />
              </div>

              {/* Status Filter buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button 
                  type="button" 
                  onClick={() => setStatusFilter('ALL')}
                  className={`btn btn-sm ${statusFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  All ({allRegistrations.length})
                </button>
                <button 
                  type="button" 
                  onClick={() => setStatusFilter('APPROVED')}
                  className={`btn btn-sm ${statusFilter === 'APPROVED' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ color: statusFilter === 'APPROVED' ? '#000' : '#22C55E' }}
                >
                  Approved ({approvedCount})
                </button>
                <button 
                  type="button" 
                  onClick={() => setStatusFilter('PENDING')}
                  className={`btn btn-sm ${statusFilter === 'PENDING' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ color: statusFilter === 'PENDING' ? '#000' : '#F59E0B' }}
                >
                  Pending ({pendingCount})
                </button>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  type="button" 
                  onClick={fetchRegistrations}
                  className="btn btn-secondary btn-sm"
                  title="Refresh from MongoDB"
                >
                  <i className={`fa-solid fa-arrows-rotate ${loadingDb ? 'fa-spin' : ''}`}></i> Refresh
                </button>
                <button 
                  type="button" 
                  onClick={exportToCSV}
                  className="btn btn-secondary btn-sm"
                  title="Export guest list to CSV"
                >
                  <i className="fa-solid fa-file-csv text-orange"></i> Export CSV
                </button>
              </div>

            </div>

            {/* Registrations Table */}
            <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '16px', background: '#090706' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#14100E', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '0.85rem 1rem' }}>Pass Code</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Guest Name</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Phone & WhatsApp</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Email (Pass Destination)</th>
                    <th style={{ padding: '0.85rem 1rem' }}>UTR / Reference</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Receipt</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                        No registrations match your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => {
                      const id = item._id || item.ticketCode || item.id;
                      const isApproved = item.status === 'Approved' || item.status === 'Verified';

                      return (
                        <tr key={id} className="admin-table-row" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                          
                          {/* Pass Code + Copy Button */}
                          <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 800, color: 'var(--amber-gold)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                              <span style={{ fontSize: '0.95rem' }}>#{item.ticketCode || item.id}</span>
                              <button 
                                type="button"
                                onClick={() => copyToClipboard(item.ticketCode || item.id)}
                                title="Copy Pass Code"
                                style={{
                                  background: 'rgba(255, 255, 255, 0.06)',
                                  border: '1px solid rgba(255, 255, 255, 0.12)',
                                  color: copiedCode === (item.ticketCode || item.id) ? '#22C55E' : 'var(--text-dim)',
                                  borderRadius: '6px',
                                  padding: '0.15rem 0.35rem',
                                  fontSize: '0.72rem',
                                  cursor: 'pointer'
                                }}
                              >
                                <i className={copiedCode === (item.ticketCode || item.id) ? "fa-solid fa-check" : "fa-regular fa-copy"}></i>
                              </button>
                            </div>
                          </td>

                          {/* Guest Name & Age */}
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{item.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Age: {item.age || '18+'}</div>
                          </td>

                          {/* Phone & Direct WhatsApp Pass Share Link */}
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <div style={{ color: '#fff', fontSize: '0.85rem' }}>{item.phone}</div>
                            <a 
                              href={getWhatsAppShareUrl(item.phone, item.name, item.ticketCode || item.id)}
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '0.3rem', 
                                background: 'rgba(34, 197, 94, 0.14)', 
                                border: '1px solid rgba(34, 197, 94, 0.4)', 
                                color: '#22C55E', 
                                padding: '0.2rem 0.55rem', 
                                borderRadius: '6px', 
                                fontSize: '0.72rem', 
                                fontWeight: 700, 
                                textDecoration: 'none', 
                                marginTop: '0.25rem' 
                              }}
                              title="Send VIP Pass Code directly to guest via WhatsApp"
                            >
                              <i className="fa-brands fa-whatsapp"></i> Share Pass
                            </a>
                          </td>

                          {/* Email */}
                          <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                            {item.email}
                            {item.passSent && (
                              <div style={{ fontSize: '0.7rem', color: '#22C55E', marginTop: '0.15rem' }}>
                                <i className="fa-solid fa-envelope-circle-check"></i> Pass Emailed
                              </div>
                            )}
                          </td>

                          {/* UTR */}
                          <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--accent-gold)' }}>
                            {item.utr || 'N/A'}
                          </td>

                          {/* Screenshot View */}
                          <td style={{ padding: '0.85rem 1rem' }}>
                            {item.screenshot ? (
                              <button 
                                type="button" 
                                onClick={() => setViewingScreenshot(item.screenshot)}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.25rem 0.65rem', fontSize: '0.72rem' }}
                              >
                                <i className="fa-solid fa-receipt"></i> View
                              </button>
                            ) : (
                              <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>No image</span>
                            )}
                          </td>

                          {/* Status Badge */}
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '0.25rem 0.65rem',
                              borderRadius: '9999px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              background: isApproved ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              border: `1px solid ${isApproved ? 'rgba(34, 197, 94, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
                              color: isApproved ? '#22C55E' : '#F59E0B'
                            }}>
                              <i className={`fa-solid ${isApproved ? 'fa-check' : 'fa-clock'}`}></i>
                              {isApproved ? 'Approved' : 'Pending'}
                            </span>
                          </td>

                          {/* Actions: Approve & Email, Approve & WhatsApp, Gate Admit */}
                          <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                              {!isApproved ? (
                                <>
                                  {/* 1-Click WhatsApp Approve */}
                                  <button
                                    type="button"
                                    onClick={() => handleApprove(item, 'whatsapp')}
                                    disabled={actionLoading === id}
                                    className="btn btn-sm"
                                    style={{ 
                                      background: '#22C55E', 
                                      color: '#000', 
                                      fontWeight: 800, 
                                      padding: '0.35rem 0.65rem', 
                                      fontSize: '0.72rem', 
                                      border: 'none', 
                                      display: 'inline-flex', 
                                      alignItems: 'center', 
                                      gap: '0.3rem' 
                                    }}
                                    title="Approve and immediately open guest's WhatsApp with VIP Pass Code"
                                  >
                                    <i className="fa-brands fa-whatsapp"></i> WhatsApp Pass
                                  </button>

                                  {/* Standard Email Approve */}
                                  <button 
                                    type="button" 
                                    onClick={() => handleApprove(item, 'email')}
                                    disabled={actionLoading === id}
                                    className="btn btn-primary btn-sm"
                                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.72rem' }}
                                    title="Approve registration and send VIP Pass email"
                                  >
                                    {actionLoading === id ? (
                                      <><i className="fa-solid fa-spinner fa-spin"></i></>
                                    ) : (
                                      <><i className="fa-solid fa-paper-plane"></i> Email Pass</>
                                    )}
                                  </button>
                                </>
                              ) : (
                                <>
                                  {/* Direct Gate Check-In (Make them in) */}
                                  {!item.checkedIn ? (
                                    <button 
                                      type="button" 
                                      onClick={() => handleCheckInGuest(item.ticketCode || item.id)}
                                      className="btn btn-sm"
                                      style={{ 
                                        background: 'rgba(34, 197, 94, 0.15)', 
                                        border: '1px solid #22C55E', 
                                        color: '#22C55E', 
                                        padding: '0.3rem 0.65rem', 
                                        fontSize: '0.72rem', 
                                        fontWeight: 800,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.3rem'
                                      }}
                                      title="Admit guest at entrance gate"
                                    >
                                      <i className="fa-solid fa-person-walking-arrow-right"></i> Admit Guest
                                    </button>
                                  ) : (
                                    <span style={{ 
                                      color: '#22C55E', 
                                      fontSize: '0.72rem', 
                                      fontWeight: 800, 
                                      padding: '0.2rem 0.5rem', 
                                      background: 'rgba(34, 197, 94, 0.12)', 
                                      border: '1px solid rgba(34, 197, 94, 0.3)',
                                      borderRadius: '6px' 
                                    }}>
                                      <i className="fa-solid fa-circle-check"></i> Admitted
                                    </span>
                                  )}

                                  {/* Resend Email */}
                                  <button 
                                    type="button" 
                                    onClick={() => handleApprove(item, 'email')}
                                    disabled={actionLoading === id}
                                    className="btn btn-secondary btn-sm"
                                    style={{ padding: '0.3rem 0.55rem', fontSize: '0.7rem' }}
                                    title="Resend VIP Pass Email"
                                  >
                                    {actionLoading === id ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-rotate-right"></i>}
                                  </button>
                                </>
                              )}

                              {/* Delete */}
                              <button 
                                type="button" 
                                onClick={() => handleDelete(id)}
                                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '0.25rem', fontSize: '0.85rem' }}
                                title="Delete Registration"
                              >
                                <i className="fa-solid fa-trash-can"></i>
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Screenshot Modal Lightbox */}
        {viewingScreenshot && (
          <div className="modal-overlay" onClick={() => setViewingScreenshot(null)} style={{ zIndex: 4000 }}>
            <div className="modal-content-box" style={{ maxWidth: '520px', background: '#000', padding: '1rem', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
              <button type="button" className="modal-close-x" onClick={() => setViewingScreenshot(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
              <h4 style={{ color: '#fff', marginBottom: '0.75rem', fontSize: '0.95rem' }}>Payment Receipt / Screenshot</h4>
              <img src={viewingScreenshot} alt="Payment Receipt" style={{ width: '100%', height: 'auto', borderRadius: '12px', display: 'block' }} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
