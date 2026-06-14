import { photos } from './photos.js';

document.addEventListener('DOMContentLoaded', () => {
    /* --------------------------------------
       CUSTOM CURSOR
    -------------------------------------- */
    const cursor = document.getElementById('cursor');
    const interactiveElements = document.querySelectorAll('button, a, .destinations-nav li, .photo-item');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // We can re-bind this when new elements are added
    const bindCursorHover = (elements) => {
        elements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });
    };
    bindCursorHover(interactiveElements);

    /* --------------------------------------
       LANDING PAGE LOGIC
    -------------------------------------- */
    const landingSection = document.getElementById('landing');
    const gallerySection = document.getElementById('gallery-view');
    const destItems = document.querySelectorAll('.destinations-nav li');
    const bgImages = document.querySelectorAll('.bg-image');
    const enterBtn = document.getElementById('enter-gallery');
    
    // Hover over destination changes background
    destItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const dest = item.getAttribute('data-dest');
            bgImages.forEach(bg => {
                if (bg.id === 'bg-' + dest) {
                    bg.classList.add('active');
                } else {
                    bg.classList.remove('active');
                }
            });
        });
        
        item.addEventListener('mouseleave', () => {
            // Optional: revert to default or leave last hovered
            bgImages.forEach(bg => bg.classList.remove('active'));
        });

        item.addEventListener('click', () => {
            const dest = item.getAttribute('data-dest');
            enterGallery(dest);
        });
    });

    enterBtn.addEventListener('click', () => enterGallery('all'));

    function enterGallery(filter) {
        // Fade out landing
        landingSection.style.opacity = '0';
        setTimeout(() => {
            landingSection.classList.add('hidden');
            gallerySection.classList.remove('hidden');
            gallerySection.style.opacity = '1';
            
            // Render gallery
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
            });
            renderGallery(filter);
            window.scrollTo(0, 0);
        }, 1000); // Wait for transition
    }

    /* --------------------------------------
       GALLERY LOGIC
    -------------------------------------- */
    const masonryGrid = document.getElementById('masonry-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const backBtn = document.getElementById('back-to-home');

    backBtn.addEventListener('click', () => {
        gallerySection.style.opacity = '0';
        setTimeout(() => {
            gallerySection.classList.add('hidden');
            landingSection.classList.remove('hidden');
            landingSection.style.opacity = '1';
        }, 1000);
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderGallery(btn.getAttribute('data-filter'));
        });
    });

    let currentPhotos = [];
    let currentPhotoIndex = 0;

    function renderGallery(filter) {
        masonryGrid.innerHTML = ''; // Clear existing
        
        currentPhotos = filter === 'all' 
            ? photos 
            : photos.filter(p => p.category === filter);

        currentPhotos.forEach((photo, index) => {
            const item = document.createElement('div');
            item.className = 'photo-item';
            
            const img = document.createElement('img');
            // Utilize a CDN image proxy to generate a lightweight 600px WebP thumbnail
            img.src = `https://wsrv.nl/?url=${encodeURIComponent(photo.src)}&w=600&output=webp`;
            img.alt = photo.id;
            img.loading = 'lazy'; // For performance
            
            // Once image loads, add loaded class to fade in
            img.onload = () => {
                item.classList.add('loaded');
            };

            const overlay = document.createElement('div');
            overlay.className = 'photo-overlay';
            
            const category = document.createElement('span');
            category.className = 'photo-category';
            category.textContent = photo.category;

            overlay.appendChild(category);
            item.appendChild(img);
            item.appendChild(overlay);

            // Lightbox trigger
            item.addEventListener('click', () => openLightbox(index));

            masonryGrid.appendChild(item);
        });

        // Bind hover to new photo items
        bindCursorHover(masonryGrid.querySelectorAll('.photo-item'));
    }

    /* --------------------------------------
       LIGHTBOX LOGIC
    -------------------------------------- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    function openLightbox(index) {
        currentPhotoIndex = index;
        lightboxImg.src = currentPhotos[index].src;
        lightbox.classList.remove('hidden');
        lightbox.style.opacity = '1';
    }

    function closeLightbox() {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            lightbox.classList.add('hidden');
            lightboxImg.src = '';
        }, 400); // Wait for transition
    }

    function showPrevImage() {
        currentPhotoIndex = (currentPhotoIndex - 1 + currentPhotos.length) % currentPhotos.length;
        lightboxImg.src = currentPhotos[currentPhotoIndex].src;
    }

    function showNextImage() {
        currentPhotoIndex = (currentPhotoIndex + 1) % currentPhotos.length;
        lightboxImg.src = currentPhotos[currentPhotoIndex].src;
    }

    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrevImage();
    });

    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImage();
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('hidden')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    });
});
