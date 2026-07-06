/* ==============================
   IEEE RAS MITS Gwalior - Counter Animation
   ============================== */

(function() {
    'use strict';

    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    function animateCounter(element) {
        var target = parseInt(element.getAttribute('data-count'), 10);
        if (isNaN(target)) {
            target = parseInt(element.textContent, 10);
        }
        if (isNaN(target)) return;

        var suffix = element.getAttribute('data-suffix') || '';
        var duration = 2000;
        var start = null;

        element.textContent = '0' + suffix;

        function step(timestamp) {
            if (!start) start = timestamp;
            var elapsed = timestamp - start;
            var progress = Math.min(elapsed / duration, 1);
            var easedProgress = easeOutQuart(progress);
            var current = Math.floor(easedProgress * target);

            element.textContent = formatNumber(current) + suffix;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.textContent = formatNumber(target) + suffix;
            }
        }

        requestAnimationFrame(step);
    }

    function formatNumber(num) {
        if (num >= 1000) {
            return num.toLocaleString();
        }
        return num.toString();
    }

    function initCounters() {
        var counters = document.querySelectorAll('.counter, [data-count]');
        if (!counters.length) return;

        if (!('IntersectionObserver' in window)) {
            counters.forEach(function(counter) {
                animateCounter(counter);
            });
            return;
        }

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3
        });

        counters.forEach(function(counter) {
            observer.observe(counter);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCounters);
    } else {
        initCounters();
    }

})();
