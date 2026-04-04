<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  photos: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['image-loaded', 'open-lightbox']);

const gridRef = ref(null);
const loadedImages = ref(new Set());

// Reset loaded state when photos completely change (e.g. initial load)
watch(() => props.photos, () => {
  // We don't reset the whole set here because we want cached images to stay 'loaded' across category swaps
}, { deep: true });

function handleImageLoad(id) {
  loadedImages.value.add(id);
  emit('image-loaded', id);
}

function handleImageClick(index) {
  emit('open-lightbox', index);
}

function getRandomHeight(id) {
  // Deterministic random height based on id string so layout doesn't jiggle randomly on re-render.
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Generates a height between 250px and 450px for the placeholder
  const base = 250;
  const variance = Math.abs(hash) % 200;
  return `${base + variance}px`;
}
</script>

<template>
  <div class="broken-grid-container">
    <div class="broken-grid" ref="gridRef">
      <article
        v-for="(photo, index) in photos"
        :key="photo.id"
        class="broken-grid-item"
        :class="{ 'is-loading': !loadedImages.has(photo.id) }"
      >
        <figure class="photo-figure" :style="{ minHeight: !loadedImages.has(photo.id) ? getRandomHeight(photo.id) : 'auto' }">
          <div class="skeleton-loaders" v-if="!loadedImages.has(photo.id)"></div>
          <img
            :src="photo.src"
            :alt="`Photo ${photo.id}`"
            loading="lazy"
            :class="{ 'img-loaded': loadedImages.has(photo.id) }"
            @load="handleImageLoad(photo.id)"
            @click="handleImageClick(index)"
          />
        </figure>
      </article>
    </div>
  </div>
</template>

<style scoped>
.broken-grid-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.broken-grid {
  /* True masonry */
  column-count: 3;
  column-gap: var(--grid-gap);
  width: 100%;
}

.broken-grid-item {
  display: inline-block;
  width: 100%;
  break-inside: avoid;
  margin-bottom: var(--grid-gap);
  /* Removed animations because they can fail unpredictably across browsers or cause layout pop-in glitches on reload */
  opacity: 1;
}

.photo-figure {
  width: 100%;
  position: relative;
  overflow: hidden;
  margin: 0;
  line-height: 0;
  background-color: var(--color-border);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease, min-height 0.3s ease;
}

.photo-figure:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
}

.skeleton-loaders {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, #d4d4d4 25%, #e8e8e8 50%, #d4d4d4 75%);
  background-size: 400% 100%;
  animation: loadingShimmer 1.5s infinite linear;
  z-index: 1;
}

@keyframes loadingShimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.photo-figure img {
  width: 100%;
  height: auto;
  display: block;
  cursor: pointer;
  filter: grayscale(100%) contrast(1.1); /* Black and white default */
  opacity: 0;
  transition: filter 0.4s ease, opacity 0.5s ease;
  position: relative;
  z-index: 2;
}

.photo-figure img.img-loaded {
  opacity: 1;
}

.photo-figure img:hover {
  filter: grayscale(0%) contrast(1); /* Color on hover */
}

@media (max-width: 1024px) {
  .broken-grid {
    column-count: 2;
  }
}

@media (max-width: 768px) {
  .broken-grid {
    column-count: 1;
  }
}
</style>
