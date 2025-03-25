<template>
    <div>
      <!-- Animation d'Introduction "Appareil Photo" -->
      <div v-if="showIntro" class="intro-screen">
        <div class="camera-loader">
          <div class="camera-body">
            <div class="camera-lens">
              <div class="aperture-ring"></div>
              <div class="focus-ring"></div>
              <div class="lens-center"></div>
            </div>
          </div>
          <div class="loading-text">Lancelot Carrau</div>
        </div>
      </div>
  
      <!-- Header -->
      <header :class="{ 'scrolled': scrolled }">
        <div class="container">
          <nav class="navbar">
            <a href="#" class="logo">Lancelot Carrau</a>
          </nav>
        </div>
      </header>
  
      <!-- Main Content -->
      <main class="main-content" v-show="!showIntro">
        <div class="container">
          <!-- Gallery Header -->
          <div class="gallery-header">
            <h1 class="gallery-title">PORTFOLIO PHOTOGRAPHIQUE</h1>
            <!-- Filter Buttons -->
            <div class="filter-container">
              <button class="filter-btn"
                      :class="{ active: selectedLocation === 'all' }"
                      @click="filterPhotos('all')">
                  Tous
              </button>
              <button class="filter-btn"
                      :class="{ active: selectedLocation === 'japon' }"
                      @click="filterPhotos('japon')">
                  Japon
              </button>
              <button class="filter-btn"
                      :class="{ active: selectedLocation === 'polynesie' }"
                      @click="filterPhotos('polynesie')">
                  Polynésie
              </button>
              <button class="filter-btn"
                      :class="{ active: selectedLocation === 'france' }"
                      @click="filterPhotos('france')">
                  France
              </button>
              <button class="filter-btn"
                      :class="{ active: selectedLocation === 'italie' }"
                      @click="filterPhotos('italie')">
                  Italie
              </button>
              <button class="filter-btn"
                      :class="{ active: selectedLocation === 'espagne' }"
                      @click="filterPhotos('espagne')">
                  Espagne
              </button>
            </div>
            <!-- Stats -->
            <div class="photo-stats">
              {{ totalPhotos }} photos | {{ filteredPhotos.length }} affichées
            </div>
          </div>
  
          <!-- Gallery -->
          <div class="gallery-container">
            <div v-for="(photo, index) in filteredPhotos"
                 :key="photo.id"
                 class="gallery-item"
                 :class="{ 'loaded': photo.loaded }"
                 :style="{ animationDelay: index * 0.02 + 's' }"
                 @click="openModal(photo, index)"
                 ref="galleryItems">
              <!-- Placeholder avec ratio d'aspect dynamique -->
              <div class="placeholder"
                   :style="{ paddingTop: photo.aspectRatio ? `${(1/photo.aspectRatio)*100}%` : '66.67%' }">
              </div>
              <!-- Utilisation de data-src pour le lazy loading -->
              <img :data-src="photo.src"
                   :alt="categoryNames[photo.category] || photo.category"
                   class="gallery-image"
                   @load="onImageLoad(photo)">
              <div class="gallery-info">
                <p class="gallery-location">{{ categoryNames[photo.category] || photo.category }}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
  
      <!-- Footer -->
      <footer>
        <div class="container">
          <p class="footer-text">© 2025 Lancelot Carrau · Développeur Web & Photographe</p>
        </div>
      </footer>
  
      <!-- Modal Carousel -->
      <div class="modal" :class="{ open: modalOpen }">
        <div class="carousel-container">
          <button class="carousel-arrow carousel-arrow-left" @click="prevPhoto" aria-label="Photo précédente">
            <span class="arrow-icon">&#10094;</span>
          </button>
          <div class="modal-content">
            <button class="modal-close" @click="closeModal">&times;</button>
            <img :src="activePhoto.src" :alt="categoryNames[activePhoto.category] || ''" class="modal-image">
            <div class="modal-info">
              <p class="modal-location">{{ categoryNames[activePhoto.category] || '' }}</p>
            </div>
          </div>
          <button class="carousel-arrow carousel-arrow-right" @click="nextPhoto" aria-label="Photo suivante">
            <span class="arrow-icon">&#10095;</span>
          </button>
        </div>
        <div class="carousel-counter">
          {{ currentPhotoIndex + 1 }} / {{ filteredPhotos.length }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { photos as originalPhotos } from '@/photos/photos.js';
  
  export default {
    name: 'PhotographyPortfolio',
    data() {
      return {
        scrolled: false,
        showIntro: true,
        selectedLocation: 'all',
        modalOpen: false,
        activePhoto: {},
        currentPhotoIndex: 0,
        photos: [],
        categoryNames: {
          'japon': 'Japon',
          'france': 'France',
          'polynesie': 'Polynésie française',
          'italie': 'Italie',
          'espagne': 'Espagne'
        },
        introTimeout: null,
        observers: [], // Stockage des IntersectionObservers
        imagesLoaded: 0, // Compteur d'images chargées
      };
    },
    computed: {
      filteredPhotos() {
        if (this.selectedLocation === 'all') {
          return this.photos;
        } else {
          return this.photos.filter(photo => photo.category === this.selectedLocation);
        }
      },
      totalPhotos() {
        return this.photos.length;
      }
    },
    methods: {
      preparePhotos() {
        let shuffled = [...originalPhotos];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.map(photo => ({
          ...photo,
          loaded: false,
          aspectRatio: photo.aspectRatio || 1.5 // Ratio par défaut (3:2)
        }));
      },
      onImageLoad(photo) {
        photo.loaded = true;
        this.imagesLoaded++;
  
        if (this.$refs.galleryItems) {
          const photoElements = this.$refs.galleryItems.filter(el =>
            el.querySelector('img').getAttribute('data-src') === photo.src
          );
  
          if (photoElements.length > 0) {
            const img = photoElements[0].querySelector('img');
            if (img.naturalWidth && img.naturalHeight) {
              photo.aspectRatio = img.naturalWidth / img.naturalHeight;
            }
          }
        }
      },
      filterPhotos(location) {
        this.selectedLocation = location;
        this.$nextTick(() => {
          this.setupImageObservers();
        });
      },
      openModal(photo, index) {
        this.activePhoto = photo;
        this.currentPhotoIndex = index;
        this.modalOpen = true;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', this.handleKeyDown);
      },
      closeModal() {
        this.modalOpen = false;
        document.body.style.overflow = '';
        document.removeEventListener('keydown', this.handleKeyDown);
      },
      nextPhoto() {
        if (this.filteredPhotos.length <= 1) return;
        this.currentPhotoIndex = (this.currentPhotoIndex + 1) % this.filteredPhotos.length;
        this.activePhoto = this.filteredPhotos[this.currentPhotoIndex];
      },
      prevPhoto() {
        if (this.filteredPhotos.length <= 1) return;
        this.currentPhotoIndex = (this.currentPhotoIndex - 1 + this.filteredPhotos.length) % this.filteredPhotos.length;
        this.activePhoto = this.filteredPhotos[this.currentPhotoIndex];
      },
      handleKeyDown(e) {
        switch (e.key) {
          case 'ArrowRight':
            this.nextPhoto();
            break;
          case 'ArrowLeft':
            this.prevPhoto();
            break;
          case 'Escape':
            this.closeModal();
            break;
        }
      },
      handleScroll() {
        this.scrolled = window.scrollY > 30;
      },
      startIntro() {
        this.photos = this.preparePhotos();
        this.introTimeout = setTimeout(() => {
          this.showIntro = false;
        }, 4000);
      },
      setupImageObservers() {
          this.$nextTick(() => {
            if (!this.$refs.galleryItems) return;
  
            this.observers.forEach(observer => observer.disconnect());
            this.observers = [];
  
            const options = {
              root: null,
              rootMargin: '200px 0px',
              threshold: 0.01
            };
  
            this.$refs.galleryItems.forEach((item, index) => {
              const img = item.querySelector('img');
              const photo = this.filteredPhotos[index];
  
              if (photo.loaded) return;
  
              const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                  if (entry.isIntersecting) {
                    const src = img.getAttribute('data-src');
                    if (src) {
                      img.setAttribute('src', src);
  
                      const preloadImg = new Image();
                      preloadImg.src = src;
  
                      observer.unobserve(item);
                    }
                  }
                });
              }, options);
  
              observer.observe(item);
              this.observers.push(observer);
            });
          });
        },
    },
    watch: {
      filteredPhotos() {
        this.setupImageObservers();
      }
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll);
      this.startIntro();
      setTimeout(() => {
        this.setupImageObservers();
      }, 4100);
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.handleScroll);
      document.removeEventListener('keydown', this.handleKeyDown);
      this.observers.forEach(observer => observer.disconnect());
      if (this.introTimeout) {
        clearTimeout(this.introTimeout);
      }
    }
  };
  </script>
  
  <style scoped>
  /* Variables */
  :root {
    --dark-gray: #121212;
    --medium-gray: #2a2a2a;
    --light-gray: #f5f5f5;
    --accent-gray: #888888;
  }
  
  /* Reset & General Styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  /* Intro Animation */
  .intro-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--dark-gray);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeOutIntro 0.8s ease-out forwards 3.5s;
  }
  
  @keyframes fadeOutIntro {
    from { opacity: 1; }
    to { opacity: 0; visibility: hidden; }
  }
  
  .camera-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .camera-body {
    width: 160px;
    height: 160px;
    background-color: #333;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(0, 0, 0, 0.5);
    position: relative;
    border: 5px solid #222;
    animation: pulse 2s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .camera-lens {
    width: 120px;
    height: 120px;
    background-color: #111;
    border-radius: 50%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  
  .aperture-ring {
    position: absolute;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 3px dashed rgba(255, 255, 255, 0.3);
    animation: rotate 8s linear infinite;
  }
  
  .focus-ring {
    position: absolute;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.2);
    animation: rotate 5s linear infinite reverse;
  }
  
  .lens-center {
    width: 30px;
    height: 30px;
    background-color: #000;
    border-radius: 50%;
    position: relative;
  }
  
  .lens-center::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
  
  .loading-text {
    margin-top: 30px;
    color: #f5f5f5;
    font-size: 1.4rem;
    font-weight: 200;
    letter-spacing: 3px;
    opacity: 0;
    animation: fadeIn 1.5s ease forwards 0.5s;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Photo Stats */
  .photo-stats {
    color: var(--accent-gray);
    font-size: 0.9rem;
    margin-top: -20px;
    margin-bottom: 30px;
  }
  
  /* Header */
  header {
    padding: 30px 0;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 100;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 80%, rgba(0, 0, 0, 0) 100%);
    transition: all 0.3s ease;
  }
  
  header.scrolled {
    background: rgba(0, 0, 0, 0.95);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
  
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logo {
    font-size: 1.8rem;
    color: white;
    text-decoration: none;
    font-weight: 200;
    letter-spacing: 2px;
  }
  
  /* Main Content */
  .main-content {
    padding-top: 120px;
    min-height: 100vh;
  }
  
  /* Gallery Header */
  .gallery-header {
    text-align: center;
    margin-bottom: 50px;
  }
  
  .gallery-title {
    font-size: 2rem;
    font-weight: 300;
    letter-spacing: 4px;
    margin-bottom: 30px;
  }
  
  .filter-container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 15px;
    margin: 20px 0 40px;
  }
  
  .filter-btn {
    padding: 8px 20px;
    background-color: transparent;
    border: 1px solid var(--accent-gray);
    color: var(--accent-gray);
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    font-weight: 300;
    letter-spacing: 1px;
  }
  
  .filter-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .filter-btn.active {
    background: var(--light-gray);
    color: var(--dark-gray);
    border-color: var(--light-gray);
    font-weight: 400;
  }
  
  /* Gallery */
  .gallery-container {
    column-count: 3;
    column-gap: 15px;
    padding-bottom: 80px;
      will-change: transform; /* Optimisation des performances */
  
  }
  
  @media (max-width: 1200px) {
    .gallery-container {
      column-count: 3;
    }
  }
  
  @media (max-width: 900px) {
    .gallery-container {
      column-count: 2;
    }
  }
  
  @media (max-width: 600px) {
    .gallery-container {
      column-count: 1;
    }
  }
  
  .gallery-item {
    break-inside: avoid;
    margin-bottom: 15px;
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    background-color: var(--medium-gray);
    cursor: pointer;
    animation: appearItem 0.5s forwards;
    opacity: 0;
    transform: translateY(0);
    transition: transform 0.4s cubic-bezier(0.215, 0.610, 0.355, 1);
  }
  
  .gallery-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }
  
  .placeholder {
    width: 100%;
    background-color: var(--medium-gray);
    position: relative;
  }
  
  .placeholder::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    animation: shimmer 1.5s infinite;
    transform: translateX(-100%);
  }
  
  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
  
  .gallery-item.loaded .placeholder::after {
    animation: none;
  }
  
  .gallery-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.5s ease, transform 0.8s ease;
  }
  
  .gallery-item.loaded img {
    opacity: 1;
  }
  
  .gallery-item:hover img {
    transform: scale(1.05);
  }
  
  @keyframes appearItem {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .gallery-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s ease;
  }
  
  .gallery-item:hover .gallery-info {
    opacity: 1;
    transform: translateY(0);
  }
  
  .gallery-location {
    font-size: 0.9rem;
    font-weight: 300;
    color: #f5f5f5;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
  }
  
  /* Footer */
  footer {
    padding: 30px 0;
    text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  }
  
  .footer-text {
    font-weight: 200;
    font-size: 0.9rem;
    color: var(--accent-gray);
  }
  
  /* Modal Carousel */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.95);
    z-index: 200;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }
  
  .modal.open {
    opacity: 1;
    visibility: visible;
  }
  
  .carousel-container {
    position: relative;
    width: 100%;
    height: 85vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .carousel-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.1);
    border: none;
    color: #fff;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 210;
  }
  
  .carousel-arrow:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  .carousel-arrow-left {
    left: 20px;
  }
  
  .carousel-arrow-right {
    right: 20px;
  }
  
  .arrow-icon {
    line-height: 1;
  }
  
  .modal-content {
    position: relative;
    max-height: 85vh;
    max-width: 85vw;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .modal-image {
    max-height: 85vh;
    max-width: 85vw;
    object-fit: contain;
  }
  
  .modal-close {
    position: absolute;
    top: -40px;
    right: -40px;
    width: 40px;
    height: 40px;
    color: white;
    background: transparent;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 220;
  }
  
  .modal-info {
    position: absolute;
      bottom: -40px;
    left: 0;
    color: white;
  }
  
  .modal-location {
    font-weight: 300;
    color: #cccccc;
    font-size: 1rem;
  }
  
  .carousel-counter {
    position: absolute;
    bottom: 20px;
    color: var(--accent-gray);
    font-size: 0.9rem;
  }
  
  /* Responsive Carousel */
  @media (max-width: 768px) {
    .carousel-arrow {
      width: 40px;
      height: 40px;
      font-size: 1.2rem;
    }
  
    .carousel-arrow-left {
      left: 10px;
    }
  
    .carousel-arrow-right {
      right: 10px;
    }
  
    .modal-close {
      top: -40px;
      right: 0;
    }
  }
  </style>