/* ============================================
   VIDHYA SHEKHAR - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===== STICKY HEADER STACK (ticker + topbar + navbar) =====
  const navbar = document.getElementById('navbar');
  const topbar = document.querySelector('.topbar');
  const ticker = document.querySelector('.hire-bar, .fraud-ticker');
  let topbarH = topbar ? topbar.offsetHeight : 0;
  let tickerH = ticker ? ticker.offsetHeight : 0;

  function layoutStickyStack() {
    topbarH = topbar ? topbar.offsetHeight : 0;
    tickerH = ticker ? ticker.offsetHeight : 0;
    if (topbar) topbar.style.top = tickerH + 'px';
    navbar.style.top = (tickerH + topbarH) + 'px';
    document.body.style.paddingTop = (tickerH + topbarH) + 'px';
  }

  function handleScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }

  layoutStickyStack();
  // Re-measure after fonts load (changes header height on first paint)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(layoutStickyStack);
  }
  window.addEventListener('resize', layoutStickyStack);
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

  function activateTab(tabKey) {
    if (!tabKey) return;
    let matched = false;
    tabs.forEach(t => {
      if (t.dataset.tab === tabKey) {
        t.classList.add('active');
        matched = true;
      } else {
        t.classList.remove('active');
      }
    });
    if (!matched) return;
    panels.forEach(p => {
      p.classList.toggle('active', p.id === 'panel-' + tabKey);
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab.dataset.tab));
  });

  // Honour URL hash on load — e.g. fees.html#nursing opens the Nursing tab
  if (tabs.length && window.location.hash) {
    const hashKey = window.location.hash.replace(/^#/, '');
    if (hashKey) {
      activateTab(hashKey);
      // Smooth-scroll to the tabs after a short delay so layout settles
      setTimeout(() => {
        const el = document.querySelector('.tabs');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 250);
    }
  }
  // React to hash changes (e.g. user clicks another in-page link)
  window.addEventListener('hashchange', () => {
    activateTab(window.location.hash.replace(/^#/, ''));
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

// ===== COOKIE CONSENT BANNER (DPDP Act / GDPR + GA4 Consent Mode v2) =====
(function () {
  // If user already decided, do nothing
  try { if (localStorage.getItem('vsetConsent')) return; } catch (e) { return; }

  // Determine if we're in /blog/ or root for the privacy.html link
  const prefix = location.pathname.includes('/blog/') ? '../' : '';

  const banner = document.createElement('div');
  banner.id = 'consentBanner';
  banner.className = 'consent-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Cookie consent');
  banner.innerHTML = `
    <div class="consent-text">
      <strong>We use cookies</strong>
      <p>We use cookies to improve your experience and understand how visitors use our site. You can accept or reject analytics cookies at any time. <a href="${prefix}privacy.html">Privacy Policy</a></p>
    </div>
    <div class="consent-actions">
      <button class="consent-btn consent-reject" type="button">Reject</button>
      <button class="consent-btn consent-accept" type="button">Accept</button>
    </div>
  `;
  document.body.appendChild(banner);

  // Slide in after a tiny delay so the transition fires
  setTimeout(() => banner.classList.add('show'), 80);

  function setConsent(choice) {
    try { localStorage.setItem('vsetConsent', choice); } catch (e) {}
    if (choice === 'accepted' && typeof gtag === 'function') {
      gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted'
      });
    }
    banner.classList.remove('show');
    setTimeout(() => banner.remove(), 380);
  }

  banner.querySelector('.consent-accept').addEventListener('click', () => setConsent('accepted'));
  banner.querySelector('.consent-reject').addEventListener('click', () => setConsent('rejected'));
})();

/* ===== BANNER SLIDER ===== */
(function(){
  const slider = document.getElementById('bannerSlider');
  if(!slider) return;
  const track = slider.querySelector('#bslideTrack');
  const slides = Array.from(track.children).filter(n => n.nodeType === 1 && n.tagName === 'A');
  const dotsWrap = slider.querySelector('#bslideDots');
  if(slides.length <= 1){ slider.classList.add('single'); return; }
  let i = 0, timer = null;
  slides.forEach((_, idx) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Go to banner ' + (idx + 1));
    b.addEventListener('click', () => go(idx));
    dotsWrap.appendChild(b);
  });
  const dots = Array.from(dotsWrap.children);
  function render(){ track.style.transform = 'translateX(-' + (i * 100) + '%)'; dots.forEach((d, idx) => d.classList.toggle('active', idx === i)); }
  function go(n){ i = (n + slides.length) % slides.length; render(); restart(); }
  const next = () => go(i + 1), prev = () => go(i - 1);
  slider.querySelector('.bslide-next').addEventListener('click', next);
  slider.querySelector('.bslide-prev').addEventListener('click', prev);
  function start(){ timer = setInterval(next, 5000); }
  function restart(){ clearInterval(timer); start(); }
  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', start);
  let x0 = null;
  track.addEventListener('touchstart', e => x0 = e.touches[0].clientX, { passive:true });
  track.addEventListener('touchend', e => { if(x0===null) return; const dx = e.changedTouches[0].clientX - x0; if(Math.abs(dx) > 40){ dx < 0 ? next() : prev(); } x0 = null; });
  // Click animation → then navigate to the slide's page
  slides.forEach(s => {
    const flash = document.createElement('span');
    flash.className = 'bslide-flash';
    s.appendChild(flash);
    s.addEventListener('click', e => {
      // let new-tab / modifier clicks behave normally
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const href = s.getAttribute('href');
      if (!href) return;
      e.preventDefault();
      if (s.classList.contains('bslide-clicked')) return;
      s.classList.add('bslide-clicked');
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setTimeout(() => { window.location.href = href; }, reduce ? 0 : 300);
    });
  });

  render(); start();
})();
