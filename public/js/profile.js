// Profile — Lookup bookings by phone number
import { db } from "./firebase-config.js";
import { collection, query, where, getDocs, limit } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const STATUS_LABELS = {
  received: "গৃহীত হয়েছে",
  inspection: "পরীক্ষা চলছে",
  waiting_parts: "পার্টস এর অপেক্ষায়",
  in_progress: "মেরামত চলছে",
  ready: "ডেলিভারির জন্য প্রস্তুত",
  delivered: "ডেলিভারি সম্পন্ন"
};

const ACTIVE_STATUSES = ["received", "inspection", "waiting_parts", "in_progress", "ready"];

const searchBtn = document.getElementById("profile-search-btn");
const phoneInput = document.getElementById("profile-phone");
const phoneError = document.getElementById("profile-phone-error");
const lookupSection = document.getElementById("profile-lookup");
const infoSection = document.getElementById("profile-info");
const bookingsSection = document.getElementById("profile-bookings");
const bookingsList = document.getElementById("bookings-list");
const emptySection = document.getElementById("profile-empty");

searchBtn.addEventListener("click", searchByPhone);
phoneInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchByPhone();
});

async function searchByPhone() {
  const phone = phoneInput.value.trim();

  // Validate phone
  if (!/^01[3-9]\d{8}$/.test(phone)) {
    phoneError.textContent = "সঠিক মোবাইল নম্বর দিন (যেমন: 01XXXXXXXXX)";
    phoneError.classList.add("visible");
    return;
  }
  phoneError.classList.remove("visible");

  searchBtn.disabled = true;
  searchBtn.innerHTML = '<span class="spinner"></span>';

  try {
    const q = query(
      collection(db, "bookings"),
      where("customerPhone", "==", phone),
      limit(50)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      infoSection.style.display = "none";
      bookingsSection.style.display = "none";
      emptySection.style.display = "block";
      return;
    }

    // Sort by createdAt descending (client-side since we can't combine where + orderBy without index)
    const bookings = [];
    snapshot.forEach(doc => bookings.push(doc.data()));
    bookings.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime;
    });

    // Profile info from most recent booking
    const latest = bookings[0];
    document.getElementById("profile-name").textContent = latest.customerName || "-";
    document.getElementById("profile-phone-display").textContent = phone;
    document.getElementById("profile-email-display").textContent = latest.customerEmail || "";

    // Stats
    const total = bookings.length;
    const active = bookings.filter(b => ACTIVE_STATUSES.includes(b.status)).length;
    const completed = bookings.filter(b => b.status === "delivered").length;
    document.getElementById("stat-total").textContent = total;
    document.getElementById("stat-active").textContent = active;
    document.getElementById("stat-completed").textContent = completed;

    // Render bookings
    renderBookings(bookings);

    emptySection.style.display = "none";
    infoSection.style.display = "block";
    bookingsSection.style.display = "block";

  } catch (error) {
    console.error("Profile search error:", error);
    showToast("তথ্য লোড করতে সমস্যা হয়েছে", "error");
  } finally {
    searchBtn.disabled = false;
    searchBtn.innerHTML = "খুঁজুন";
  }
}

function renderBookings(bookings) {
  bookingsList.innerHTML = bookings.map(b => `
    <div class="profile-booking-card">
      <div class="profile-booking-header">
        <span class="profile-ticket-id">${b.ticketId}</span>
        <span class="status-badge ${b.status}">${STATUS_LABELS[b.status] || b.status}</span>
      </div>
      <div class="profile-booking-details">
        <div>
          <span class="profile-detail-label">ডিভাইস</span>
          <strong>${b.device || "-"}</strong>
        </div>
        <div>
          <span class="profile-detail-label">সমস্যা</span>
          <strong>${b.problem || "-"}</strong>
        </div>
        <div>
          <span class="profile-detail-label">তারিখ</span>
          <strong>${formatDate(b.createdAt)}</strong>
        </div>
      </div>
      ${b.problemDetails ? `<p class="profile-booking-desc">${b.problemDetails}</p>` : ""}
      <a href="/tracking" class="btn btn-outline btn-sm profile-track-btn">ট্র্যাক করুন</a>
    </div>
  `).join("");
}

function formatDate(timestamp) {
  if (!timestamp || !timestamp.toDate) return "-";
  const d = timestamp.toDate();
  return d.toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" });
}
