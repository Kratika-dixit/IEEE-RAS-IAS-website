/* ==============================
   IEEE RAS MITS Gwalior - Main JavaScript
   ============================== */

(function() {
    'use strict';

    /* ----- Page Loader ----- */
    function initPageLoader() {
        const loader = document.getElementById('pageLoader');
        if (!loader) return;
        window.addEventListener('load', function() {
            setTimeout(function() {
                loader.classList.add('loaded');
                setTimeout(function() {
                    loader.remove();
                }, 500);
            }, 300);
        });
    }

    /* ----- Navbar Scroll Effect ----- */
    function initNavbar() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        let lastScroll = 0;
        function handleScroll() {
            const currentScroll = window.scrollY;
            if (currentScroll > 80) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            lastScroll = currentScroll;
        }

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    /* ----- Mobile Navigation ----- */
    function initMobileNav() {
        const toggle = document.getElementById('navToggle');
        const menu = document.getElementById('navMenu');
        if (!toggle || !menu) return;

        toggle.addEventListener('click', function() {
            const isActive = menu.classList.toggle('active');
            toggle.classList.toggle('active');
            toggle.setAttribute('aria-expanded', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        // Close on nav link click
        const navLinks = menu.querySelectorAll('.nav-link');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                menu.classList.remove('active');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Close on outside click
        document.addEventListener('click', function(e) {
            if (menu.classList.contains('active') && !menu.contains(e.target) && !toggle.contains(e.target)) {
                menu.classList.remove('active');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });

        // Close on Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                menu.classList.remove('active');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    /* ----- Smooth Scrolling ----- */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const navHeight = 80;
                    const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
                    window.scrollTo({ top: targetPos, behavior: 'smooth' });
                }
            });
        });
    }

    /* ----- Active Nav Link by Page ----- */
    function initActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(function(link) {
            link.classList.remove('active');
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    /* ----- Intersection Observer Animations ----- */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll, .animate-slide-left, .animate-slide-right, .animate-scale');
        if (!animatedElements.length) return;

        if (!('IntersectionObserver' in window)) {
            animatedElements.forEach(function(el) { el.classList.add('animated'); });
            return;
        }

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(function(el) {
            observer.observe(el);
        });
    }

    /* ----- Hero Canvas Particles ----- */
    function initHeroParticles() {
        const canvas = document.getElementById('heroCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationId;
        let particles = [];

        function resize() {
            const hero = canvas.closest('.hero');
            if (!hero) return;
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        }

        function createParticles() {
            particles = [];
            const count = Math.min(Math.floor(canvas.width / 25), 50);
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    radius: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.3 + 0.1
                });
            }
        }

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        const alpha = (1 - dist / 150) * 0.08;
                        ctx.beginPath();
                        ctx.strokeStyle = 'rgba(142, 27, 46, ' + alpha + ')';
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw particles
            particles.forEach(function(p) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(142, 27, 46, ' + p.opacity + ')';
                ctx.fill();
            });

            // Update positions
            particles.forEach(function(p) {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            });

            animationId = requestAnimationFrame(drawParticles);
        }

        resize();
        createParticles();
        drawParticles();

        window.addEventListener('resize', function() {
            resize();
            createParticles();
        });
    }

    /* ----- Back to Top ----- */
    function initBackToTop() {
        const btn = document.getElementById('backToTop');
        if (!btn) return;

        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        }, { passive: true });

        btn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ----- Contact Form ----- */
    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Basic validation
            const name = form.querySelector('#name');
            const email = form.querySelector('#email');
            const message = form.querySelector('#message');

            if (!name || !email || !message) return;

            if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            if (!isValidEmail(email.value)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Show success
            showNotification('Thank you! Your message has been sent successfully.', 'success');
            form.reset();

            // Also show inline success
            const successEl = form.querySelector('.form-success');
            if (successEl) {
                successEl.classList.add('show');
                setTimeout(function() {
                    successEl.classList.remove('show');
                }, 5000);
            }
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showNotification(message, type) {
        // Remove existing
        var existing = document.querySelector('.notification');
        if (existing) existing.remove();

        var notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        if (type === 'error') {
            notification.style.borderLeftColor = '#EF4444';
        } else {
            notification.style.borderLeftColor = '#10B981';
        }
        document.body.appendChild(notification);

        // Trigger animation
        requestAnimationFrame(function() {
            notification.classList.add('show');
        });

        setTimeout(function() {
            notification.classList.remove('show');
            setTimeout(function() {
                notification.remove();
            }, 300);
        }, 4000);
    }

    /* ----- Event Search & Filter ----- */
    function initEventFilter() {
        const searchInput = document.getElementById('eventSearch');
        const filterBtns = document.querySelectorAll('.filter-btn[data-category]');
        const eventCards = document.querySelectorAll('.event-card');

        if (!eventCards.length) return;

        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const query = this.value.toLowerCase().trim();
                eventCards.forEach(function(card) {
                    const text = card.textContent.toLowerCase();
                    const match = !query || text.includes(query);
                    card.style.display = match ? '' : 'none';
                    card.style.opacity = match ? '1' : '0';
                });
            });
        }

        if (filterBtns.length) {
            filterBtns.forEach(function(btn) {
                btn.addEventListener('click', function() {
                    filterBtns.forEach(function(b) { b.classList.remove('active'); });
                    this.classList.add('active');

                    const category = this.getAttribute('data-category');
                    eventCards.forEach(function(card) {
                        if (category === 'all' || card.getAttribute('data-category') === category) {
                            card.style.display = '';
                            card.style.opacity = '1';
                        } else {
                            card.style.display = 'none';
                            card.style.opacity = '0';
                        }
                    });
                });
            });
        }
    }

    /* ----- Lazy Loading ----- */
    function initLazyLoading() {
        var lazyImages = document.querySelectorAll('img[data-src]');
        if (!lazyImages.length) return;

        if ('IntersectionObserver' in window) {
            var imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        var img = entry.target;
                        img.src = img.getAttribute('data-src');
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            }, { rootMargin: '50px' });

            lazyImages.forEach(function(img) {
                imageObserver.observe(img);
            });
        } else {
            lazyImages.forEach(function(img) {
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
            });
        }
    }

    /* ----- Initialize Everything ----- */
    function init() {
        initPageLoader();
        initNavbar();
        initMobileNav();
        initSmoothScroll();
        initActiveNavLink();
        initScrollAnimations();
        initHeroParticles();
        initBackToTop();
        initContactForm();
        initEventFilter();
        initLazyLoading();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
