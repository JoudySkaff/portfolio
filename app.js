const slides = Array.from(document.querySelectorAll(".slide"));
const dotsContainer = document.getElementById("sliderDots");
const nextButton = document.getElementById("nextSlide");
const prevButton = document.getElementById("prevSlide");
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.getElementById("navMenu");
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const revealItems = Array.from(document.querySelectorAll(".reveal"));
const faqItems = Array.from(document.querySelectorAll(".faq-item"));
const themeToggleBtn = document.getElementById("theme-toggle");
const themeStorageKey = "all_indeed_theme";

let activeIndex = 0;
let sliderTimer = null;

function applyTheme(theme, persist = true) {
  const next = theme === "light" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  if (persist) localStorage.setItem(themeStorageKey, next);
  if (themeToggleBtn) {
    themeToggleBtn.textContent = next === "dark" ? "🌗" : "🌞";
    themeToggleBtn.title = next === "dark" ? "الوضع الداكن" : "الوضع الفاتح";
    themeToggleBtn.setAttribute("aria-label", themeToggleBtn.title);
  }
}

applyTheme(localStorage.getItem(themeStorageKey) || "dark", false);

function renderDots() {
  if (!dotsContainer || !slides.length) return;

  dotsContainer.innerHTML = "";

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "slider-dot";
    dot.setAttribute("aria-label", `انتقال إلى الشريحة ${index + 1}`);

    dot.addEventListener("click", () => {
      setActiveSlide(index);
      restartAutoplay();
    });

    dotsContainer.appendChild(dot);
  });
}

function setActiveSlide(index) {
  if (!slides.length || !dotsContainer) return;

  activeIndex = (index + slides.length) % slides.length;

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === activeIndex);
  });

  Array.from(dotsContainer.children).forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === activeIndex);
  });
}

function nextSlide() {
  if (!slides.length) return;
  setActiveSlide(activeIndex + 1);
}

function prevSlide() {
  if (!slides.length) return;
  setActiveSlide(activeIndex - 1);
}

function startAutoplay() {
  if (!slides.length) return;
  sliderTimer = window.setInterval(nextSlide, 5000);
}

function restartAutoplay() {
  if (!slides.length) return;
  window.clearInterval(sliderTimer);
  startAutoplay();
}

function setupMenu() {
  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
      navMenu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupReveal() {
  if (!revealItems.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  revealItems.forEach((item) => observer.observe(item));
}

function setupScrollSpy() {
  const sections = ["hero", "about", "services", "blog", "contact", "faq"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleEntry) return;

    const id = visibleEntry.target.id;
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const isMatch = href === `#${id}`;
      link.classList.toggle("active", isMatch);
    });
  }, { threshold: 0.45 });

  sections.forEach((section) => observer.observe(section));
}

function setupFaq() {
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");
    const icon = item.querySelector(".faq-icon");
    if (!button || !icon) return;

    button.addEventListener("click", () => {
      const isOpen = item.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
      icon.textContent = isOpen ? "−" : "+";
    });
  });
}

renderDots();
setActiveSlide(0);
setupMenu();
setupReveal();
setupScrollSpy();
setupFaq();
startAutoplay();

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    applyTheme(current === "dark" ? "light" : "dark");
  });
}

if (nextButton) {
  nextButton.addEventListener("click", () => {
    nextSlide();
    restartAutoplay();
  });
}

if (prevButton) {
  prevButton.addEventListener("click", () => {
    prevSlide();
    restartAutoplay();
  });
}
