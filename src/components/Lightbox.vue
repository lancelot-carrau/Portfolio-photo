<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  photos: {
    type: Array,
    required: true
  },
  modelValue: {
    type: Boolean,
    default: false
  },
  initialIndex: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['update:modelValue']);

const currentIndex = ref(props.initialIndex);

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    currentIndex.value = props.initialIndex;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  } else {
    document.body.style.overflow = '';
  }
});

const closeLightbox = () => {
  emit('update:modelValue', false);
};

const nextPhoto = () => {
  if (currentIndex.value < props.photos.length - 1) {
    currentIndex.value++;
  } else {
    currentIndex.value = 0; // Loop around
  }
};

const prevPhoto = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  } else {
    currentIndex.value = props.photos.length - 1; // Loop around
  }
};

const handleKeydown = (e) => {
  if (!props.modelValue) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextPhoto();
  if (e.key === 'ArrowLeft') prevPhoto();
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="lightbox" @click="closeLightbox">
        <button class="close-btn" @click.stop="closeLightbox">×</button>

        <button class="nav-btn prev-btn" @click.stop="prevPhoto" v-if="photos.length > 1">
          &#8592;
        </button>

        <div class="image-container" @click.stop>
          <img
            v-if="photos[currentIndex]"
            :src="photos[currentIndex].src"
            :alt="photos[currentIndex].id"
            class="lightbox-img"
          />
        </div>

        <button class="nav-btn next-btn" @click.stop="nextPhoto" v-if="photos.length > 1">
          &#8594;
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100000; /* Above everything including noise */
}

.image-container {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.lightbox-img {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: white;
  font-size: 3rem;
  cursor: pointer;
  padding: 1rem;
  z-index: 2;
  transition: opacity 0.3s;
  opacity: 0.5;
}

.nav-btn:hover {
  opacity: 1;
}

.prev-btn {
  left: 2rem;
}

.next-btn {
  right: 2rem;
}

.close-btn {
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: transparent;
  border: none;
  color: white;
  font-size: 4rem;
  cursor: pointer;
  line-height: 0.5;
  z-index: 2;
  opacity: 0.5;
  transition: opacity 0.3s;
}

.close-btn:hover {
  opacity: 1;
}

/* Vue Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .nav-btn {
    font-size: 2rem;
    padding: 0.5rem;
  }
  .prev-btn { left: 0.5rem; }
  .next-btn { right: 0.5rem; }
  .image-container { max-width: 95vw; }
}
</style>