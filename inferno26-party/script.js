/* ====================================================
   party-invitation.js
   Particles · Countdown · RSVP Toast · Confetti · Scroll Reveal
   ====================================================

   Coded by  : Lucky
   Version   : 2.0 (Enhanced)

   🎂 This is Lucky's Birthday Party!

   This party bash is gifted & hosted by:
     → Krisha   (HOD — Inferno 26)
     → Lucky    (HOD — Inferno 26)
     → Dishank  (HOD — Inferno 26)
     → Devansh  (HOD — Inferno 26)

   HOD crew celebrating Lucky's birthday — real ones! 🔥
   ==================================================== */

(function () {
  'use strict';

  /* -------------------------------------------------- */
  /* 1. FLOATING PARTICLES + TWINKLING STARS            */
  /* -------------------------------------------------- */
  function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const isMobile = window.innerWidth < 480;
    const total = isMobile ? 18 : 32;
    const twinkleCount = isMobile ? 10 : 20;

    // Floating gold/star particles
    for (let i = 0; i < total; i++) {
      const p = document.createElement('div');
      const isStar = Math.random() > .72;
      p.className = isStar ? 'particle star-shape' : 'particle';

      const size = isStar
        ? Math.random() * 6 + 4
        : Math.random() * 3.5 + 1.5;

      const dur = Math.random() * 16 + 10;
      const delay = Math.random() * 14;
      const left = Math.random() * 100;
      const bright = Math.random() * 30 + 70;

      p.style.cssText = [
        `width:${size}px`,
        `height:${size}px`,
        `left:${left}%`,
        `animation-duration:${dur}s`,
        `animation-delay:${delay}s`,
        `opacity:${Math.random() * .3 + .05}`,
        `filter:brightness(${bright}%)`,
      ].join(';');

      container.appendChild(p);
    }

    // Twinkling static stars
    for (let i = 0; i < twinkleCount; i++) {
      const t = document.createElement('div');
      t.className = 'particle twinkle';
      const size = Math.random() * 2.5 + 1;
      const dur = Math.random() * 3 + 1.5;
      const delay = Math.random() * 5;
      t.style.cssText = [
        `width:${size}px`,
        `height:${size}px`,
        `left:${Math.random() * 100}%`,
        `top:${Math.random() * 100}%`,
        `animation-duration:${dur}s`,
        `animation-delay:${delay}s`,
      ].join(';');
      container.appendChild(t);
    }
  }

  /* -------------------------------------------------- */
  /* 2. COUNTDOWN TIMER                                 */
  /* -------------------------------------------------- */
  function initCountdown() {
    // Target: 11 May 2026, 18:00:00 local time
    const TARGET = new Date('2026-05-11T18:00:00');

    const els = {
      d: document.getElementById('cd-d'),
      h: document.getElementById('cd-h'),
      m: document.getElementById('cd-m'),
      s: document.getElementById('cd-s'),
    };

    // Guard — if elements don't exist skip
    if (!els.d) return;

    function pad(n) { return String(n).padStart(2, '0'); }

    function flip(el, newVal) {
      if (el.textContent === newVal) return;
      el.classList.remove('flip');
      void el.offsetWidth;          // force reflow
      el.classList.add('flip');
      el.textContent = newVal;
    }

    function tick() {
      const now = new Date();
      const diff = TARGET - now;

      if (diff <= 0) {
        // Party has started!
        els.d.textContent = '00';
        els.h.textContent = '00';
        els.m.textContent = '00';
        els.s.textContent = '00';

        const wrap = document.querySelector('.countdown-label');
        if (wrap) wrap.textContent = '🎉 The Party Has Started!';
        return;
      }

      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);

      flip(els.d, pad(days));
      flip(els.h, pad(hours));
      flip(els.m, pad(mins));
      flip(els.s, pad(secs));

      setTimeout(tick, 1000);
    }

    tick();
  }

  /* -------------------------------------------------- */
  /* 3. RSVP TOAST                                      */
  /* -------------------------------------------------- */
  function initRSVP() {
    const btnYes = document.getElementById('rsvp-yes');
    const btnNo = document.getElementById('rsvp-no');
    const toast = document.getElementById('rsvp-toast');

    if (!btnYes || !toast) return;

    function showToast(msg) {
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3600);
    }

    btnYes.addEventListener('click', () => {
      showToast('🎉 Yay! See you on 11th May!');
      launchConfetti();
    });

    btnNo.addEventListener('click', () => {
      showToast('💔 We\'ll miss you! Hope to see you next time.');
    });
  }

  /* -------------------------------------------------- */
  /* 4. CONFETTI BURST                                  */
  /* -------------------------------------------------- */
  function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const COLORS = ['#c8a96e', '#e8c98e', '#f0ede6', '#3d6651', '#f5dfa0', '#ffffff'];
    const pieces = [];
    const NUM = window.innerWidth < 600 ? 80 : 160;

    for (let i = 0; i < NUM; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -10 - Math.random() * 100,
        r: Math.random() * 7 + 3,
        d: Math.random() * NUM,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngle: 0,
        tiltInc: Math.random() * .07 + .05,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 3 + 1.5,
        alpha: 1,
      });
    }

    let frame;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      for (const p of pieces) {
        p.tiltAngle += p.tiltInc;
        p.x += p.vx + Math.sin(p.d);
        p.y += p.vy;
        p.tilt = Math.sin(p.tiltAngle) * 12;
        p.alpha -= .004;

        if (p.alpha > 0) alive = true;

        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.ellipse(p.x + p.tilt, p.y, p.r, p.r / 2, p.tiltAngle, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;

      if (alive) {
        frame = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(frame);
      }
    }

    draw();
  }

  /* -------------------------------------------------- */
  /* 5. SCROLL-TRIGGERED REVEAL                         */
  /* -------------------------------------------------- */
  function initScrollReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: .18 });

    items.forEach(el => io.observe(el));
  }

  /* -------------------------------------------------- */
  /* 6. SPARKLE BURST ON CARD TAP (mobile delight)      */
  /* -------------------------------------------------- */
  function initCardSparkle() {
    const card = document.querySelector('.arch-frame');
    if (!card) return;

    card.addEventListener('click', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      createSparkles(card, x, y);
    });
  }

  function createSparkles(parent, cx, cy) {
    const EMOJIS = ['✨','⭐','🌟','💫','🎊'];
    for (let i = 0; i < 7; i++) {
      const s = document.createElement('span');
      s.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      const angle = (i / 7) * Math.PI * 2;
      const dist = 40 + Math.random() * 30;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      Object.assign(s.style, {
        position: 'absolute',
        left: cx + 'px',
        top: cy + 'px',
        fontSize: (Math.random() * 10 + 10) + 'px',
        pointerEvents: 'none',
        zIndex: '10',
        transition: 'transform .6s ease-out, opacity .6s ease-out',
        transform: 'translate(-50%,-50%)',
        opacity: '1',
        lineHeight: '1',
      });
      parent.appendChild(s);
      // Trigger animation next frame
      requestAnimationFrame(() => {
        s.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0)`;
        s.style.opacity = '0';
      });
      setTimeout(() => s.remove(), 650);
    }
  }

  /* -------------------------------------------------- */
  /* 7. RESIZE: re-init particles on orientation change */
  /* -------------------------------------------------- */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const container = document.getElementById('particles');
      if (container) {
        container.innerHTML = '';
        initParticles();
      }
      // resize confetti canvas if active
      const canvas = document.getElementById('confetti-canvas');
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    }, 250);
  });

  /* -------------------------------------------------- */
  /* INIT ALL                                           */
  /* -------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initCountdown();
    initRSVP();
    initScrollReveal();
    initCardSparkle();
    // Fire a small confetti burst on load after a short delay
    setTimeout(() => launchConfetti(), 1200);
  });

})();

/* ====================================================
   End of script
   Coded with ❤️  by Lucky — © 2026
   ==================================================== */
