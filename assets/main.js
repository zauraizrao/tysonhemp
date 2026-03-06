// Tyson Hemp — slider + carousel helpers

// Footer year
document.getElementById("year")?.appendChild(document.createTextNode(String(new Date().getFullYear())));

// Mobile nav
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  // Close menu when clicking a link (mobile)
  navLinks.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// HERO SLIDER
const slider = document.getElementById("heroSlider");
const slides = slider ? Array.from(slider.querySelectorAll(".hero-slide")) : [];
const dotsWrap = document.getElementById("heroDots");
const prevBtn = document.getElementById("heroPrev");
const nextBtn = document.getElementById("heroNext");

let current = 0;
let timer = null;
const AUTO_MS = 6000;

function setActive(idx){
  slides.forEach((s,i) => s.classList.toggle("is-active", i === idx));
  document.querySelectorAll(".dot").forEach((d,i) => d.classList.toggle("is-active", i === idx));
  current = idx;
}

function next(){
  setActive((current + 1) % slides.length);
}
function prev(){
  setActive((current - 1 + slides.length) % slides.length);
}

function startAuto(){
  stopAuto();
  if (slides.length > 1) timer = setInterval(next, AUTO_MS);
}
function stopAuto(){
  if (timer) clearInterval(timer);
  timer = null;
}

if (slides.length && dotsWrap) {
  // dots
  dotsWrap.innerHTML = "";
  slides.forEach((_,i) => {
    const b = document.createElement("button");
    b.className = "dot" + (i===0 ? " is-active" : "");
    b.type = "button";
    b.setAttribute("aria-label", `Go to slide ${i+1}`);
    b.addEventListener("click", () => { setActive(i); startAuto(); });
    dotsWrap.appendChild(b);
  });

  prevBtn?.addEventListener("click", () => { prev(); startAuto(); });
  nextBtn?.addEventListener("click", () => { next(); startAuto(); });

  // pause on hover
  slider.addEventListener("mouseenter", stopAuto);
  slider.addEventListener("mouseleave", startAuto);

  startAuto();
}

// CAROUSEL CONTROLS (buttons that scroll the track)
function scrollCarousel(id, dir){
  const root = document.getElementById(id);
  if (!root) return;
  const track = root.querySelector(".carousel-track");
  if (!track) return;

  // scroll by ~1 card width
  const firstCard = track.querySelector("article");
  const amount = firstCard ? firstCard.getBoundingClientRect().width + 16 : 320;

  track.scrollBy({ left: dir * amount, behavior: "smooth" });
}

document.querySelectorAll("[data-carousel-prev]").forEach(btn => {
  btn.addEventListener("click", () => {
    scrollCarousel(btn.getAttribute("data-carousel-prev"), -1);
  });
});
document.querySelectorAll("[data-carousel-next]").forEach(btn => {
  btn.addEventListener("click", () => {
    scrollCarousel(btn.getAttribute("data-carousel-next"), 1);
  });
});

// Optional: swipe hint - makes wheel feel smoother on desktop trackpads
document.querySelectorAll("[data-carousel] .carousel-track").forEach(track => {
  track.addEventListener("wheel", (e) => {
    // If user scrolls vertically on a carousel, convert to horizontal scroll
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      track.scrollLeft += e.deltaY;
    }
  }, { passive: true });
});