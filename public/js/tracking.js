// Tracking — Firestore doc lookup by ticket ID
import { db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Status labels in Bangla
const STATUS_LABELS = {
  received: "গৃহীত হয়েছে",
  inspection: "পরীক্ষা চলছে",
  waiting_parts: "পার্টস এর অপেক্ষায়",
  in_progress: "মেরামত চলছে",
  ready: "ডেলিভারির জন্য প্রস্তুত",
  delivered: "ডেলিভারি সম্পন্ন"
};

const STATUS_ORDER = ["received", "inspection", "waiting_parts", "in_progress", "ready", "delivered"];

// --- DOM ---
const searchBtn = document.getElementById("track-btn");
const ticketInput = document.getElementById("ticket-input");
const resultSection = document.getElementById("tracking-result");
const errorSection = document.getElementById("tracking-error");
const stepperSection = document.getElementById("progress-stepper");

// --- Search ---
async function searchTicket() {
  const ticketId = ticketInput.value.trim().toUpperCase();

  if (!ticketId) {
    showToast("টিকেট আইডি দিন", "error");
    return;
  }

  // Basic format check
  if (!/^SPC-\d{8}-[A-Z0-9]{4}$/.test(ticketId)) {
    showToast("সঠিক টিকেট আইডি দিন (SPC-XXXXXXXX-XXXX)", "error");
    return;
  }

  searchBtn.disabled = true;
  searchBtn.innerHTML = '<span class="spinner"></span>';

  // Reset previous results
  resultSection.classList.remove("active");
  errorSection.classList.remove("active");
  stepperSection.classList.remove("active");

  try {
    const docRef = doc(db, "bookings", ticketId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      errorSection.classList.add("active");
      errorSection.innerHTML = `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style="margin:0 auto 12px;display:block;">
          <circle cx="12" cy="12" r="10" stroke="#d93025" stroke-width="2"/>
          <path d="M8 8l8 8M16 8l-8 8" stroke="#d93025" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <p style="font-weight:600;font-size:1.1rem;">টিকেট পাওয়া যায়নি</p>
        <p style="color:var(--text-secondary);font-size:0.9rem;margin-top:4px;">আপনার টিকেট আইডি চেক করে আবার চেষ্টা করুন</p>
      `;
      return;
    }

    const data = docSnap.data();
    renderResult(data);
    renderStepper(data.status);
    renderStatusHistory(data.statusHistory || []);

  } catch (error) {
    console.error("Tracking error:", error);
    showToast("তথ্য লোড করতে সমস্যা হয়েছে", "error");
  } finally {
    searchBtn.disabled = false;
    searchBtn.innerHTML = 'অনুসন্ধান';
  }
}

// --- Render Result ---
function renderResult(data) {
  document.getElementById("result-device").textContent = data.device || "-";
  document.getElementById("result-problem").textContent = data.problem || "-";
  document.getElementById("result-name").textContent = data.customerName || "-";
  document.getElementById("result-date").textContent = formatDate(data.createdAt);
  document.getElementById("result-status-badge").textContent = STATUS_LABELS[data.status] || data.status;
  document.getElementById("result-status-badge").className = `status-badge ${data.status}`;

  resultSection.classList.add("active");
}

// --- Render Stepper ---
function renderStepper(currentStatus) {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  const stepsContainer = document.getElementById("stepper-steps");
  stepsContainer.innerHTML = "";

  STATUS_ORDER.forEach((status, i) => {
    const step = document.createElement("div");
    step.className = "stepper-step";
    if (i < currentIndex) step.classList.add("completed");
    else if (i === currentIndex) step.classList.add("current");

    step.innerHTML = `<div class="step-label">${STATUS_LABELS[status]}</div>`;
    stepsContainer.appendChild(step);
  });

  stepperSection.classList.add("active");
}

// --- Render Status History ---
function renderStatusHistory(history) {
  const container = document.getElementById("status-history-list");
  if (!container) return;

  if (history.length === 0) {
    container.innerHTML = '<p style="color:var(--text-secondary);font-size:0.9rem;">কোনো হিস্টোরি নেই</p>';
    return;
  }

  container.innerHTML = history
    .slice()
    .reverse()
    .map(item => `
      <div class="history-item">
        <span class="history-time">${formatDate(item.timestamp)}</span>
        <div>
          <div class="history-status">${STATUS_LABELS[item.status] || item.status}</div>
          ${item.note ? `<div class="history-note">${escapeHtml(item.note)}</div>` : ""}
        </div>
      </div>
    `).join("");
}

// --- Helpers ---
function formatDate(timestamp) {
  if (!timestamp) return "-";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// --- Initialize ---
document.addEventListener("DOMContentLoaded", () => {
  if (!searchBtn) return;

  searchBtn.addEventListener("click", searchTicket);

  ticketInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchTicket();
  });

  // Auto-uppercase input
  ticketInput.addEventListener("input", () => {
    ticketInput.value = ticketInput.value.toUpperCase();
  });
});
