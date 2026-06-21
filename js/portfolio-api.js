/**
 * Hybrid API layer — tries live API first, falls back to static content silently.
 * Static HTML always loads instantly; this file only enhances it when the API is up.
 */

const PORTFOLIO_API = (function () {
  // ── CONFIG ─────────────────────────────────────────────────────────────────
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

  function parseJson(str, fallback) {
    try { return JSON.parse(str) || fallback; } catch { return fallback; }
  }

  // ── STATUS BADGE ───────────────────────────────────────────────────────────
  function setStatusBadge(isLive) {
    const badge = document.getElementById('api-status-badge');
    if (!badge) return;
    if (isLive) {
      badge.innerHTML = '<span style="color:#4ade80;font-size:0.7rem;">&#9679; API Live</span>';
      badge.title = 'Showing live data from backend API';
    } else {
      badge.innerHTML = '<span style="color:#64748b;font-size:0.7rem;">&#9679; Offline</span>';
      badge.title = 'API unavailable — showing cached static data';
    }
    badge.style.display = 'inline-block';
  }

  // ── HERO SECTION ───────────────────────────────────────────────────────────
  function updateHero(cfg) {
    const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };
    const setHref = (id, val) => { const el = document.getElementById(id); if (el && val) el.href = val; };

    set('hero-greeting', cfg.heroGreeting);
    set('hero-subtitle', cfg.heroSubtitle);
    set('hero-name', cfg.name);
    set('hero-tagline', cfg.tagline);
    set('hero-availability', cfg.availabilityStatus);

    // Bio: first sentence is bolded
    const bioEl = document.getElementById('hero-bio');
    if (bioEl && cfg.heroDescription) {
      const parts = cfg.heroDescription.split('. ');
      if (parts.length > 1) {
        bioEl.innerHTML = '<strong>' + parts[0] + '.</strong> ' + parts.slice(1).join('. ');
      } else {
        bioEl.textContent = cfg.heroDescription;
      }
    }

    // Logo
    const logoEl = document.getElementById('nav-logo');
    if (logoEl && cfg.logoUrl) {
      logoEl.src = cfg.logoUrl;
    }

    // Hire Me link
    const hireMeEl = document.getElementById('nav-hire-me');
    if (hireMeEl && cfg.hireMeEmail) {
      hireMeEl.href = 'mailto:' + cfg.hireMeEmail + '?subject=Hire%20Me%20-%20Project%20Inquiry';
    }

    // Resume button
    const resumeBtn = document.getElementById('hero-resume-btn');
    if (resumeBtn && cfg.resumeUrl) {
      resumeBtn.href = cfg.resumeUrl;
    }

    // Hero highlights
    const highlights = parseJson(cfg.heroHighlights, []);
    const highlightsEl = document.getElementById('hero-highlights');
    if (highlightsEl && highlights.length) {
      highlightsEl.innerHTML = highlights.map(function (h) {
        return '<div class="col-12">' +
          '<div class="highlight-item">' +
          '<i class="fa fa-check-circle" style="color:#00FFFF;margin-right:6px;"></i>' +
          '<span>' + escHtml(h) + '</span>' +
          '</div></div>';
      }).join('');
    }
  }

  // ── SKILLS SECTION ─────────────────────────────────────────────────────────
  // Map category name keywords → Font Awesome icon class
  const SKILL_ICONS = {
    'backend':      'fa-server',
    'framework':    'fa-cogs',
    'frontend':     'fa-desktop',
    'database':     'fa-database',
    'cloud':        'fa-cloud',
    'devops':       'fa-rocket',
    'architect':    'fa-sitemap',
    'pattern':      'fa-sitemap',
    'test':         'fa-check-square',
    'tool':         'fa-wrench',
    'security':     'fa-lock',
    'mobile':       'fa-mobile',
    'ai':           'fa-brain',
    'artificial':   'fa-brain',
    'machine':      'fa-brain',
    'data':         'fa-bar-chart',
    'queue':        'fa-exchange',
    'message':      'fa-exchange',
    'language':     'fa-code',
    'default':      'fa-code',
  };

  function skillIcon(categoryName) {
    const lower = categoryName.toLowerCase();
    for (const key of Object.keys(SKILL_ICONS)) {
      if (key !== 'default' && lower.includes(key)) return SKILL_ICONS[key];
    }
    return SKILL_ICONS.default;
  }

  function updateSkills(categories) {
    const grid = document.getElementById('skills-grid');
    if (!grid || !categories || !categories.length) return;

    // Split into rows of 3
    const rows = [];
    for (let i = 0; i < categories.length; i += 3) {
      rows.push(categories.slice(i, i + 3));
    }

    grid.innerHTML = rows.map(function (row, ri) {
      const cls = ri === 0 ? 'row' : 'row mt-4';
      return '<div class="' + cls + '">' +
        row.map(function (cat) {
          const icon = skillIcon(cat.name);
          const skills = (cat.skills || []).map(function (s) {
            return '<span class="skill-tag">' + escHtml(s.name) + '</span>';
          }).join('');
          return '<div class="col-lg-4 col-md-6">' +
            '<div class="skill-category cyberpunk-card">' +
            '<h5><i class="fa ' + icon + '"></i> ' + escHtml(cat.name) + '</h5>' +
            '<div class="skill-tags">' + skills + '</div>' +
            '</div></div>';
        }).join('') +
        '</div>';
    }).join('');
  }

  // ── SERVICES SECTION ───────────────────────────────────────────────────────
  function updateServices(cfg) {
    const grid = document.getElementById('services-grid');
    if (!grid) return;
    const services = parseJson(cfg.services, []);
    if (!services.length) return;

    grid.innerHTML = services.map(function (svc) {
      return '<div class="col-lg-3 col-md-6">' +
        '<div class="feature_item cyberpunk-card">' +
        '<div class="service-icon"><i class="fa ' + escHtml(svc.icon || 'fa-cog') + '" aria-hidden="true"></i></div>' +
        '<h4>' + escHtml(svc.title) + '</h4>' +
        '<p>' + escHtml(svc.desc) + '</p>' +
        '</div></div>';
    }).join('');
  }

  // ── OPEN SOURCE SECTION ────────────────────────────────────────────────────
  function updateOpenSource(cfg) {
    const row = document.getElementById('opensource-projects');
    if (!row) return;
    const projects = parseJson(cfg.openSource, []);
    if (!projects.length) return;

    row.innerHTML = projects.map(function (p) {
      const tags = (p.tags || []).map(function (t) {
        return '<span class="tech-tag">' + escHtml(t) + '</span>';
      }).join('');
      return '<div class="col-lg-6 col-md-12">' +
        '<div class="opensource-project cyberpunk-card">' +
        '<div class="project-header">' +
        '<i class="fa ' + escHtml(p.icon || 'fa-code') + '"></i>' +
        '<div>' +
        '<h5>' + escHtml(p.title) + '</h5>' +
        '<span class="project-stats">' + escHtml(p.stats || '') + '</span>' +
        '</div></div>' +
        '<p>' + escHtml(p.desc) + '</p>' +
        '<div class="tech-tags">' + tags + '</div>' +
        (p.url ? '<a href="' + escHtml(p.url) + '" target="_blank" class="btn-link"><i class="fa fa-external-link"></i> View on GitHub</a>' : '') +
        '</div></div>';
    }).join('');

    // GitHub stats
    const setGhStat = function (id, val) {
      const el = document.getElementById(id);
      if (el && val) el.textContent = val;
    };
    setGhStat('github-followers', cfg.githubFollowers);
    setGhStat('github-stars', cfg.githubStars);
    setGhStat('github-forks', cfg.githubForks);

    // GitHub profile link
    const ghLink = document.getElementById('github-profile-link');
    if (ghLink && cfg.gitHub) ghLink.href = cfg.gitHub;
  }

  // ── CONTACT SECTION ────────────────────────────────────────────────────────
  function updateContactSection(cfg) {
    const set = function (id, val) { const el = document.getElementById(id); if (el && val) el.textContent = val; };

    set('availability-status', cfg.availabilityStatus);
    set('years-experience', cfg.yearsOfExperience);
    set('contact-location', cfg.location);

    const emailLink = document.getElementById('contact-email-link');
    if (emailLink && cfg.email) {
      emailLink.href = 'mailto:' + cfg.email;
      emailLink.textContent = cfg.email;
    }

    const phoneCard = document.getElementById('contact-phone-card');
    const phoneLink = document.getElementById('contact-phone-link');
    if (phoneCard && phoneLink) {
      if (cfg.phone) {
        phoneLink.href = 'tel:' + cfg.phone;
        phoneLink.textContent = cfg.phone;
        phoneCard.style.display = '';
      } else {
        phoneCard.style.display = 'none';
      }
    }

    const linkedinLink = document.getElementById('contact-linkedin-link');
    if (linkedinLink && cfg.linkedIn) linkedinLink.href = cfg.linkedIn;

    const githubLink = document.getElementById('contact-github-link');
    if (githubLink && cfg.gitHub) githubLink.href = cfg.gitHub;
  }

  // ── CONTACT FORM HANDLER ───────────────────────────────────────────────────
  function initContactForm(apiIsLive) {
    const form = document.getElementById('portfolio-contact-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const btn    = form.querySelector('.contact-submit-btn');
      const msgEl  = form.querySelector('.contact-msg');
      const name    = form.querySelector('[name="contact_name"]').value.trim();
      const email   = form.querySelector('[name="contact_email"]').value.trim();
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
          const res = await fetch(API_BASE + '/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, subject, message }),
          });
          const data = await res.json();
          if (res.ok) {
            showFormMsg(msgEl, data.message || "Message sent! I'll get back to you soon.", 'success');
            form.reset();
          } else {
            throw new Error('API error');
          }
        } catch {
          fallbackMailto(name, email, subject, message, msgEl);
        }
      } else {
        fallbackMailto(name, email, subject, message, msgEl);
      }

      btn.disabled = false;
      btn.textContent = 'Send Message';
    });
  }

  function fallbackMailto(name, email, subject, message, msgEl) {
    const body = encodeURIComponent('From: ' + name + ' <' + email + '>\n\n' + message);
    window.location.href = 'mailto:zhdruvo@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + body;
    showFormMsg(msgEl, 'Opening your email client…', 'info');
  }

  function showFormMsg(el, text, type) {
    if (!el) return;
    const colors = { success: '#4ade80', error: '#f87171', info: '#60a5fa' };
    el.style.color = colors[type] || '#e2e8f0';
    el.textContent = text;
    el.style.display = 'block';
  }

  // ── HELPERS ────────────────────────────────────────────────────────────────
  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── INIT ───────────────────────────────────────────────────────────────────
  async function init() {
    const health = await fetchWithTimeout(API_BASE + '/api/health');
    const isLive = health !== null;

    setStatusBadge(isLive);
    initContactForm(isLive);

    if (!isLive) return;

    const [cfg, skills] = await Promise.all([
      fetchWithTimeout(API_BASE + '/api/config'),
      fetchWithTimeout(API_BASE + '/api/skills'),
    ]);

    if (cfg) {
      updateHero(cfg);
      updateServices(cfg);
      updateOpenSource(cfg);
      updateContactSection(cfg);
    }

    if (skills) {
      updateSkills(skills);
    }
  }

  return { init };
})();

$(document).ready(function () {
  PORTFOLIO_API.init();
});
