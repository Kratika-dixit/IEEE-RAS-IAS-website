/* =============================================================
   IEEE IAS — MITS Gwalior Student Chapter
   ias.js — interactions, scroll behavior, particles, animations
============================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Init AOS ---------- */
  if (window.AOS) {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60
    });
  }

  /* ---------- Sticky header shadow on scroll ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (window.scrollY > 12) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();



  /* ---------- Duplicate team cards for seamless infinite scroll ---------- */
  const track = document.getElementById('teamTrack');
  if (track) {
    const originalCards = Array.from(track.children);
    originalCards.forEach(card => {
      track.appendChild(card.cloneNode(true));
    });
  }

  /* ---------- GSAP hero entrance ---------- */
  if (window.gsap) {
    gsap.from('.hero-copy .badge', { opacity: 0, y: 20, duration: 0.7, delay: 0.1 });
    gsap.from('.hero-title', { opacity: 0, y: 26, duration: 0.8, delay: 0.2 });
    gsap.from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.8, delay: 0.35 });
    gsap.from('.hero-actions', { opacity: 0, y: 20, duration: 0.8, delay: 0.5 });
    gsap.from('.hero-visual', { opacity: 0, scale: 0.92, duration: 1, delay: 0.3, ease: 'power2.out' });
  }

  /* ---------- Lightweight ambient particle field ---------- */
  const canvas = document.getElementById('particles');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;
    const COLORS = ['rgba(0,132,61,0.35)', 'rgba(0,166,81,0.30)', 'rgba(0,90,43,0.28)'];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function createParticles() {
      const count = Math.min(60, Math.floor((width * height) / 24000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 0.6,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      }));
    }

    function tick() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      requestAnimationFrame(tick);
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      resize();
      createParticles();
      tick();
      window.addEventListener('resize', () => {
        resize();
        createParticles();
      });
    }
  }

  /* ---------- Set current year in footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
