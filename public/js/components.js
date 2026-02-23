// Shared Components — Navbar, Footer, WhatsApp FAB

const WHATSAPP_NUMBER = "8801XXXXXXXXX";
const WHATSAPP_MESSAGE = encodeURIComponent("আসসালামু আলাইকুম, আমি Safe PC Solutions থেকে সাহায্য নিতে চাই।");

// Determine active page
function getActivePage() {
  const path = window.location.pathname;
  if (path === "/" || path.endsWith("index.html") || path.endsWith("/public/")) return "home";
  if (path.includes("services")) return "services";
  if (path.includes("pricing")) return "pricing";
  if (path.includes("amc")) return "amc";
  if (path.includes("remote-support")) return "remote-support";
  if (path.includes("parts")) return "parts";
  if (path.includes("blog")) return "blog";
  if (path.includes("tracking")) return "tracking";
  if (path.includes("about")) return "about";
  if (path.includes("profile")) return "profile";
  if (path.includes("admin")) return "admin";
  return "";
}

// Check if current page is a services sub-page
function isServicesGroup(page) {
  return ["services", "pricing", "amc", "remote-support", "parts"].includes(page);
}

// Inject Navbar
function renderNavbar() {
  const active = getActivePage();
  const servicesActive = isServicesGroup(active);
  const nav = document.createElement("nav");
  nav.className = "navbar";
  nav.innerHTML = `
    <div class="container">
      <a href="/" class="navbar-brand">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="8" fill="#1a73e8"/>
          <path d="M8 10h16v12H8z" fill="white" opacity="0.9"/>
          <path d="M10 22v2M22 22v2M13 24h6" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="16" cy="16" r="2" fill="#1a73e8"/>
        </svg>
        Safe PC Solutions
      </a>
      <button class="navbar-toggle" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
      <div class="navbar-menu">
        <a href="/" class="${active === "home" ? "active" : ""}">হোম</a>
        <div class="nav-dropdown">
          <button class="nav-dropdown-toggle ${servicesActive ? "active" : ""}" aria-expanded="false">
            সার্ভিস <span class="nav-dropdown-arrow">▼</span>
          </button>
          <div class="nav-dropdown-menu">
            <a href="/services" class="${active === "services" ? "active" : ""}">সার্ভিসসমূহ</a>
            <a href="/pricing" class="${active === "pricing" ? "active" : ""}">মূল্য হিসাব</a>
            <a href="/amc" class="${active === "amc" ? "active" : ""}">AMC প্যাকেজ</a>
            <a href="/remote-support" class="${active === "remote-support" ? "active" : ""}">রিমোট সাপোর্ট</a>
            <a href="/parts" class="${active === "parts" ? "active" : ""}">পার্টস স্টোর</a>
          </div>
        </div>
        <a href="/blog" class="${active === "blog" ? "active" : ""}">ব্লগ</a>
        <a href="/about" class="${active === "about" ? "active" : ""}">আমাদের সম্পর্কে</a>
        <a href="/tracking" class="${active === "tracking" ? "active" : ""}">ট্র্যাকিং</a>
        <a href="/profile" class="${active === "profile" ? "active" : ""}">প্রোফাইল</a>
      </div>
    </div>
  `;

  document.body.prepend(nav);

  // Mobile toggle
  const toggle = nav.querySelector(".navbar-toggle");
  const menu = nav.querySelector(".navbar-menu");
  toggle.addEventListener("click", () => {
    menu.classList.toggle("active");
  });

  // Dropdown toggle (mobile: click, desktop: hover handled by CSS)
  const dropdown = nav.querySelector(".nav-dropdown");
  const dropdownToggle = nav.querySelector(".nav-dropdown-toggle");
  dropdownToggle.addEventListener("click", (e) => {
    e.preventDefault();
    dropdown.classList.toggle("open");
    dropdownToggle.setAttribute("aria-expanded", dropdown.classList.contains("open"));
  });

  // Close menu on direct link click
  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => menu.classList.remove("active"));
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("open");
      dropdownToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// Inject Footer
function renderFooter() {
  const footer = document.createElement("footer");
  footer.className = "footer";
  footer.innerHTML = `
    <div class="container">
      <div>
        <div class="footer-brand">Safe PC Solutions</div>
        <p style="font-size:0.85rem; margin-top:4px;">কেরানীগঞ্জের বিশ্বস্ত কম্পিউটার সেবা</p>
      </div>
      <div class="footer-links">
        <a href="/">হোম</a>
        <a href="/services">সার্ভিস</a>
        <a href="/pricing">মূল্য হিসাব</a>
        <a href="/blog">ব্লগ</a>
        <a href="/parts">পার্টস</a>
        <a href="/tracking">ট্র্যাকিং</a>
      </div>
      <div class="footer-contact">
        <div>📍 কেরানীগঞ্জ, ঢাকা, বাংলাদেশ</div>
        <div>📞 <a href="tel:+8801XXXXXXXXX">+880 1XXX-XXXXXX</a></div>
        <div>✉️ <a href="mailto:info@safepc.com">info@safepc.com</a></div>
      </div>
    </div>
    <div class="container">
      <div class="footer-map">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29220.042269095855!2d90.34!3d23.71!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b0d5983f048d%3A0x2b9d47a3af279a0e!2z4KaV4KeH4Kaw4Ka-4Kao4KeA4KaX4Kae4KeN4Kac!5e0!3m2!1sbn!2sbd!4v1700000000000" width="100%" height="200" style="border:0;border-radius:8px;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Safe PC Solutions এর অবস্থান"></iframe>
      </div>
    </div>
    <div class="container">
      <div class="footer-bottom">
        &copy; ${new Date().getFullYear()} Safe PC Solutions. সর্বস্বত্ব সংরক্ষিত।
      </div>
    </div>
  `;
  document.body.appendChild(footer);
}

// Inject WhatsApp FAB
function renderWhatsAppFab() {
  const fab = document.createElement("a");
  fab.className = "whatsapp-fab";
  fab.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;
  fab.target = "_blank";
  fab.rel = "noopener noreferrer";
  fab.setAttribute("aria-label", "WhatsApp এ মেসেজ করুন");
  fab.innerHTML = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  `;
  document.body.appendChild(fab);
}

// Toast notification helper
window.showToast = function (message, type = "default") {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast ${type}`;
  requestAnimationFrame(() => {
    toast.classList.add("visible");
  });
  setTimeout(() => {
    toast.classList.remove("visible");
  }, 3000);
};

// Initialize all components on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  renderNavbar();
  renderFooter();
  renderWhatsAppFab();
});
