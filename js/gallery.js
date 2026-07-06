/* ==============================
   IEEE RAS MITS Gwalior - Gallery JavaScript
   ============================== */

(function() {
    'use strict';

    /* ----- Gallery Filter ----- */
    function initGalleryFilter() {
        var filterBtns = document.querySelectorAll('.gallery-filters .filter-btn');
        var galleryItems = document.querySelectorAll('.gallery-item');

        if (!filterBtns.length || !galleryItems.length) return;

        filterBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                // Update active button
                filterBtns.forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');

                var category = this.getAttribute('data-category');

                galleryItems.forEach(function(item) {
                    var itemCategory = item.getAttribute('data-category');
                    if (category === 'all' || itemCategory === category) {
                        item.style.display = '';
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.9)';
                        setTimeout(function() {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.9)';
                        setTimeout(function() {
                            item.style.display = 'none';
                        }, 400);
                    }
                });
            });
        });
    }

    /* ----- Lightbox ----- */
    function initLightbox() {
        var galleryItems = document.querySelectorAll('.gallery-item');
        if (!galleryItems.length) return;

        // Create lightbox DOM
        var lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.id = 'lightbox';
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-label', 'Image lightbox');
        lightbox.innerHTML = 
            '<button class="lightbox-close" aria-label="Close lightbox">&times;</button>' +
            '<button class="lightbox-nav lightbox-prev" aria-label="Previous image">&#8249;</button>' +
            '<div class="lightbox-content">' +
                '<div class="lightbox-image-container" id="lightboxImageContainer"></div>' +
            '</div>' +
            '<button class="lightbox-nav lightbox-next" aria-label="Next image">&#8250;</button>' +
            '<div class="lightbox-counter" id="lightboxCounter"></div>';

        document.body.appendChild(lightbox);

        var closeBtn = lightbox.querySelector('.lightbox-close');
        var prevBtn = lightbox.querySelector('.lightbox-prev');
        var nextBtn = lightbox.querySelector('.lightbox-next');
        var imageContainer = document.getElementById('lightboxImageContainer');
        var counterEl = document.getElementById('lightboxCounter');
        var currentIndex = 0;
        var items = Array.from(galleryItems);

        function openLightbox(index) {
            currentIndex = index;
            updateLightbox();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function updateLightbox() {
            var item = items[currentIndex];
            var placeholder = item.querySelector('.gallery-placeholder');
            var overlay = item.querySelector('.gallery-overlay');
            var title = overlay ? overlay.querySelector('h4') : null;
            var cat = overlay ? overlay.querySelector('.gallery-category') : null;

            // Clone the placeholder appearance for lightbox
            var bgStyle = placeholder ? placeholder.style.background : 'linear-gradient(135deg, #8E1B2E, #6A2C91)';
            var height = placeholder ? placeholder.style.height : '400px';

            imageContainer.innerHTML = 
                '<div style="width:70vw;max-width:800px;height:60vh;border-radius:16px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1rem;' +
                'background:' + bgStyle + ';">' +
                '<p style="color:rgba(255,255,255,0.9);font-size:1.5rem;font-family:Space Grotesk,sans-serif;font-weight:600;">' + (title ? title.textContent : '') + '</p>' +
                '<p style="color:rgba(255,255,255,0.6);font-size:0.9rem;text-transform:uppercase;letter-spacing:2px;">' + (cat ? cat.textContent : '') + '</p>' +
                '</div>';

            counterEl.textContent = (currentIndex + 1) + ' of ' + items.length;
        }

        function navigate(dir) {
            currentIndex = (currentIndex + dir + items.length) % items.length;
            updateLightbox();
        }

        // Bind events
        items.forEach(function(item, index) {
            item.addEventListener('click', function() {
                openLightbox(index);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', function() { navigate(-1); });
        nextBtn.addEventListener('click', function() { navigate(1); });

        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', function(e) {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'ArrowRight') navigate(1);
        });
    }

    /* ----- Initialize ----- */
    function init() {
        initGalleryFilter();
        initLightbox();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
