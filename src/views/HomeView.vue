<script setup>
import { onMounted, ref, computed } from 'vue';
import { photoService } from '@/services/PhotoGalleryService';
import BrokenGrid from '@/components/BrokenGrid.vue';
import Lightbox from '@/components/Lightbox.vue';

const photos = ref([]);
const categories = ref([]);
const selectedCategory = ref('all');
const hoveredCategory = ref(null);
const isLightboxOpen = ref(false);
const lightboxIndex = ref(0);

onMounted(async () => {
  await photoService.loadGallery();
  photos.value = photoService.allPhotos;
  categories.value = photoService.categories;
});

const currentPhotos = computed(() => {
  if (selectedCategory.value === 'all') return photos.value;
  return photos.value.filter(p => p.category === selectedCategory.value);
});

function setCategory(category) {
  selectedCategory.value = category;
}

function openLightbox(index) {
  lightboxIndex.value = index;
  isLightboxOpen.value = true;
}
</script>

<template>
  <main class="home-view">
    <!-- Top outer nav similar to dau.lt -->
    <nav class="top-nav">
      <span class="logo-small">lancelot.</span>
    </nav>

    <!-- Main inner light-gray card -->
    <section class="dau-card">
      <div class="card-intro">
        <div class="header-content">
          <h1 class="logo">Portfolio</h1>
        </div>

        <nav class="category-filter">
          <button
            class="filter-btn"
            :class="{ active: selectedCategory === 'all' }"
            @click="setCategory('all')"
            @mouseenter="hoveredCategory = 'all'"
            @mouseleave="hoveredCategory = null"
          >
            All Works
            <svg viewBox="0 0 120 40" class="hover-circle" :class="{ 'is-drawn': selectedCategory === 'all' || hoveredCategory === 'all' }" preserveAspectRatio="none">
              <path d="M 60 2 C 100 2 115 15 115 20 C 115 35 15 38 10 20 C 5 10 20 5 60 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>
          <button
            v-for="(cat, index) in categories"
            :key="cat"
            class="filter-btn"
            :class="{ active: selectedCategory === cat }"
            @click="setCategory(cat)"
            @mouseenter="hoveredCategory = cat"
            @mouseleave="hoveredCategory = null"
          >
            {{ cat.charAt(0).toUpperCase() + cat.slice(1) }}
            <svg viewBox="0 0 120 40" class="hover-circle" :class="{ 'is-drawn': selectedCategory === cat || hoveredCategory === cat }" preserveAspectRatio="none">
              <path d="M 60 2 C 100 2 115 15 115 20 C 115 35 15 38 10 20 C 5 10 20 5 60 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>
        </nav>
      </div>

      <div v-if="photos.length === 0" class="loader">
        LOADING...
      </div>

      <BrokenGrid v-else :photos="currentPhotos" class="grid-section" @open-lightbox="openLightbox" />
    </section>

    <Lightbox
      v-model="isLightboxOpen"
      :photos="currentPhotos"
      :initialIndex="lightboxIndex"
    />
  </main>
</template>

<style scoped>
.home-view {
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Top navigation */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--color-bg); /* Inherit outer light color to contrast dark bg */
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 1rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255,255,255,0.2);
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;  opacity: 0;
  animation: fadeIn 1s ease forwards;}
.logo-small {
  font-weight: 700;
}
.contact-small {
  transition: opacity 0.3s;
}
.contact-small:hover {
  opacity: 0.7;
}

/* Inner Light Gray Card */
.dau-card {
  background-color: var(--color-bg);
  border-radius: 12px;
  padding: 4rem 4rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 10;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  /* Initial card slide-up load animation */
  opacity: 0;
  animation: cardLoad 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s forwards;
}

@keyframes cardLoad {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Smooth fade-in for the top nav as well */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--color-bg);
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 1rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255,255,255,0.2);
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  opacity: 0;
  animation: fadeIn 1s ease forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}


.card-intro {
  margin-bottom: 4rem;
}

.intro-heading {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.intro-label {
  font-family: var(--font-body);
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  color: var(--color-border);
}

.intro-line {
  flex-grow: 1;
  border: none;
  border-top: 1px solid #a3a3a3; /* slightly darker line */
  margin: 0;
}

.header-content {
  position: relative;
  margin-bottom: 4rem;
}

.logo {
  font-size: clamp(3rem, 6vw, 5.5rem);
  font-weight: 400;
  letter-spacing: -0.03em;
  color: var(--color-text);
  line-height: 1.1;
  margin: 0;
  /* Cancel the brutalist red to match dau.lt */
}

/* Filter Navigation */
.category-filter {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 2.5rem;
  max-width: 100%;
}

.filter-btn {
  background: transparent;
  border: none;
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 1.1rem;
  font-weight: 400;
  cursor: pointer;
  position: relative;
  padding: 0 0 0.5rem 0;
  transition: opacity 0.3s;
}

.filter-btn:hover {
  opacity: 0.6;
}

.filter-btn.active {
  font-weight: 500;
  opacity: 1;
}

.hover-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 200%;
  color: var(--color-text);
  pointer-events: none;
}

.hover-circle path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  transition: stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-circle.is-drawn path {
  stroke-dashoffset: 0;
}

.loader {
  font-family: var(--font-body);
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 2rem;
  opacity: 0.5;
}

@media (max-width: 768px) {
  .dau-card {
    padding: 2rem;
  }
}
</style>
