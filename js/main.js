/**
 * SUNDOWNER 2026 — INTERACTIVE LOGIC & GOOGLE FORM HANDLER
 */

// ==========================================
// 1. CONFIGURATION
// Replace this with your actual Google Form link!
// ==========================================
let GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfplaceholder/viewform";

// If user previously stored custom form link in browser:
if (localStorage.getItem("sundowner_gform_url")) {
  GOOGLE_FORM_URL = localStorage.getItem("sundowner_gform_url");
}

// Function to handle Google Form opening
function openGoogleForm() {
  if (GOOGLE_FORM_URL.includes("placeholder")) {
    const userPrompt = prompt(
      "Paste your Google Form URL here to link it directly (or click Cancel to open a demo form):",
      "https://forms.google.com/"
    );
    if (userPrompt && userPrompt.trim() !== "") {
      GOOGLE_FORM_URL = userPrompt.trim();
      localStorage.setItem("sundowner_gform_url", GOOGLE_FORM_URL);
      window.open(GOOGLE_FORM_URL, "_blank");
      return;
    }
  }
  window.open(GOOGLE_FORM_URL, "_blank");
}

// ==========================================
// 2. COUNTDOWN TIMER
// Target: 29 November 2026 at 4:00 PM (16:00) IST
// ==========================================
function initCountdown() {
  // Target date in IST (UTC +5:30)
  const targetDate = new Date("2026-11-29T16:00:00+05:30").getTime();

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      document.getElementById("cd-days").textContent = "00";
      document.getElementById("cd-hours").textContent = "00";
      document.getElementById("cd-mins").textContent = "00";
      document.getElementById("cd-secs").textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (n) => (n < 10 ? "0" + n : n);

    const elDays = document.getElementById("cd-days");
    const elHours = document.getElementById("cd-hours");
    const elMins = document.getElementById("cd-mins");
    const elSecs = document.getElementById("cd-secs");

    if (elDays) elDays.textContent = pad(days);
    if (elHours) elHours.textContent = pad(hours);
    if (elMins) elMins.textContent = pad(minutes);
    if (elSecs) elSecs.textContent = pad(seconds);
  }

  update();
  setInterval(update, 1000);
}

// ==========================================
// 3. COPY UPI ID
// ==========================================
function copyUpiId() {
  const upiId = document.getElementById("upiIdText").innerText.trim();
  const copyBtn = document.getElementById("btnCopyUpi");

  navigator.clipboard.writeText(upiId).then(() => {
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
    copyBtn.style.background = "#22c55e";
    copyBtn.style.color = "#000";

    setTimeout(() => {
      copyBtn.innerHTML = originalText;
      copyBtn.style.background = "";
      copyBtn.style.color = "";
    }, 2000);
  }).catch(() => {
    alert("UPI ID: " + upiId);
  });
}

// ==========================================
// 4. POSTER LIGHTBOX MODAL
// ==========================================
function openPosterModal() {
  const modal = document.getElementById("posterModal");
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closePosterModal() {
  const modal = document.getElementById("posterModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
}

// ==========================================
// 5. NAVBAR SCROLL & MOBILE MENU
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  initCountdown();

  const navbar = document.querySelector(".navbar");
  const mobileToggle = document.getElementById("mobileToggle");
  const navLinks = document.getElementById("navLinks");

  // Navbar blur background on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Mobile menu toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      const icon = mobileToggle.querySelector("i");
      if (icon) {
        if (navLinks.classList.contains("active")) {
          icon.className = "fa-solid fa-xmark";
        } else {
          icon.className = "fa-solid fa-bars";
        }
      }
    });

    // Close mobile menu on clicking any link
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        const icon = mobileToggle.querySelector("i");
        if (icon) icon.className = "fa-solid fa-bars";
      });
    });
  }

  // Close modal on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closePosterModal();
    }
  });

  // Auto-detect if user drops real payment-qr.png / payment-qr.jpg
  const qrImage = document.getElementById("eventQrImage");
  if (qrImage) {
    const testImg = new Image();
    testImg.src = "assets/payment-qr.png";
    testImg.onload = () => {
      qrImage.src = "assets/payment-qr.png";
      const note = document.querySelector(".qr-placeholder-note");
      if (note) {
        note.innerHTML = '<i class="fa-solid fa-circle-check text-green-400"></i> Official Payment QR Active';
        note.style.borderColor = "#22c55e";
        note.style.color = "#4ade80";
      }
    };
  }
});

