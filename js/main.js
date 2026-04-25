document.addEventListener('DOMContentLoaded', () => {
  initHamburger();
  initFadeIn();
  initScrollSpy();
  initDarkMode();
  initScrollProgress();
  initBackToTop();
  initProjectFilter();
  initLightbox();
});

function initHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    links.classList.toggle('open');
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      links.classList.remove('open');
    });
  });
}

function initFadeIn() {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }),
    { threshold: 0.12 }
  );

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const navHeight = document.getElementById('navbar')?.offsetHeight ?? 64;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.remove('active'));
          const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    { rootMargin: `-${navHeight}px 0px -60% 0px` }
  );

  sections.forEach(section => observer.observe(section));
}

function initDarkMode() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const initialDark = document.documentElement.getAttribute('data-theme') === 'dark';
  btn.setAttribute('aria-pressed', String(initialDark));

  btn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    btn.setAttribute('aria-pressed', String(next === 'dark'));
  });
}

function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollable = document.body.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    bar.style.width = pct + '%';
    bar.setAttribute('aria-valuenow', Math.round(pct));
  }, { passive: true });
}

function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initLightbox() {
  const imgs = document.querySelectorAll('.detail-card img');
  if (!imgs.length) return;

  const overlay = document.createElement('div');
  overlay.className = 'lb-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Image preview');

  const lbImg = document.createElement('img');
  const closeBtn = document.createElement('button');
  closeBtn.className = 'lb-close';
  closeBtn.setAttribute('aria-label', 'Close preview');
  closeBtn.textContent = '×';

  overlay.append(closeBtn, lbImg);
  document.body.append(overlay);

  const open = (src, alt) => {
    lbImg.src = src;
    lbImg.alt = alt;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const close = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  imgs.forEach(img => img.addEventListener('click', () => open(img.src, img.alt)));
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) close(); });
}

function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      cards.forEach(card => {
        const tags = (card.dataset.tags ?? '').split(' ');
        const matches = filter === 'all' || tags.includes(filter);
        card.style.opacity = matches ? '' : '0';
        card.style.transform = matches ? '' : 'scale(0.95)';
        card.style.pointerEvents = matches ? '' : 'none';
        if (matches) {
          card.removeAttribute('aria-hidden');
        } else {
          card.setAttribute('aria-hidden', 'true');
        }
        if (matches) {
          card.removeAttribute('tabindex');
        } else {
          card.setAttribute('tabindex', '-1');
        }
      });
    });
  });
}
