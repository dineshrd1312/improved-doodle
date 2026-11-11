/* =========================================================
   CONFIG — the only place to set brand + form destinations
   ========================================================= */
const CONFIG = {
  BRAND_NAME: "Meridian AI",            // PLACEHOLDER: your firm's name
  FORM_ENDPOINT: "",                    // e.g. "https://formspree.io/f/xxxxxxx" — blank = dev mode (simulated success)
  EXTERNAL_FORM_URL: "",                // e.g. Typeform / Google Form / Calendly link — blank hides the link
  CONTACT_EMAIL: "hello@example.com",   // PLACEHOLDER
  PRIVACY_URL: "#",                     // PLACEHOLDER
};

(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

  /* ---------- Brand + config wiring ---------- */
  document.querySelectorAll("[data-brand]").forEach((el) => (el.textContent = CONFIG.BRAND_NAME));
  document.getElementById("year").textContent = new Date().getFullYear();

  const emailLink = document.getElementById("email-link");
  emailLink.href = "mailto:" + CONFIG.CONTACT_EMAIL;
  document.getElementById("privacy-link").href = CONFIG.PRIVACY_URL;

  const extLink = document.getElementById("external-form-link");
  if (CONFIG.EXTERNAL_FORM_URL) {
    extLink.href = CONFIG.EXTERNAL_FORM_URL;
  } else {
    extLink.closest(".alt-link").hidden = true;
  }

  /* ---------- Analytics hooks ---------- */
  function track(event, data) {
    const payload = Object.assign({ event }, data);
    if (Array.isArray(window.dataLayer)) window.dataLayer.push(payload);
    if (!CONFIG.FORM_ENDPOINT) console.debug("[track]", payload);
  }
  document.addEventListener("click", (e) => {
    const cta = e.target.closest("[data-cta]");
    if (cta && cta.tagName === "A") track("cta_click", { cta: cta.dataset.cta });
  });

  /* ---------- Nav border on scroll ---------- */
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Sticky mobile CTA: show after hero, hide near form ---------- */
  const sticky = document.getElementById("sticky-cta");
  const hero = document.getElementById("hero");
  const contact = document.getElementById("contact");
  let heroOut = false, contactIn = false;
  const updateSticky = () => sticky.classList.toggle("is-visible", heroOut && !contactIn);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => { heroOut = !e.isIntersecting; updateSticky(); }).observe(hero);
    new IntersectionObserver(([e]) => { contactIn = e.isIntersecting; updateSticky(); }, { threshold: 0.05 }).observe(contact);

    /* ---------- Reveal on scroll ---------- */
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- FAQ: one open at a time ---------- */
  const faqs = document.querySelectorAll(".faq details");
  faqs.forEach((d) => d.addEventListener("toggle", () => {
    if (d.open) faqs.forEach((o) => { if (o !== d) o.open = false; });
  }));

  /* ---------- Lead form ---------- */
  const form = document.getElementById("lead-form");
  const status = form.querySelector(".form-status");
  const submitBtn = form.querySelector('button[type="submit"]');
  const success = document.getElementById("form-success");
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function validateField(input) {
    const field = input.closest(".field");
    const err = field && field.querySelector(".err");
    if (!err) return true;
    let ok = input.value.trim() !== "";
    if (ok && input.type === "email") ok = EMAIL_RE.test(input.value.trim());
    field.classList.toggle("is-invalid", !ok);
    input.setAttribute("aria-invalid", String(!ok));
    err.textContent = ok ? "" : err.dataset.msg;
    return ok;
  }

  const required = form.querySelectorAll("[required]");
  required.forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      if (input.closest(".field").classList.contains("is-invalid")) validateField(input);
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";

    let firstInvalid = null;
    required.forEach((input) => { if (!validateField(input) && !firstInvalid) firstInvalid = input; });
    if (firstInvalid) { firstInvalid.focus(); return; }

    const data = Object.fromEntries(new FormData(form).entries());
    if (data.website) return; // honeypot tripped — silently drop
    delete data.website;
    data.source = location.href;
    data.submitted_at = new Date().toISOString();

    submitBtn.disabled = true;
    submitBtn.classList.add("is-loading");

    try {
      if (CONFIG.FORM_ENDPOINT) {
        const res = await fetch(CONFIG.FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
      } else {
        console.info("[dev mode] FORM_ENDPOINT not set — lead payload:", data);
        await new Promise((r) => setTimeout(r, 700));
      }
      track("lead_submit", { goal: data.goal });
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch (err) {
      console.error(err);
      status.textContent = "Something went wrong sending your request. Please try again or email us at " + CONFIG.CONTACT_EMAIL + ".";
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove("is-loading");
    }
  });
})();
