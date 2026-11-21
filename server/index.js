import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '..', 'dist');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing (support base64 screenshots)
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve static frontend assets from Vite dist
app.use(express.static(distPath));

// ============================================================================
// MongoDB Connection & Graceful Fallback Memory Store
// ============================================================================
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sundowner2026';
let isMongoConnected = false;

// In-memory fallback database for instant local operation / testing
let inMemoryRegistrations = [
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
    createdAt: new Date(Date.now() - 3600000 * 2)
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
    createdAt: new Date(Date.now() - 3600000 * 4)
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
    createdAt: new Date(Date.now() - 3600000 * 6)
  }
];

// Mongoose Schema
const registrationSchema = new mongoose.Schema({
  ticketCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: String, default: '18+' },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  utr: { type: String, default: '' },
  screenshot: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  passSent: { type: Boolean, default: false },
  passSentAt: { type: Date },
  checkedIn: { type: Boolean, default: false },
  checkedInAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const Registration = mongoose.models.Registration || mongoose.model('Registration', registrationSchema);

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 2500
})
.then(() => {
  isMongoConnected = true;
  console.log(`✅ [MongoDB] Connected successfully to: ${MONGODB_URI}`);
})
.catch((err) => {
  isMongoConnected = false;
  console.log(`ℹ️ [MongoDB] Notice: Could not connect to MongoDB (${err.message}).`);
  console.log(`💡 Operating with in-memory database fallback. (Configure MONGODB_URI in .env when ready).`);
});

// ============================================================================
// Nodemailer SMTP Transporter
// ============================================================================
const getTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  // Gmail special optimization
  if (host === 'smtp.gmail.com' || host === 'gmail' || (user && user.endsWith('@gmail.com'))) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
};

// Generate VIP HTML Email Template (Clean Text & Pass Code Badge without external QR image blocks)
const buildVipPassEmail = ({ name, ticketCode }) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0A0807; color: #F7F4F0; margin: 0; padding: 24px 12px; }
    .container { max-width: 580px; margin: 0 auto; background: #14100E; border: 1.5px solid #E59838; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 40px rgba(0,0,0,0.8); }
    .header { background: linear-gradient(135deg, #E06D3B 0%, #E59838 50%, #F3BA59 100%); padding: 32px 24px; text-align: center; color: #000; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 2px; }
    .header p { margin: 6px 0 0 0; font-size: 13px; font-weight: 700; letter-spacing: 1.5px; opacity: 0.9; }
    .body-content { padding: 32px 28px; }
    .greeting { font-size: 18px; font-weight: 700; color: #FFFFFF; margin-bottom: 8px; }
    .message { font-size: 14px; line-height: 1.6; color: #A8A09B; margin-bottom: 24px; }
    .ticket-card { background: #0A0807; border: 2px dashed #E59838; border-radius: 16px; padding: 28px 20px; text-align: center; margin-bottom: 24px; }
    .ticket-label { font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #F3BA59; font-weight: 800; margin-bottom: 8px; }
    .ticket-id { font-size: 38px; font-weight: 900; font-family: 'Courier New', Courier, monospace; color: #FFFFFF; letter-spacing: 4px; padding: 10px 24px; background: rgba(229, 152, 56, 0.12); border-radius: 8px; display: inline-block; margin: 8px 0 12px 0; border: 1px solid rgba(229, 152, 56, 0.35); text-shadow: 0 0 15px rgba(229, 152, 56, 0.3); }
    .ticket-caption { font-size: 13px; color: #A8A09B; line-height: 1.5; }
    .details-grid { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px; margin-bottom: 24px; font-size: 13px; }
    .detail-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #6E6763; text-transform: uppercase; font-weight: 600; font-size: 11px; }
    .detail-val { color: #FFFFFF; font-weight: 700; }
    .notice-box { background: rgba(229, 152, 56, 0.1); border-left: 4px solid #E59838; padding: 12px 16px; border-radius: 8px; margin-bottom: 24px; font-size: 12.5px; line-height: 1.5; color: #F3BA59; }
    .coordinators-box { font-size: 12px; color: #A8A09B; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 18px; text-align: center; }
    .coord-item { display: inline-block; margin: 4px 10px; color: #F7F4F0; font-weight: 600; }
    .footer { text-align: center; padding: 18px; font-size: 11px; color: #6E6763; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SUNDOWNER 2026</h1>
      <p>OFFICIAL VIP ENTRY PASS</p>
    </div>
    
    <div class="body-content">
      <div class="greeting">Hi ${name},</div>
      <p class="message">
        Your registration and payment have been verified by our coordinator team! Below is your official VIP Event Pass Code for <strong>SUNDOWNER 2026</strong>. Please present this pass code to our coordinators at the entrance gate on event day.
      </p>

      <div class="ticket-card">
        <div class="ticket-label">OFFICIAL VIP ENTRY CODE</div>
        <div class="ticket-id">${ticketCode}</div>
        <div class="ticket-caption">Present this code at the Orchard Resort entrance for direct VIP verification and entry.</div>
      </div>

      <div class="details-grid">
        <div class="detail-row">
          <span class="detail-label">EVENT</span>
          <span class="detail-val">SUNDOWNER 2026</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">DATE</span>
          <span class="detail-val">Sunday, 29 November 2026</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">TIMINGS</span>
          <span class="detail-val">4:00 PM – 8:00 PM</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">VENUE</span>
          <span class="detail-val">Orchard Resort, Navge Cross, Belagavi</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">POOL ACCESS</span>
          <span class="detail-val">Open till 6:30 PM (Swimwear mandatory)</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">REFRESHMENTS</span>
          <span class="detail-val">Complimentary Mocktails & High Tea Snacks</span>
        </div>
      </div>

      <div class="notice-box">
        ⚠️ <strong>Important Pool Note:</strong> Proper swimming costume is compulsory for pool access. Pool closes strictly at 6:30 PM for safety. DJ party & refreshments continue until 8:00 PM.
      </div>

      <div class="coordinators-box">
        <strong>Event Coordinators for Assistance:</strong><br>
        <span class="coord-item">📞 Sonika: +91 81510 90944</span>
        <span class="coord-item">📞 Arzoo: +91 6362-172106</span>
        <span class="coord-item">📞 Krupa: +91 74834 01240</span>
        <span class="coord-item">📞 Kuber: +91 78998 24069</span>
      </div>
    </div>

    <div class="footer">
      Sundowner 2026 &bull; Orchard Resort, Belagavi &bull; See you at the sunset party!
    </div>
  </div>
</body>
</html>
`;
};

// ============================================================================
// REST API ENDPOINTS
// ============================================================================

// 1. Health check & status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: isMongoConnected ? 'MongoDB (Connected)' : 'In-Memory Cache (MongoDB offline)',
    smtpConfigured: Boolean(process.env.SMTP_USER && process.env.SMTP_PASS),
    serverTime: new Date()
  });
});

// 2. Register Attendee (Stores to MongoDB)
app.post('/api/register', async (req, res) => {
  try {
    const { name, age, phone, email, utr, screenshot } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({ error: 'Name, phone, and email are required.' });
    }

    const ticketCode = `SUN-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRecordData = {
      ticketCode,
      name: name.trim(),
      age: age || '18+',
      phone: phone.trim(),
      email: email.trim(),
      utr: utr ? utr.trim() : `UPI-${Date.now().toString().slice(-6)}`,
      screenshot: screenshot || '/assets/payment-qr.jpg',
      status: 'Pending',
      passSent: false,
      checkedIn: false,
      createdAt: new Date()
    };

    let savedRecord;

    if (isMongoConnected) {
      const regDoc = new Registration(newRecordData);
      savedRecord = await regDoc.save();
    } else {
      savedRecord = { _id: `mem-${Date.now()}`, ...newRecordData };
      inMemoryRegistrations.unshift(savedRecord);
    }

    // Generate QR code data URL
    const qrDataUrl = await QRCode.toDataURL(ticketCode, {
      width: 320,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' }
    });

    res.status(201).json({
      success: true,
      registration: savedRecord,
      qrDataUrl,
      message: 'Registration submitted successfully. Awaiting coordinator verification.'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error while saving registration.' });
  }
});

// 3. Get all registrations (For Admin Panel)
app.get('/api/registrations', async (req, res) => {
  try {
    if (isMongoConnected) {
      const docs = await Registration.find().sort({ createdAt: -1 });
      res.json(docs);
    } else {
      res.json(inMemoryRegistrations);
    }
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to retrieve registrations.' });
  }
});

// 4. Approve Registration & Send Confirmation Pass (Email or WhatsApp fallback)
app.post('/api/registrations/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { channel = 'all', skipEmail = false } = req.body || {};
    let regItem = null;

    if (isMongoConnected) {
      regItem = await Registration.findById(id);
      if (!regItem) {
        regItem = await Registration.findOne({ ticketCode: id });
      }
    } else {
      regItem = inMemoryRegistrations.find(r => r._id === id || r.ticketCode === id);
    }

    if (!regItem) {
      return res.status(404).json({ error: 'Registration not found.' });
    }

    // 1. Update Record status to Approved in database
    regItem.status = 'Approved';
    regItem.passSent = true;
    regItem.passSentAt = new Date();

    if (isMongoConnected) {
      await regItem.save();
    }

    // 2. Prepare instant WhatsApp share URL & message text
    const cleanPhone = (regItem.phone || '').replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const waText = `🎉 *VIP ENTRY PASS — SUNDOWNER 2026* 🎉\n\nHi ${regItem.name}!\nYour registration & payment for Sundowner 2026 at Orchard Resort has been CONFIRMED!\n\n🎟️ *Official VIP Pass Code:* *${regItem.ticketCode}*\n📍 *Venue:* Orchard Resort, Navge Cross, Belagavi\n📅 *Date:* Sunday, 29 November 2026\n⏰ *Timings:* 4:00 PM – 8:00 PM (Pool open till 6:30 PM)\n🍸 *Inclusions:* Unlimited Complimentary Mocktails & Hot Snacks, Live DJ Arena\n\n👉 *Entrance:* Present this pass code (*${regItem.ticketCode}*) at the gate to our coordinators (Sonika, Arzoo, Krupa & Kuber) for instant VIP admission.\n\nSee you at the sunset party! 🌅`;
    const whatsappUrl = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(waText)}`;

    // 3. Attempt Email dispatch (if not explicitly skipped for WhatsApp-only)
    let emailSent = false;
    let emailMessage = '';

    if (!skipEmail && channel !== 'whatsapp') {
      const transporter = getTransporter();
      if (transporter && regItem.email && regItem.email.includes('@')) {
        try {
          const mailOptions = {
            from: `"SUNDOWNER 2026" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to: regItem.email,
            subject: `🎟️ Your VIP Pass for SUNDOWNER 2026 is Confirmed! [${regItem.ticketCode}]`,
            html: buildVipPassEmail({
              name: regItem.name,
              ticketCode: regItem.ticketCode
            })
          };

          const info = await transporter.sendMail(mailOptions);
          console.log(`✉️ Email successfully dispatched to ${regItem.email}. MsgId: ${info.messageId}`);
          emailSent = true;
          emailMessage = `VIP Pass Code (${regItem.ticketCode}) emailed to ${regItem.email}!`;
        } catch (mailErr) {
          console.error('SMTP Mail error (WhatsApp fallback ready):', mailErr.message);
          emailMessage = `Approved! Pass Code #${regItem.ticketCode} generated. (Email failed: ${mailErr.message}. Use WhatsApp button to share).`;
        }
      } else {
        emailMessage = `Approved! Pass Code #${regItem.ticketCode} generated. Ready to share on WhatsApp!`;
      }
    } else {
      emailMessage = `Approved! Pass Code #${regItem.ticketCode} ready to share via WhatsApp.`;
    }

    res.json({
      success: true,
      registration: regItem,
      ticketCode: regItem.ticketCode,
      emailSent,
      whatsappUrl,
      whatsappMessage: waText,
      message: emailMessage
    });

  } catch (error) {
    console.error('Approve error:', error);
    res.status(500).json({ error: 'Failed to approve registration and generate pass.' });
  }
});

// 5. Update Status (Manual toggle)
app.put('/api/registrations/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Pending' | 'Approved' | 'Rejected'

    let regItem = null;
    if (isMongoConnected) {
      regItem = await Registration.findByIdAndUpdate(id, { status }, { new: true });
    } else {
      regItem = inMemoryRegistrations.find(r => r._id === id || r.ticketCode === id);
      if (regItem) regItem.status = status;
    }

    if (!regItem) {
      return res.status(404).json({ error: 'Registration not found.' });
    }

    res.json({ success: true, registration: regItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status.' });
  }
});

// 6. Delete Registration
app.delete('/api/registrations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      await Registration.findByIdAndDelete(id);
    } else {
      inMemoryRegistrations = inMemoryRegistrations.filter(r => r._id !== id && r.ticketCode !== id);
    }
    res.json({ success: true, message: 'Registration deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete registration.' });
  }
});

// 7. Verify Pass at Event Entrance (Scanner / Search Endpoint)
app.get('/api/verify/:ticketCode', async (req, res) => {
  try {
    const { ticketCode } = req.params;
    const query = ticketCode.trim();
    const queryUpper = query.toUpperCase();
    const phoneDigits = query.replace(/\D/g, '');

    let reg = null;
    if (isMongoConnected) {
      reg = await Registration.findOne({
        $or: [
          { ticketCode: queryUpper },
          { phone: { $regex: phoneDigits || query, $options: 'i' } },
          { name: { $regex: query, $options: 'i' } }
        ]
      });
    } else {
      reg = inMemoryRegistrations.find(r => 
        r.ticketCode.toUpperCase() === queryUpper ||
        (phoneDigits && r.phone && r.phone.replace(/\D/g, '').includes(phoneDigits)) ||
        (r.name && r.name.toUpperCase().includes(queryUpper))
      );
    }

    if (!reg) {
      return res.json({ valid: false, message: `No guest found matching "${query}".` });
    }

    if (reg.status !== 'Approved') {
      return res.json({ valid: false, message: `Pass ${reg.ticketCode} is ${reg.status} (Payment not verified).`, registration: reg });
    }

    res.json({
      valid: true,
      message: 'Pass is Verified & Valid!',
      registration: reg
    });
  } catch (error) {
    res.status(500).json({ error: 'Verification error.' });
  }
});

// 8. Gate Entrance Check-In
app.post('/api/checkin/:ticketCode', async (req, res) => {
  try {
    const { ticketCode } = req.params;
    const codeClean = ticketCode.trim().toUpperCase();

    let reg = null;
    if (isMongoConnected) {
      reg = await Registration.findOne({ ticketCode: codeClean });
      if (reg) {
        reg.checkedIn = true;
        reg.checkedInAt = new Date();
        await reg.save();
      }
    } else {
      reg = inMemoryRegistrations.find(r => r.ticketCode.toUpperCase() === codeClean);
      if (reg) {
        reg.checkedIn = true;
        reg.checkedInAt = new Date();
      }
    }

    if (!reg) {
      return res.status(404).json({ error: 'Ticket not found.' });
    }

    res.json({ success: true, registration: reg, message: `${reg.name} checked in successfully!` });
  } catch (error) {
    res.status(500).json({ error: 'Check-in error.' });
  }
});

// SPA fallback for all frontend routes (Client-side routing)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`🚀 [Server] Sundowner 2026 API Server listening on port ${PORT}`);
  console.log(`📡 [Endpoints] /api/register | /api/registrations | /api/verify/:ticketCode`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ [Port Collision] Port ${PORT} is already in use by another process.`);
    console.error(`👉 Another server instance is already running on port ${PORT}.\n`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});

