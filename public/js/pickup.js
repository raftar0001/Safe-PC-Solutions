// Pick-up & Drop-off Service — WhatsApp redirect

const WHATSAPP_NUMBER = "8801XXXXXXXXX";

const pickupForm = document.getElementById("pickup-form");
if (pickupForm) {
  pickupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("pickup-name").value.trim();
    const phone = document.getElementById("pickup-phone").value.trim();
    const address = document.getElementById("pickup-address").value.trim();
    const time = document.getElementById("pickup-time").value;
    const issue = document.getElementById("pickup-issue").value.trim();

    // Validate phone
    const phoneRegex = /^01[3-9]\d{8}$/;
    const phoneError = document.getElementById("pickup-phone-error");

    if (!phoneRegex.test(phone)) {
      phoneError.textContent = "সঠিক মোবাইল নম্বর দিন (যেমন: 01XXXXXXXXX)";
      phoneError.classList.add("visible");
      return;
    }
    phoneError.classList.remove("visible");

    if (!name || !address || !issue) {
      window.showToast("সব তথ্য পূরণ করুন", "error");
      return;
    }

    const message = encodeURIComponent(
      `আসসালামু আলাইকুম,\nআমি পিক-আপ সার্ভিস নিতে চাই।\n\nনাম: ${name}\nমোবাইল: ${phone}\nঠিকানা: ${address}\nসুবিধাজনক সময়: ${time}\nসমস্যা: ${issue}`
    );

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
    window.showToast("WhatsApp এ রিডাইরেক্ট হচ্ছে...", "success");
  });
}
