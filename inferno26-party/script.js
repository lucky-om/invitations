(function () {
  'use strict';

  /* ─────────────────────────────────────────────────
     SPLASH + MUSIC
  ───────────────────────────────────────────────── */
  function initSplash() {
    var splash = document.getElementById('splash');
    var audio  = document.getElementById('bg-music');
    var pill   = document.getElementById('music-pill');

    // Hide the music pill while splash is showing
    if (pill) pill.style.display = 'none';

    if (!splash) {
      // No splash — just try to play
      if (audio) { audio.volume = 0.42; audio.play().catch(function(){}); }
      return;
    }

    function enter() {
      // Visual tap flash
      splash.classList.add('tapped');

      // Fade out splash
      setTimeout(function () {
        splash.classList.add('out');
        // Remove from DOM after transition
        splash.addEventListener('transitionend', function () {
          splash.remove();
          // Show pill only if music somehow didn't start
          if (audio && audio.paused && pill) {
            pill.style.display = '';
            setTimeout(function(){ pill.classList.add('show'); }, 300);
          }
        }, { once: true });
      }, 160);

      // Play music 
      if (audio) {
        audio.volume = 0.42;
        audio.play().catch(function(){});
      }
    }

    splash.addEventListener('click', enter, { once: true });

    // Pill toggle after splash gone
    if (pill) {
      pill.addEventListener('click', function () {
        if (!audio) return;
        if (audio.paused) {
          audio.play().catch(function(){});
          pill.classList.remove('show'); pill.classList.add('gone');
        } else {
          audio.pause();
          pill.querySelector('span') && (pill.querySelector('span').textContent = '🔇');
        }
      });
    }
  }

  /* ─────────────────────────────────────────────────
     PARTICLES
  ───────────────────────────────────────────────── */
  function initParticles() {
    var wrap = document.getElementById('particles');
    if (!wrap) return;

    var mobile = window.innerWidth < 480;
    var total  = mobile ? 12 : 26;
    var twinks = mobile ? 7  : 16;

    for (var i = 0; i < total; i++) {
      var p = document.createElement('div');
      p.className = Math.random() > .7 ? 'particle star' : 'particle';
      var sz = p.className.includes('star')
        ? Math.random() * 6 + 4
        : Math.random() * 3 + 1.5;
      p.style.cssText = [
        'width:' + sz + 'px', 'height:' + sz + 'px',
        'left:' + (Math.random() * 100) + '%',
        'animation-duration:' + (Math.random() * 16 + 10) + 's',
        'animation-delay:' + (Math.random() * 14) + 's'
      ].join(';');
      wrap.appendChild(p);
    }

    for (var j = 0; j < twinks; j++) {
      var t = document.createElement('div');
      t.className = 'particle twinkle';
      var ts = Math.random() * 2 + 1;
      t.style.cssText = [
        'width:' + ts + 'px', 'height:' + ts + 'px',
        'left:' + (Math.random() * 100) + '%',
        'top:'  + (Math.random() * 100) + '%',
        'animation-duration:' + (Math.random() * 3 + 1.5) + 's',
        'animation-delay:' + (Math.random() * 5) + 's'
      ].join(';');
      wrap.appendChild(t);
    }
  }

  /* ─────────────────────────────────────────────────
     COUNTDOWN
  ───────────────────────────────────────────────── */
  function initCountdown() {
    var TARGET = new Date('2026-05-11T18:00:00');
    var els = {
      d: document.getElementById('cd-d'),
      h: document.getElementById('cd-h'),
      m: document.getElementById('cd-m'),
      s: document.getElementById('cd-s')
    };
    if (!els.d) return;

    function pad(n) { return String(n).padStart(2, '0'); }

    function flip(el, val) {
      if (!el || el.textContent === val) return;
      el.classList.remove('flip');
      void el.offsetWidth;
      el.classList.add('flip');
      el.textContent = val;
    }

    function tick() {
      var diff = TARGET - new Date();
      if (diff <= 0) {
        ['d','h','m','s'].forEach(function(k){ if(els[k]) els[k].textContent='00'; });
        var lbl = document.querySelector('.section-label');
        if (lbl) lbl.textContent = '🎉 The Party Has Started!';
        return;
      }
      flip(els.d, pad(Math.floor(diff / 86400000)));
      flip(els.h, pad(Math.floor((diff % 86400000) / 3600000)));
      flip(els.m, pad(Math.floor((diff % 3600000) / 60000)));
      flip(els.s, pad(Math.floor((diff % 60000) / 1000)));
      setTimeout(tick, 1000);
    }
    tick();
  }

  /* ─────────────────────────────────────────────────
     CONFETTI
  ───────────────────────────────────────────────── */
  function launchConfetti() {
    var cv = document.getElementById('confetti-canvas');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    cv.width  = window.innerWidth;
    cv.height = window.innerHeight;

    var COLORS = ['#c8a96e','#e8c98e','#f0ede6','#3d6651','#f5dfa0','#fff'];
    var N = window.innerWidth < 600 ? 65 : 130;
    var pieces = [];
    for (var i = 0; i < N; i++) {
      pieces.push({
        x: Math.random() * cv.width,
        y: -10 - Math.random() * 80,
        r: Math.random() * 6 + 2,
        d: Math.random() * N,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
        ta: 0, ti: Math.random() * .07 + .04,
        vx: Math.random() * 1.8 - .9,
        vy: Math.random() * 2.4 + 1.1,
        alpha: 1
      });
    }

    function draw() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      var alive = false;
      pieces.forEach(function (p) {
        p.ta += p.ti; p.x += p.vx + Math.sin(p.d) * .4;
        p.y += p.vy; p.alpha -= .0042;
        if (p.alpha > 0) alive = true;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.ellipse(p.x + Math.sin(p.ta) * 8, p.y, p.r, p.r / 2, p.ta, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (alive) requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, cv.width, cv.height);
    }
    draw();
  }

  /* ─────────────────────────────────────────────────
     SCROLL REVEAL
  ───────────────────────────────────────────────── */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: .12 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ─────────────────────────────────────────────────
     RESIZE
  ───────────────────────────────────────────────── */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var w = document.getElementById('particles');
      if (w) { w.innerHTML = ''; initParticles(); }
      var cv = document.getElementById('confetti-canvas');
      if (cv) { cv.width = window.innerWidth; cv.height = window.innerHeight; }
    }, 250);
  });

  /* ─────────────────────────────────────────────────
     SECURITY (Anti-Theft)
  ───────────────────────────────────────────────── */
  function initSecurity() {
    document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    document.addEventListener('dragstart', function (e) {
      if (!e.target.closest('.map-wrap')) e.preventDefault();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'F12' || 
         (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || 
         (e.ctrlKey && (e.key === 'U' || e.key === 'S' || e.key === 'P')) ||
         (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
         (e.metaKey && (e.key === 'U' || e.key === 'S' || e.key === 'P'))) {
        e.preventDefault();
      }
    });
  }

  /* ─────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initSecurity();
    initSplash();
    initParticles();
    initCountdown();
    initReveal();
    setTimeout(launchConfetti, 1100);
  });

})();
