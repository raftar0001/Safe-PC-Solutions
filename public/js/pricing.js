// Price Calculator — Client-side pricing estimation

const PRICING_DATA = {
  "ডেস্কটপ পিসি": {
    "হার্ডওয়্যার সমস্যা": {
      "মাদারবোর্ড রিপেয়ার": { service: 1500, parts: 2000 },
      "পাওয়ার সাপ্লাই রিপ্লেস": { service: 300, parts: 1500 },
      "RAM আপগ্রেড": { service: 200, parts: 2000 },
      "SSD আপগ্রেড": { service: 300, parts: 2500 },
      "গ্রাফিক্স কার্ড ইন্সটল": { service: 300, parts: 8000 },
      "কুলিং ফ্যান রিপ্লেস": { service: 200, parts: 500 }
    },
    "সফটওয়্যার সমস্যা": {
      "উইন্ডোজ ইন্সটল": { service: 500, parts: 0 },
      "ভাইরাস রিমুভাল": { service: 500, parts: 0 },
      "ডাটা রিকভারি": { service: 1500, parts: 0 },
      "সফটওয়্যার সেটআপ": { service: 300, parts: 0 },
      "ড্রাইভার ইন্সটল": { service: 300, parts: 0 }
    },
    "নেটওয়ার্ক সমস্যা": {
      "ওয়াইফাই সেটআপ": { service: 500, parts: 800 },
      "LAN সেটআপ": { service: 500, parts: 500 },
      "নেটওয়ার্ক ট্রাবলশুট": { service: 400, parts: 0 }
    },
    "পারফরম্যান্স": {
      "ফুল সার্ভিসিং ও ক্লিনিং": { service: 500, parts: 200 },
      "থার্মাল পেস্ট রিপ্লেস": { service: 300, parts: 150 },
      "অপটিমাইজেশন": { service: 400, parts: 0 }
    }
  },
  "ল্যাপটপ": {
    "হার্ডওয়্যার সমস্যা": {
      "স্ক্রিন রিপ্লেস": { service: 800, parts: 3000 },
      "কীবোর্ড রিপ্লেস": { service: 500, parts: 1200 },
      "মাদারবোর্ড রিপেয়ার": { service: 2000, parts: 2500 },
      "ব্যাটারি রিপ্লেস": { service: 300, parts: 2000 },
      "চার্জিং পোর্ট রিপেয়ার": { service: 800, parts: 500 },
      "RAM আপগ্রেড": { service: 300, parts: 2000 },
      "SSD আপগ্রেড": { service: 500, parts: 2500 },
      "হিঞ্জ রিপেয়ার": { service: 600, parts: 800 }
    },
    "সফটওয়্যার সমস্যা": {
      "উইন্ডোজ ইন্সটল": { service: 700, parts: 0 },
      "ভাইরাস রিমুভাল": { service: 500, parts: 0 },
      "ডাটা রিকভারি": { service: 2000, parts: 0 },
      "BIOS আপডেট/রিপেয়ার": { service: 800, parts: 0 }
    },
    "পারফরম্যান্স": {
      "ফুল সার্ভিসিং ও ক্লিনিং": { service: 700, parts: 200 },
      "থার্মাল পেস্ট রিপ্লেস": { service: 500, parts: 150 },
      "অপটিমাইজেশন": { service: 400, parts: 0 }
    }
  },
  "প্রিন্টার": {
    "হার্ডওয়্যার সমস্যা": {
      "হেড ক্লিনিং": { service: 400, parts: 0 },
      "রোলার রিপ্লেস": { service: 500, parts: 600 },
      "পেপার জ্যাম ফিক্স": { service: 300, parts: 0 }
    },
    "সফটওয়্যার সমস্যা": {
      "ড্রাইভার ইন্সটল": { service: 300, parts: 0 },
      "নেটওয়ার্ক প্রিন্টার সেটআপ": { service: 500, parts: 0 }
    },
    "কার্টিজ/টোনার": {
      "কার্টিজ রিফিল": { service: 200, parts: 400 },
      "টোনার রিফিল": { service: 300, parts: 600 }
    }
  }
};

const deviceSelect = document.getElementById("calc-device");
const problemSelect = document.getElementById("calc-problem");
const subtypeSelect = document.getElementById("calc-subtype");
const resultDiv = document.getElementById("calc-result");

// Populate devices
Object.keys(PRICING_DATA).forEach(device => {
  const opt = document.createElement("option");
  opt.value = device;
  opt.textContent = device;
  deviceSelect.appendChild(opt);
});

// Device change → populate problems
deviceSelect.addEventListener("change", () => {
  const device = deviceSelect.value;
  problemSelect.innerHTML = '<option value="">— সমস্যার ধরন বাছাই করুন —</option>';
  subtypeSelect.innerHTML = '<option value="">— প্রথমে সমস্যা বাছাই করুন —</option>';
  subtypeSelect.disabled = true;
  resultDiv.classList.remove("active");

  if (!device) {
    problemSelect.disabled = true;
    return;
  }

  problemSelect.disabled = false;
  Object.keys(PRICING_DATA[device]).forEach(problem => {
    const opt = document.createElement("option");
    opt.value = problem;
    opt.textContent = problem;
    problemSelect.appendChild(opt);
  });
});

// Problem change → populate subtypes
problemSelect.addEventListener("change", () => {
  const device = deviceSelect.value;
  const problem = problemSelect.value;
  subtypeSelect.innerHTML = '<option value="">— বিস্তারিত বাছাই করুন —</option>';
  resultDiv.classList.remove("active");

  if (!problem) {
    subtypeSelect.disabled = true;
    return;
  }

  subtypeSelect.disabled = false;
  Object.keys(PRICING_DATA[device][problem]).forEach(sub => {
    const opt = document.createElement("option");
    opt.value = sub;
    opt.textContent = sub;
    subtypeSelect.appendChild(opt);
  });
});

// Subtype change → show result
subtypeSelect.addEventListener("change", () => {
  const device = deviceSelect.value;
  const problem = problemSelect.value;
  const subtype = subtypeSelect.value;

  if (!subtype) {
    resultDiv.classList.remove("active");
    return;
  }

  const pricing = PRICING_DATA[device][problem][subtype];
  const total = pricing.service + pricing.parts;

  document.getElementById("calc-service").textContent = `৳${pricing.service.toLocaleString("bn-BD")}`;
  document.getElementById("calc-parts").textContent = pricing.parts > 0
    ? `৳${pricing.parts.toLocaleString("bn-BD")}`
    : "প্রযোজ্য নয়";
  document.getElementById("calc-total").textContent = `৳${total.toLocaleString("bn-BD")}`;

  resultDiv.classList.add("active");
});
