// Booking Form — Step navigation, validation, Firestore write
import { db } from "./firebase-config.js";
import { doc, setDoc, Timestamp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// --- Ticket ID Generator ---
function generateTicketId() {
  const now = new Date();
  const date = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  let rand = "";
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SPC-${date}-${rand}`;
}

// --- State ---
let currentStep = 1;
const totalSteps = 3;
let selectedDevice = "";
let selectedProblem = "";

// --- DOM References ---
const form = document.getElementById("booking-form");
const steps = document.querySelectorAll(".form-step");
const dots = document.querySelectorAll(".step-dot");
const lines = document.querySelectorAll(".step-line");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
const successSection = document.getElementById("booking-success");
const formSection = document.getElementById("booking-form-section");

// --- Step Navigation ---
function showStep(step) {
  steps.forEach((s, i) => {
    s.classList.toggle("active", i + 1 === step);
  });
  dots.forEach((d, i) => {
    d.classList.remove("active", "completed");
    if (i + 1 === step) d.classList.add("active");
    else if (i + 1 < step) d.classList.add("completed");
  });
  lines.forEach((l, i) => {
    l.classList.toggle("active", i + 1 < step);
  });
  prevBtn.style.display = step === 1 ? "none" : "";
  nextBtn.style.display = step === totalSteps ? "none" : "";
  submitBtn.style.display = step === totalSteps ? "" : "none";
}

function nextStep() {
  if (!validateStep(currentStep)) return;
  if (currentStep < totalSteps) {
    currentStep++;
    showStep(currentStep);
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
  }
}

// --- Validation ---
function validateStep(step) {
  clearErrors();

  if (step === 1) {
    if (!selectedDevice) {
      showError("device-error", "ডিভাইসের ধরন সিলেক্ট করুন");
      return false;
    }
  }

  if (step === 2) {
    if (!selectedProblem) {
      showError("problem-error", "সমস্যার ধরন সিলেক্ট করুন");
      return false;
    }
    const details = document.getElementById("problem-details").value.trim();
    if (!details) {
      showError("details-error", "সমস্যার বিবরণ দিন");
      document.getElementById("problem-details").classList.add("error");
      return false;
    }
  }

  if (step === 3) {
    const name = document.getElementById("customer-name").value.trim();
    const phone = document.getElementById("customer-phone").value.trim();

    if (!name) {
      showError("name-error", "আপনার নাম দিন");
      document.getElementById("customer-name").classList.add("error");
      return false;
    }
    if (!phone || !/^01[3-9]\d{8}$/.test(phone)) {
      showError("phone-error", "সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)");
      document.getElementById("customer-phone").classList.add("error");
      return false;
    }
  }

  return true;
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = msg;
    el.classList.add("visible");
  }
}

function clearErrors() {
  document.querySelectorAll(".error-msg").forEach(el => {
    el.classList.remove("visible");
    el.textContent = "";
  });
  document.querySelectorAll(".form-control.error").forEach(el => {
    el.classList.remove("error");
  });
}

// --- Option Card Selection ---
function setupOptionCards() {
  // Device options
  document.querySelectorAll("#step-1 .option-card").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll("#step-1 .option-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      selectedDevice = card.dataset.value;
    });
  });

  // Problem options
  document.querySelectorAll("#step-2 .option-card").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll("#step-2 .option-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      selectedProblem = card.dataset.value;
    });
  });
}

// --- Form Submission ---
async function handleSubmit() {
  if (!validateStep(3)) return;

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner"></span> সাবমিট হচ্ছে...';

  try {
    const ticketId = generateTicketId();

    // Build booking document
    const booking = {
      ticketId,
      device: selectedDevice,
      problem: selectedProblem,
      problemDetails: document.getElementById("problem-details").value.trim(),
      customerName: document.getElementById("customer-name").value.trim(),
      customerPhone: document.getElementById("customer-phone").value.trim(),
      customerEmail: document.getElementById("customer-email").value.trim() || null,
      status: "received",
      statusHistory: [{
        status: "received",
        timestamp: Timestamp.now(),
        note: "বুকিং গৃহীত হয়েছে"
      }],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      adminNotes: ""
    };

    // Write to Firestore (ticket ID as document ID)
    await setDoc(doc(db, "bookings", ticketId), booking);

    // Show success
    formSection.style.display = "none";
    successSection.classList.add("active");
    document.getElementById("display-ticket-id").textContent = ticketId;

    showToast("বুকিং সফলভাবে সম্পন্ন হয়েছে!", "success");
  } catch (error) {
    console.error("Booking error:", error);
    showToast("বুকিং সাবমিট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।", "error");
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'সাবমিট করুন';
  }
}

// --- Copy Ticket ID ---
function setupCopyButton() {
  const copyBtn = document.getElementById("copy-ticket-btn");
  if (!copyBtn) return;

  copyBtn.addEventListener("click", () => {
    const ticketId = document.getElementById("display-ticket-id").textContent;
    navigator.clipboard.writeText(ticketId).then(() => {
      showToast("টিকেট আইডি কপি হয়েছে!", "success");
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = ticketId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      showToast("টিকেট আইডি কপি হয়েছে!", "success");
    });
  });
}

// --- Initialize ---
document.addEventListener("DOMContentLoaded", () => {
  if (!form) return;

  showStep(1);
  setupOptionCards();
  setupCopyButton();

  nextBtn.addEventListener("click", nextStep);
  prevBtn.addEventListener("click", prevStep);
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    handleSubmit();
  });

  form.addEventListener("submit", (e) => e.preventDefault());
});
