// Parts Store — Product catalog with WhatsApp ordering

const WHATSAPP_NUMBER = "8801XXXXXXXXX";

const PRODUCTS = [
  {
    name: "SSD 256GB (SATA)",
    category: "স্টোরেজ",
    price: "৳২,৫০০",
    description: "2.5\" SATA SSD — ল্যাপটপ ও ডেস্কটপে ব্যবহারযোগ্য",
    emoji: "💾",
    color: "linear-gradient(135deg, #1a73e8, #4285f4)"
  },
  {
    name: "SSD 512GB (NVMe)",
    category: "স্টোরেজ",
    price: "৳৪,০০০",
    description: "M.2 NVMe SSD — সুপার ফাস্ট রিড/রাইট স্পিড",
    emoji: "💾",
    color: "linear-gradient(135deg, #1557b0, #1a73e8)"
  },
  {
    name: "RAM 8GB DDR4",
    category: "মেমোরি",
    price: "৳২,৮০০",
    description: "DDR4 3200MHz — ল্যাপটপ/ডেস্কটপ (মডেল উল্লেখ করুন)",
    emoji: "🧩",
    color: "linear-gradient(135deg, #34a853, #4caf50)"
  },
  {
    name: "RAM 16GB DDR4",
    category: "মেমোরি",
    price: "৳৫,০০০",
    description: "DDR4 3200MHz — হেভি মাল্টিটাস্কিং ও গেমিং এর জন্য",
    emoji: "🧩",
    color: "linear-gradient(135deg, #2d9249, #34a853)"
  },
  {
    name: "থার্মাল পেস্ট (MX-4)",
    category: "এক্সেসরিজ",
    price: "৳৪৫০",
    description: "Arctic MX-4 — প্রিমিয়াম থার্মাল কম্পাউন্ড, 4g",
    emoji: "🌡️",
    color: "linear-gradient(135deg, #f9ab00, #ff9800)"
  },
  {
    name: "ল্যাপটপ কুলিং প্যাড",
    category: "এক্সেসরিজ",
    price: "৳১,২০০",
    description: "ডুয়াল ফ্যান কুলিং প্যাড — 15.6\" পর্যন্ত ল্যাপটপের জন্য",
    emoji: "❄️",
    color: "linear-gradient(135deg, #00bcd4, #03a9f4)"
  },
  {
    name: "ওয়্যারলেস মাউস",
    category: "পেরিফেরাল",
    price: "৳৬৫০",
    description: "2.4GHz ওয়্যারলেস মাউস — আরামদায়ক ডিজাইন",
    emoji: "🖱️",
    color: "linear-gradient(135deg, #9c27b0, #ab47bc)"
  },
  {
    name: "USB কীবোর্ড",
    category: "পেরিফেরাল",
    price: "৳৫৫০",
    description: "ফুল সাইজ USB কীবোর্ড — বাংলা/ইংরেজি লেআউট",
    emoji: "⌨️",
    color: "linear-gradient(135deg, #5c6bc0, #7986cb)"
  },
  {
    name: "ওয়েবক্যাম HD",
    category: "পেরিফেরাল",
    price: "৳১,৫০০",
    description: "720p HD ওয়েবক্যাম — বিল্ট-ইন মাইক্রোফোন সহ",
    emoji: "📷",
    color: "linear-gradient(135deg, #e91e63, #f06292)"
  },
  {
    name: "HDMI ক্যাবল (1.5m)",
    category: "এক্সেসরিজ",
    price: "৳৩৫০",
    description: "HDMI 2.0 ক্যাবল — 4K সাপোর্ট",
    emoji: "🔌",
    color: "linear-gradient(135deg, #607d8b, #78909c)"
  },
  {
    name: "পাওয়ার সাপ্লাই 500W",
    category: "স্টোরেজ",
    price: "৳৩,০০০",
    description: "500W ATX পাওয়ার সাপ্লাই — 80+ সার্টিফাইড",
    emoji: "⚡",
    color: "linear-gradient(135deg, #ff5722, #ff7043)"
  },
  {
    name: "ইন্টারনাল HDD 1TB",
    category: "স্টোরেজ",
    price: "৳৩,৫০০",
    description: "3.5\" SATA HDD — ডেস্কটপের জন্য বাল্ক স্টোরেজ",
    emoji: "💿",
    color: "linear-gradient(135deg, #795548, #8d6e63)"
  }
];

const CATEGORIES = ["সব", "স্টোরেজ", "মেমোরি", "এক্সেসরিজ", "পেরিফেরাল"];

const filtersContainer = document.getElementById("parts-filters");
const gridContainer = document.getElementById("parts-grid");
let activeCategory = "সব";

// Render filters
CATEGORIES.forEach(cat => {
  const btn = document.createElement("button");
  btn.className = `filter-btn${cat === "সব" ? " active" : ""}`;
  btn.textContent = cat;
  btn.addEventListener("click", () => {
    activeCategory = cat;
    filtersContainer.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts();
  });
  filtersContainer.appendChild(btn);
});

// Render products
function renderProducts() {
  const filtered = activeCategory === "সব"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory);

  gridContainer.innerHTML = filtered.map(p => `
    <div class="part-card">
      <div class="part-card-img" style="background:${p.color};"><span>${p.emoji}</span></div>
      <div class="part-card-body">
        <h3>${p.name}</h3>
        <p class="part-desc">${p.description}</p>
        <div class="part-card-footer">
          <span class="part-price">${p.price}</span>
          <button class="btn btn-accent part-order-btn" data-name="${p.name}" data-price="${p.price}">অর্ডার করুন</button>
        </div>
      </div>
    </div>
  `).join("");

  // Attach order handlers
  gridContainer.querySelectorAll(".part-order-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = btn.dataset.price;
      const message = encodeURIComponent(
        `আসসালামু আলাইকুম,\nআমি নিচের পণ্যটি অর্ডার করতে চাই:\n\nপণ্য: ${name}\nমূল্য: ${price}\n\nবিস্তারিত জানাবেন দয়া করে।`
      );
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
    });
  });
}

renderProducts();
