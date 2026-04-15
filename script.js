/* ============================================
   VIDHYA SHEKHAR - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===== PRELOADER =====
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader?.classList.add('hide'), 600);
  });
  // Fallback: hide after 3s even if load event doesn't fire
  setTimeout(() => preloader?.classList.add('hide'), 3000);

  // ===== NAVBAR SCROLL =====
  const navbar = document.getElementById('navbar');
  const topbar = document.querySelector('.topbar');
  const ticker = document.querySelector('.fraud-ticker');
  let topbarH = topbar ? topbar.offsetHeight : 0;
  let tickerH = ticker ? ticker.offsetHeight : 0;

  function handleScroll() {
    const y = window.scrollY;
    if (y > topbarH) {
      navbar.classList.add('scrolled');
      navbar.style.top = tickerH + 'px';
    } else {
      navbar.classList.remove('scrolled');
      navbar.style.top = (tickerH + topbarH - y) + 'px';
    }
  }
  // Set initial position
  navbar.style.top = (tickerH + topbarH) + 'px';
  // Recalculate on resize (font-loading shifts can change topbar/ticker height)
  window.addEventListener('resize', () => {
    topbarH = topbar ? topbar.offsetHeight : 0;
    tickerH = ticker ? ticker.offsetHeight : 0;
    handleScroll();
  });
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ===== MOBILE MENU =====
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu on link click
  nav?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ===== ACTIVE NAV LINK ON SCROLL =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ===== HERO ANIMATIONS =====
  const heroEls = document.querySelectorAll('.anim-up');
  setTimeout(() => {
    heroEls.forEach(el => el.classList.add('show'));
  }, 200);

  // ===== SCROLL REVEAL =====
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-l, .reveal-r');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ===== COUNTER ANIMATION =====
  const counters = document.querySelectorAll('[data-count]');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.count);
      const duration = 2000;
      const start = performance.now();

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(target * eased).toLocaleString('en-IN');
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  // ===== TABS (Fees) =====
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      panels.forEach(p => {
        p.classList.remove('active');
        if (p.id === 'panel-' + target) {
          p.classList.add('active');
        }
      });
    });
  });

  // ===== BACK TO TOP =====
  const btt = document.getElementById('btt');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      btt?.classList.add('show');
    } else {
      btt?.classList.remove('show');
    }
  }, { passive: true });

  btt?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPos = target.offsetTop - navHeight - 8;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // ===== FORM HANDLING =====
  const form = document.getElementById('enquiryForm');
  form?.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Submitting...';
    btn.disabled = true;

    // Simulate submission (replace with actual backend)
    setTimeout(() => {
      btn.innerHTML = 'Submitted Successfully!';
      btn.style.background = '#10b981';
      this.reset();
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1500);
  });

  // ===== PARALLAX SUBTLE EFFECT ON HERO =====
  window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-bg');
    if (hero && window.scrollY < window.innerHeight) {
      hero.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    }
  }, { passive: true });

  // ===== ENQUIRY POPUP MODAL =====
  const modal = document.getElementById('enquiryModal');
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');

  function openModal() {
    if (!modal) return; // Guard: if no modal on page, do nothing
    modal.classList.add('active');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal?.classList.remove('active');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Auto-show popup after 12 seconds (only once per session)
  if (modal && !sessionStorage.getItem('popupShown')) {
    setTimeout(() => {
      openModal();
      sessionStorage.setItem('popupShown', 'true');
    }, 12000);
  }

  closeBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // Any "Apply Now" or "enquiry-trigger" button opens the popup.
  // If the modal doesn't exist on this page, let the link navigate normally (don't preventDefault).
  document.querySelectorAll('.enquiry-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (!modal) return; // no modal on this page — let href navigate
      e.preventDefault();
      openModal();
    });
  });

  // Popup form submit
  const popupForm = document.getElementById('popupForm');
  popupForm?.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    btn.textContent = 'Submitting...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Thank you!';
      btn.style.background = '#10b981';
      this.reset();
      setTimeout(() => { closeModal(); btn.textContent = 'Submit Enquiry'; btn.style.background = ''; btn.disabled = false; }, 2000);
    }, 1500);
  });

});
