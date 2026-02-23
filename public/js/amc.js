// AMC Package — WhatsApp inquiry redirect

const WHATSAPP_NUMBER = "8801XXXXXXXXX";

document.querySelectorAll(".amc-cta").forEach(btn => {
  btn.addEventListener("click", () => {
    const plan = btn.dataset.plan;
    const message = encodeURIComponent(
      `আসসালামু আলাইকুম,\nআমি Safe PC Solutions এর AMC প্যাকেজ সম্পর্কে জানতে চাই।\n\nপ্যাকেজ: ${plan}\n\nবিস্তারিত জানাবেন দয়া করে।`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  });
});
