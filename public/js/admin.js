// Admin Dashboard — Auth login/logout, list bookings, update status
import { db, auth } from "./firebase-config.js";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { collection, getDocs, doc, updateDoc, Timestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Status labels in Bangla
const STATUS_LABELS = {
  received: "গৃহীত",
  inspection: "পরীক্ষা চলছে",
  waiting_parts: "পার্টস এর অপেক্ষায়",
  in_progress: "মেরামত চলছে",
  ready: "প্রস্তুত",
  delivered: "ডেলিভারি সম্পন্ন"
};

const STATUS_ORDER = ["received", "inspection", "waiting_parts", "in_progress", "ready", "delivered"];

// --- DOM ---
const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const logoutBtn = document.getElementById("logout-btn");
const statusFilter = document.getElementById("status-filter");
const bookingsBody = document.getElementById("bookings-body");
const adminLoading = document.getElementById("admin-loading");

let allBookings = [];

// --- Auth State ---
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginSection.style.display = "none";
    dashboardSection.classList.add("active");
    loadBookings();
  } else {
    loginSection.style.display = "";
    dashboardSection.classList.remove("active");
  }
  if (adminLoading) adminLoading.style.display = "none";
});

// --- Login ---
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("admin-email").value.trim();
  const password = document.getElementById("admin-password").value;

  loginError.classList.remove("visible");

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Login error:", error);
    loginError.textContent = "লগইন ব্যর্থ হয়েছে। ইমেইল ও পাসওয়ার্ড চেক করুন।";
    loginError.classList.add("visible");
  }
});

// --- Logout ---
logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    showToast("লগআউট সম্পন্ন", "success");
  } catch (error) {
    console.error("Logout error:", error);
  }
});

// --- Load Bookings ---
async function loadBookings() {
  bookingsBody.innerHTML = `
    <tr><td colspan="6" class="bookings-empty">
      <span class="spinner dark"></span> বুকিং লোড হচ্ছে...
    </td></tr>
  `;

  try {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    allBookings = [];
    snapshot.forEach(docSnap => {
      allBookings.push({ id: docSnap.id, ...docSnap.data() });
    });

    renderBookings();
  } catch (error) {
    console.error("Load bookings error:", error);
    bookingsBody.innerHTML = `
      <tr><td colspan="6" class="bookings-empty">
        বুকিং লোড করতে সমস্যা হয়েছে
      </td></tr>
    `;
  }
}

// --- Render Bookings Table ---
function renderBookings() {
  const filter = statusFilter.value;
  const filtered = filter === "all"
    ? allBookings
    : allBookings.filter(b => b.status === filter);

  if (filtered.length === 0) {
    bookingsBody.innerHTML = `
      <tr><td colspan="6" class="bookings-empty">কোনো বুকিং পাওয়া যায়নি</td></tr>
    `;
    return;
  }

  bookingsBody.innerHTML = filtered.map(b => `
    <tr>
      <td><strong>${escapeHtml(b.ticketId)}</strong></td>
      <td>
        ${escapeHtml(b.customerName)}<br>
        <small style="color:var(--text-secondary)">${escapeHtml(b.customerPhone)}</small>
      </td>
      <td>${escapeHtml(b.device)}</td>
      <td>${escapeHtml(b.problem)}</td>
      <td><span class="status-badge ${b.status}">${STATUS_LABELS[b.status] || b.status}</span></td>
      <td>
        <select class="status-select" data-ticket-id="${b.ticketId}" onchange="window.updateBookingStatus(this)">
          ${STATUS_ORDER.map(s =>
            `<option value="${s}" ${s === b.status ? "selected" : ""}>${STATUS_LABELS[s]}</option>`
          ).join("")}
        </select>
      </td>
    </tr>
  `).join("");
}

// --- Update Status ---
window.updateBookingStatus = async function (selectEl) {
  const ticketId = selectEl.dataset.ticketId;
  const newStatus = selectEl.value;

  selectEl.disabled = true;

  try {
    const bookingRef = doc(db, "bookings", ticketId);
    const booking = allBookings.find(b => b.ticketId === ticketId);
    const updatedHistory = [...(booking.statusHistory || []), {
      status: newStatus,
      timestamp: Timestamp.now(),
      note: `স্ট্যাটাস আপডেট: ${STATUS_LABELS[newStatus]}`
    }];

    await updateDoc(bookingRef, {
      status: newStatus,
      statusHistory: updatedHistory,
      updatedAt: Timestamp.now()
    });

    // Update local data
    booking.status = newStatus;
    booking.statusHistory = updatedHistory;
    renderBookings();
    showToast("স্ট্যাটাস আপডেট হয়েছে", "success");
  } catch (error) {
    console.error("Update error:", error);
    showToast("আপডেট করতে সমস্যা হয়েছে", "error");
    selectEl.disabled = false;
  }
};

// --- Filter ---
statusFilter.addEventListener("change", renderBookings);

// --- Helpers ---
function escapeHtml(text) {
  if (!text) return "-";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
