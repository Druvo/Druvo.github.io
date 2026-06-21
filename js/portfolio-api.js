/**
 * Hybrid API layer — tries live API first, falls back to static content silently.
 * Static HTML always loads instantly; this file only enhances it when the API is up.
 */

const PORTFOLIO_API = (function () {
  // ── CONFIG ─────────────────────────────────────────────────────────────────
  // Update this to your Cloudflare Tunnel URL when tunnel is set up
  const API_BASE = 'https://api-resume.druvium.xyz';
  const TIMEOUT_MS = 3000;

  // ── FETCH HELPERS ──────────────────────────────────────────────────────────
  async function fetchWithTimeout(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(timer);
      return res.ok ? res.json() : null;
    } catch {
      clearTimeout(timer);
      return null;
    }
  }

  // ── STATUS BADGE ───────────────────────────────────────────────────────────
  function setStatusBadge(isLive) {
    const badge = document.getElementById('api-status-badge');
    if (!badge) return;
    if (isLive) {
      badge.innerHTML = '<span style="color:#4ade80;font-size:0.7rem;">● API Live</span>';
      badge.title = 'Showing live data from backend API';
    } else {
      badge.innerHTML = '<span style="color:#64748b;font-size:0.7rem;">● Offline</span>';
      badge.title = 'API unavailable — showing cached static data';
    }
    badge.style.display = 'inline-block';
  }

  // ── CONTACT FORM HANDLER ───────────────────────────────────────────────────
  function initContactForm(apiIsLive) {
    const form = document.getElementById('portfolio-contact-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const btn = form.querySelector('.contact-submit-btn');
      const msgEl = form.querySelector('.contact-msg');

      const name = form.querySelector('[name="contact_name"]').value.trim();
      const email = form.querySelector('[name="contact_email"]').value.trim();
      const subject = form.querySelector('[name="contact_subject"]').value.trim();
      const message = form.querySelector('[name="contact_message"]').value.trim();

      if (!name || !email || !subject || !message) {
        showFormMsg(msgEl, 'Please fill in all fields.', 'error');
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Sending…';

      if (apiIsLive) {
        try {
          const res = await fetch(`${API_BASE}/api/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, subject, message }),
          });
          const data = await res.json();
          if (res.ok) {
            showFormMsg(msgEl, data.message || 'Message sent! I\'ll get back to you soon.', 'success');
            form.reset();
          } else {
            throw new Error('API error');
          }
        } catch {
          fallbackMailto(name, email, subject, message, msgEl, btn);
        }
      } else {
        fallbackMailto(name, email, subject, message, msgEl, btn);
      }

      btn.disabled = false;
      btn.textContent = 'Send Message';
    });
  }

  function fallbackMailto(name, email, subject, message, msgEl, btn) {
    const body = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`);
    window.location.href = `mailto:zhdruvo@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    showFormMsg(msgEl, 'Opening your email client…', 'info');
  }

  function showFormMsg(el, text, type) {
    if (!el) return;
    const colors = { success: '#4ade80', error: '#f87171', info: '#60a5fa' };
    el.style.color = colors[type] || '#e2e8f0';
    el.textContent = text;
    el.style.display = 'block';
  }

  // ── CONTACT SECTION UPDATE ─────────────────────────────────────────────────
  async function updateContactSection() {
    const data = await fetchWithTimeout(`${API_BASE}/api/config`);
    if (!data) return;

    // Availability card
    const availEl = document.getElementById('availability-status');
    const expEl   = document.getElementById('years-experience');
    if (availEl && data.availabilityStatus) availEl.textContent = data.availabilityStatus;
    if (expEl   && data.yearsOfExperience)  expEl.textContent  = data.yearsOfExperience;

    // Email
    const emailLink = document.getElementById('contact-email-link');
    if (emailLink && data.email) {
      emailLink.href        = `mailto:${data.email}`;
      emailLink.textContent = data.email;
    }

    // Phone — show card only when a number is set
    const phoneCard = document.getElementById('contact-phone-card');
    const phoneLink = document.getElementById('contact-phone-link');
    if (phoneCard && phoneLink) {
      if (data.phone) {
        phoneLink.href        = `tel:${data.phone}`;
        phoneLink.textContent = data.phone;
        phoneCard.style.display = '';
      } else {
        phoneCard.style.display = 'none';
      }
    }

    // Location
    const locationEl = document.getElementById('contact-location');
    if (locationEl && data.location) locationEl.textContent = data.location;

    // LinkedIn
    const linkedinLink = document.getElementById('contact-linkedin-link');
    if (linkedinLink && data.linkedIn) {
      linkedinLink.href = data.linkedIn;
    }

    // GitHub
    const githubLink = document.getElementById('contact-github-link');
    if (githubLink && data.gitHub) {
      githubLink.href = data.gitHub;
    }
  }

  // ── INIT ───────────────────────────────────────────────────────────────────
  async function init() {
    const health = await fetchWithTimeout(`${API_BASE}/api/health`);
    const isLive = health !== null;

    setStatusBadge(isLive);
    initContactForm(isLive);

    if (isLive) {
      await updateContactSection();
    }
  }

  return { init };
})();

// Run after jQuery and DOM are ready
$(document).ready(function () {
  PORTFOLIO_API.init();
});
