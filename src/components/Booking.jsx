import React, { useState } from 'react';
import Interactive3DCard from './Interactive3DCard';

export default function Booking({ onOpenRegisterModal }) {
  const [copied, setCopied] = useState(false);
  
  // Official India Post Payments Bank UPI ID & Payee Name
  const upiId = "8151090944@postbank";
  const payeeName = "SANIKA DHIRAJ BUVA";

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      alert(`UPI ID: ${upiId}`);
    });
  };

  return (
    <section className="section" id="tickets">
      <div className="container">
        
        <div className="booking-clean-box box-3d-depth">
          
          {/* Header */}
          <div className="section-head" style={{ marginBottom: '2.5rem' }}>
            <div className="section-tag">
              <i className="fa-solid fa-ticket"></i> Official Pass Reservations
            </div>
            <h2 className="section-h2">
              RESERVE YOUR PASS <br />
              <span className="gradient-text">FOR SUNDOWNER 2026</span>
            </h2>
            <p className="section-desc">
              Secure your spot at Belagavi’s premier poolside sunset celebration at Orchard Resort. Fast, direct on-site booking verified by our coordinator team.
            </p>
          </div>

          <div className="booking-clean-grid">
            
            {/* Left Column: 3 Steps Registration Flow */}
            <div className="booking-steps-column">
              <h3 className="booking-steps-heading">
                <i className="fa-solid fa-list-check text-orange"></i> 3 Simple Steps to Reserve:
              </h3>

              <div className="reg-steps-list">
                
                {/* Step 1 */}
                <div className="reg-step-row">
                  <div className="reg-step-num">01</div>
                  <div className="reg-step-text">
                    <h4>Scan Verified QR & Complete Payment</h4>
                    <p>Scan the official India Post Payments Bank QR card on the right using any UPI app (GPay, PhonePe, Paytm, BHIM, Cred).</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="reg-step-row">
                  <div className="reg-step-num">02</div>
                  <div className="reg-step-text">
                    <h4>Save Payment Receipt & UTR</h4>
                    <p>Keep a clear screenshot of your transaction confirmation showing the 12-digit UTR / Reference ID.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="reg-step-row">
                  <div className="reg-step-num">03</div>
                  <div className="reg-step-text">
                    <h4>Submit Guest Details & Receive QR Pass</h4>
                    <p>Fill out the simple on-site form below. Once our coordinators verify your payment, an official QR pass code will be dispatched to your email!</p>
                    <div className="form-pill-tags">
                      <span className="form-pill-tag"><i className="fa-solid fa-user"></i> Full Name</span>
                      <span className="form-pill-tag"><i className="fa-solid fa-id-badge"></i> Age</span>
                      <span className="form-pill-tag"><i className="fa-solid fa-phone"></i> Phone Number</span>
                      <span className="form-pill-tag"><i className="fa-solid fa-envelope"></i> Email Address</span>
                      <span className="form-pill-tag"><i className="fa-solid fa-image"></i> Payment Receipt</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Button: Instant On-Site Registration */}
              <div className="booking-cta-block">
                
                <div>
                  <button 
                    type="button" 
                    className="btn btn-primary btn-pulse btn-3d-depth btn-booking-register"
                    onClick={onOpenRegisterModal}
                  >
                    <i className="fa-solid fa-bolt"></i> Register on Website Now (Get VIP Pass)
                  </button>
                </div>
                
                <div className="booking-trust-note">
                  <i className="fa-solid fa-shield-check text-orange"></i>
                  <span>Verified pass issuance. All registrations are verified directly by coordinators Sonika, Arzoo, Krupa &amp; Kuber.</span>
                </div>
              </div>

            </div>

            {/* Right Column: Sleek VIP Digital Pass Card with India Post QR */}
            <div className="booking-pass-column">
              <Interactive3DCard maxTilt={10} depth={18} className="qr-card-3d-wrapper">
                <div className="qr-clean-card">
                  
                  {/* Card Header & Bank Badge */}
                  <div className="qr-header-bar layer-3d-float">
                    <span className="card-badge">
                      <i className="fa-solid fa-building-columns"></i> India Post Payments Bank
                    </span>
                    <span className="qr-pass-tag">
                      <i className="fa-solid fa-shield-halved text-orange"></i> Verified UPI
                    </span>
                  </div>

                  <h3 className="qr-card-title layer-3d-float">
                    SCAN TO PAY VIA UPI
                  </h3>
                  <p className="qr-card-sub layer-3d-float">
                    Compatible with GPay, PhonePe, Paytm, BHIM & Cred
                  </p>

                  {/* QR Image Frame with Subtle Glow */}
                  <div className="qr-box-img layer-3d-float">
                    <img 
                      src="/assets/payment-qr.jpg" 
                      alt="Official Payment QR Code - Sanika Dhiraj Buva (India Post Payments Bank)"
                      loading="lazy"
                    />
                  </div>

                  {/* Payee Info */}
                  <div className="qr-payee-info layer-3d-float">
                    <div className="qr-payee-name">{payeeName}</div>
                    <div className="qr-payee-status">
                      <i className="fa-solid fa-circle-check"></i> Verified Merchant Account
                    </div>
                  </div>

                  {/* UPI Copy Pill */}
                  <div className="upi-copy-capsule layer-3d-float">
                    <span className="upi-text">{upiId}</span>
                    <button 
                      type="button" 
                      className="btn-copy-upi" 
                      onClick={handleCopyUpi}
                      title="Copy UPI ID"
                    >
                      {copied ? (
                        <><i className="fa-solid fa-check"></i> Copied</>
                      ) : (
                        <><i className="fa-regular fa-copy"></i> Copy</>
                      )}
                    </button>
                  </div>

                  <div className="qr-footer-date layer-3d-float">
                    <i className="fa-solid fa-calendar-check text-gold"></i> <strong>29 NOVEMBER 2026</strong> &bull; 4:00 PM – 8:00 PM
                  </div>
                </div>
              </Interactive3DCard>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
