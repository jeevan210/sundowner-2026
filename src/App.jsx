import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import ResortGallery from './components/ResortGallery';
import Snapshot from './components/Snapshot';
import Rules from './components/Rules';
import Booking from './components/Booking';
import Venue from './components/Venue';
import Footer from './components/Footer';
import MediaModal from './components/MediaModal';
import MobileBottomBar from './components/MobileBottomBar';
import AdminPanel from './components/AdminPanel';
import RegisterModal from './components/RegisterModal';

// Initial seed registrations for instant coordinator testing
const DEFAULT_REGISTRATIONS = [
  {
    _id: 'seed-1',
    ticketCode: 'SUN-1082',
    name: 'Aryan Sharma',
    age: '22',
    phone: '9876543210',
    email: 'aryan.sharma@gmail.com',
    utr: '482910482910',
    screenshot: '/assets/payment-qr.jpg',
    status: 'Approved',
    passSent: true,
    passSentAt: new Date(),
    checkedIn: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'seed-2',
    ticketCode: 'SUN-2194',
    name: 'Priya Patil',
    age: '21',
    phone: '9123456780',
    email: 'priya.patil@outlook.com',
    utr: '849201948291',
    screenshot: '/assets/payment-qr.jpg',
    status: 'Pending',
    passSent: false,
    checkedIn: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'seed-3',
    ticketCode: 'SUN-3045',
    name: 'Rahul Desai',
    age: '23',
    phone: '9988776655',
    email: 'rahul.desai@gmail.com',
    utr: '746201948271',
    screenshot: '/assets/payment-qr.jpg',
    status: 'Approved',
    passSent: true,
    passSentAt: new Date(),
    checkedIn: false,
    createdAt: new Date().toISOString()
  }
];

export default function App() {
  const [activeMediaModal, setActiveMediaModal] = useState(null);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  // Theme switcher state: 'midnight' (primary default) | 'sunset'
  const [currentTheme, setCurrentTheme] = useState(() => {
    try {
      return localStorage.getItem('sundowner_theme') || 'midnight';
    } catch {
      return 'midnight';
    }
  });

  const toggleTheme = () => {
    const nextTheme = currentTheme === 'sunset' ? 'midnight' : 'sunset';
    setCurrentTheme(nextTheme);
    try {
      localStorage.setItem('sundowner_theme', nextTheme);
    } catch {}
  };

  // Synchronize mobile status bar / browser toolbar color with active theme
  useEffect(() => {
    const meta = document.getElementById('theme-color-meta');
    if (meta) {
      meta.setAttribute('content', currentTheme === 'sunset' ? '#0a0807' : '#060911');
    }
  }, [currentTheme]);

  // Safe registrations state for instant coordinator / UI fallback
  const [registrations, setRegistrations] = useState(DEFAULT_REGISTRATIONS);

  // Hidden direct URL access: opens Admin Portal when navigating to /admin, #admin, or ?admin
  useEffect(() => {
    const checkUrlForAdmin = () => {
      const path = (window.location.pathname || '').toLowerCase();
      const hash = (window.location.hash || '').toLowerCase();
      const search = (window.location.search || '').toLowerCase();
      if (path === '/admin' || path.endsWith('/admin') || hash === '#admin' || search.includes('admin')) {
        setAdminPanelOpen(true);
      }
    };
    checkUrlForAdmin();
    window.addEventListener('hashchange', checkUrlForAdmin);
    window.addEventListener('popstate', checkUrlForAdmin);
    return () => {
      window.removeEventListener('hashchange', checkUrlForAdmin);
      window.removeEventListener('popstate', checkUrlForAdmin);
    };
  }, []);

  const handleCloseAdmin = () => {
    setAdminPanelOpen(false);
    if (window.location.hash === '#admin') {
      window.history.replaceState(null, '', window.location.pathname);
    } else if (window.location.pathname === '/admin' || window.location.pathname.endsWith('/admin')) {
      window.history.replaceState(null, '', '/');
    }
  };

  const handleScrollToTickets = () => {
    const el = document.getElementById('tickets');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRegisterSuccess = (newReg) => {
    setRegistrations(prev => [newReg, ...prev]);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setRegistrations(prev => prev.map(item => {
      if ((item._id && item._id === id) || item.ticketCode === id || item.id === id) {
        return { ...item, status: newStatus };
      }
      return item;
    }));
  };

  const handleDeleteRegistration = (id) => {
    setRegistrations(prev => prev.filter(item => (item._id !== id && item.ticketCode !== id && item.id !== id)));
  };

  const handleAddManualRegistration = (manualReg) => {
    setRegistrations(prev => [manualReg, ...prev]);
  };

  return (
    <div className={`app-root theme-${currentTheme}`} data-theme={currentTheme}>
      {/* Dynamic ambient backdrop lighting */}
      <div className="ambient-glow-top"></div>

      {/* Floating Modern Navbar with Theme Switcher & Coordinator Portal Button */}
      <Navbar 
        onOpenTickets={handleScrollToTickets} 
        onOpenAdmin={() => setAdminPanelOpen(true)}
        currentTheme={currentTheme}
        onToggleTheme={toggleTheme}
      />

      <main>
        {/* 1. Hero Banner with Exact Mockup Layout, Background & Wave */}
        <Hero 
          onOpenTickets={handleScrollToTickets}
        />

        {/* 2. Event Highlights (with real pool photo card) */}
        <Highlights onOpenPhoto={(src) => setActiveMediaModal(src)} />

        {/* 3. Real Resort Photos & Videos Showcase */}
        <ResortGallery onOpenPhoto={(src) => setActiveMediaModal(src)} />

        {/* 4. Event Snapshot */}
        <Snapshot />

        {/* 5. Rules & Pool Guidelines */}
        <Rules />

        {/* 6. Tickets, UPI QR & Direct Website Registration (Google Form Removed) */}
        <Booking 
          onOpenRegisterModal={() => setRegisterModalOpen(true)}
        />

        {/* 7. Venue & Coordinators (Sonika, Arzoo, Krupa, Kuber) */}
        <Venue onRegisterClick={handleScrollToTickets} />
      </main>

      {/* Clean Footer */}
      <Footer />

      {/* Sticky Mobile Registration CTA */}
      <MobileBottomBar onRegisterClick={handleScrollToTickets} />

      {/* Full-view Lightbox for Poster & Photos */}
      <MediaModal 
        mediaSrc={activeMediaModal} 
        onClose={() => setActiveMediaModal(null)} 
      />

      {/* Attendee Instant Registration Modal */}
      <RegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onRegisterSuccess={handleRegisterSuccess}
        upiId="8151090944@postbank"
      />

      {/* Coordinator Admin Panel Dashboard (Accessed via /admin, #admin, or ?admin) */}
      <AdminPanel
        isOpen={adminPanelOpen}
        onClose={handleCloseAdmin}
        registrations={registrations}
        onUpdateStatus={handleUpdateStatus}
        onDeleteRegistration={handleDeleteRegistration}
        onAddManualRegistration={handleAddManualRegistration}
      />
    </div>
  );
}
