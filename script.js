/* =============================================
   JEET JHA PORTFOLIO — UPGRADED INTERACTIVE JS
   ============================================= */

/* ── 1. SCROLL PROGRESS BAR ── */
const progressBar = document.getElementById('scroll-progress');
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}

/* ── 2. NAVBAR SCROLL EFFECT ── */
const navbar = document.getElementById('navbar');
function updateNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}

/* ── 3. BACK TO TOP BUTTON ── */
const backToTop = document.getElementById('back-to-top');
function updateBackToTop() {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* Combined scroll listener */
window.addEventListener('scroll', () => {
  updateProgress();
  updateNavbar();
  updateBackToTop();
}, { passive: true });

/* ── 4. CURSOR GLOW ── */
const cursorGlow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
}, { passive: true });

/* ── 5. MOBILE MENU ── */
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});

/* ── 6. ACTIVE NAV HIGHLIGHT ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cv)');
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector('.nav-links a[href="#' + entry.target.id + '"]');
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => navObserver.observe(s));

/* ── 7. REVEAL ON SCROLL ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── 8. SKILL BAR ANIMATION ── */
const barObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        setTimeout(() => { bar.style.width = bar.getAttribute('data-width') + '%'; }, 200);
      });
      barObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.skill-category').forEach(el => barObs.observe(el));

/* ── 9. TYPEWRITER EFFECT ── */
const roles = [
  'Data Science Enthusiast',
  'ML Enthusiast',
  'Flutter Developer',
  'Software Engineer',
  'Problem Solver'
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeEl = document.getElementById('typewriter');

function typeWriter() {
  const currentRole = roles[roleIndex];

  if (!isDeleting) {
    typeEl.textContent = currentRole.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentRole.length) {
      isDeleting = true;
      setTimeout(typeWriter, 1800);
      return;
    }
  } else {
    typeEl.textContent = currentRole.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeWriter, 400);
      return;
    }
  }

  setTimeout(typeWriter, isDeleting ? 60 : 90);
}
setTimeout(typeWriter, 1000);

/* ═══════════════════════════════════════════════════════════
   ── 10. DYNAMIC STAT COUNTERS ──
   Reads real numbers from the DOM instead of hard-coded values:
     • projects      → counts .project-card elements in #projects-grid
     • certificates  → counts .cert-card elements in #certs-grid
     • technologies  → counts unique [data-tech] values across all project cards
   CGPA stays as a static data-target (won't change on its own).

   HOW TO ADD MORE: just drop another .project-card or .cert-card into the
   appropriate grid and the counters update automatically on next page load.
   ═══════════════════════════════════════════════════════════ */
function getDynamicTarget(type) {
  switch (type) {
    case 'projects':
      return document.querySelectorAll('#projects-grid .project-card').length;

    case 'certificates':
      return document.querySelectorAll('#certs-grid .cert-card').length;

    case 'technologies': {
      const techSet = new Set();
      document.querySelectorAll('#projects-grid .project-card [data-tech]').forEach(el => {
        const tech = el.getAttribute('data-tech').trim().toLowerCase();
        if (tech) techSet.add(tech);
      });
      return techSet.size;
    }

    default:
      return null;
  }
}

function animateCounter(el, target, isDecimal) {
  const duration = 1800;
  const start = performance.now();
  const countEl = el.querySelector('.count');
  if (!countEl) return;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(ease * target);

    if (isDecimal) {
      // 857 → display as 8.57
      countEl.textContent = (current / 100).toFixed(2);
    } else {
      countEl.textContent = current;
    }

    if (progress < 1) requestAnimationFrame(update);
    else {
      countEl.textContent = isDecimal ? (target / 100).toFixed(2) : target;
    }
  }
  requestAnimationFrame(update);
}

const statsObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('[data-count-type], [data-target]').forEach(statEl => {
        const countType = statEl.getAttribute('data-count-type');
        const isDecimal = statEl.hasAttribute('data-decimal');

        let target;
        if (countType) {
          target = getDynamicTarget(countType);
        } else {
          target = parseInt(statEl.getAttribute('data-target'));
        }

        if (target !== null && !isNaN(target)) {
          animateCounter(statEl, target, isDecimal);
        }
      });
      statsObs.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) statsObs.observe(statsSection);

/* ── 11. SKILL FILTER TABS ── */
document.querySelectorAll('.skill-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.skill-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.getAttribute('data-filter');

    document.querySelectorAll('.skill-category').forEach(cat => {
      const catType = cat.getAttribute('data-category');

      if (filter === 'all') {
        cat.classList.remove('filtered-out', 'selected');
        cat.style.opacity = '1';
        cat.style.transform = 'scale(1)';
        cat.style.pointerEvents = '';
      } else if (catType === filter) {
        cat.classList.remove('filtered-out');
        cat.classList.add('selected');
        cat.style.opacity = '1';
        cat.style.transform = 'scale(1.02)';
        cat.style.pointerEvents = '';
      } else {
        cat.classList.remove('selected');
        cat.classList.add('filtered-out');
        cat.style.opacity = '0.2';
        cat.style.transform = 'scale(0.96)';
        cat.style.pointerEvents = 'none';
      }
    });
  });
});

/* ── 12. PROJECT FILTER TABS ── */
document.querySelectorAll('.proj-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.proj-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');

    document.querySelectorAll('.project-card').forEach(card => {
      const tag = card.getAttribute('data-tag');
      if (filter === 'all' || tag === filter) {
        card.style.opacity = '1';
        card.style.transform = '';
        card.style.pointerEvents = '';
        card.style.position = '';
      } else {
        card.style.opacity = '0.2';
        card.style.transform = 'scale(0.96)';
        card.style.pointerEvents = 'none';
      }
    });
  });
});

function setupProjectImageLightbox() {
  document.querySelectorAll('.project-card').forEach(card => {
    const imageZone = card.querySelector('.project-img-zone');
    if (!imageZone) return;

    imageZone.addEventListener('click', () => {
      const title = card.querySelector('.project-title')?.textContent.trim() || 'Project Image';
      const subtitle = card.querySelector('.project-desc')?.textContent.trim() || '';
      const dataImages = card.getAttribute('data-images') || '';
      const images = dataImages.split(',').map(src => src.trim()).filter(Boolean);

      if (images.length === 0) return;

      openLightbox(title, subtitle, images, 0);
    });

    imageZone.style.cursor = 'pointer';
  });
}

setupProjectImageLightbox();

/* ── 13. PROJECT MODALS ── */
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function closeModalOnOverlay(event, id) {
  if (event.target === event.currentTarget) closeModal(id);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
      document.body.style.overflow = '';
    });
    closeLightbox();
  }
});

/* ── 14. CERTIFICATE + PROJECT IMAGE LIGHTBOX ── */
let currentLightboxImages = [];
let currentLightboxIndex = 0;

function openLightbox(title, subtitle, images, startIndex = 0) {
  currentLightboxImages = images || [];
  currentLightboxIndex = Math.max(0, Math.min(startIndex, currentLightboxImages.length - 1));

  document.getElementById('lightbox-title').textContent = title;
  document.getElementById('lightbox-issuer').textContent = subtitle;

  const counter = document.getElementById('lightbox-counter');
  if (currentLightboxImages.length > 1) {
    counter.textContent = `${currentLightboxIndex + 1} / ${currentLightboxImages.length}`;
    counter.style.display = 'inline-block';
    document.querySelector('.lightbox-nav.prev').style.display = 'inline-flex';
    document.querySelector('.lightbox-nav.next').style.display = 'inline-flex';
  } else {
    counter.style.display = 'none';
    document.querySelector('.lightbox-nav.prev').style.display = 'none';
    document.querySelector('.lightbox-nav.next').style.display = 'none';
  }

  updateLightboxImage();

  const lightbox = document.getElementById('cert-lightbox');
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function openCertLightbox(title, issuer, imgSrc) {
  openLightbox(title, issuer, [imgSrc], 0);
}

function updateLightboxImage() {
  const img = document.getElementById('lightbox-img');
  const placeholder = document.querySelector('.lightbox-placeholder');

  if (currentLightboxImages.length === 0) {
    img.style.display = 'none';
    placeholder.style.display = 'flex';
    return;
  }

  const src = currentLightboxImages[currentLightboxIndex];
  img.src = src;
  img.alt = document.getElementById('lightbox-title').textContent;

  img.onload = () => {
    img.style.display = 'block';
    placeholder.style.display = 'none';
  };

  img.onerror = () => {
    img.style.display = 'none';
    placeholder.style.display = 'flex';
  };

  const counter = document.getElementById('lightbox-counter');
  if (counter && currentLightboxImages.length > 1) {
    counter.textContent = `${currentLightboxIndex + 1} / ${currentLightboxImages.length}`;
  }
}

function changeLightboxImage(direction) {
  if (currentLightboxImages.length <= 1) return;
  currentLightboxIndex = (currentLightboxIndex + direction + currentLightboxImages.length) % currentLightboxImages.length;
  updateLightboxImage();
}

function closeLightbox() {
  const lightbox = document.getElementById('cert-lightbox');
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── 15. COPY EMAIL ── */
const EMAIL = 'jeetjha07@gmail.com'; // ← REPLACE with your real email

function copyEmail() {
  navigator.clipboard.writeText(EMAIL).then(() => {
    const tooltip = document.getElementById('copy-tooltip');
    tooltip.classList.add('show');
    setTimeout(() => tooltip.classList.remove('show'), 2000);
  }).catch(() => {
    window.location.href = 'mailto:' + EMAIL;
  });
}

/* ── 16. DARK / LIGHT MODE TOGGLE ── */
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = themeBtn.querySelector('i');
const savedTheme = localStorage.getItem('jeet-theme');

if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  themeIcon.className = 'fa-solid fa-sun';
}

themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeIcon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  localStorage.setItem('jeet-theme', isDark ? 'dark' : 'light');
});

/* ── 17. PARTICLE CANVAS ── */
const canvas = document.getElementById('particles-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 18000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.4 + 0.1
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark = document.body.classList.contains('dark');

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = isDark
        ? `rgba(199,91,55,${p.opacity})`
        : `rgba(199,91,55,${p.opacity * 0.6})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = isDark
            ? `rgba(199,91,55,${0.12 * (1 - dist / 100)})`
            : `rgba(199,91,55,${0.07 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(drawParticles);
  }

  const heroObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        resizeCanvas();
        createParticles();
        drawParticles();
      } else {
        cancelAnimationFrame(animationId);
      }
    });
  }, { threshold: 0.01 });
  heroObs.observe(document.getElementById('home'));

  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  }, { passive: true });
}
