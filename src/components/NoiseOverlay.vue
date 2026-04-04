<template>
  <div class="noise-overlay" aria-hidden="true"></div>
</template>

<style scoped>
.noise-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: -1; /* Placed behind the dau-card but above the HTML background */
  /* Increased frequency and scaled down tile for denser, sharper noise to match dau.lt style */
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  background-size: 100px;
  background-repeat: repeat;
  /* Heavily increased opacity to match the highly visible grit on dau.lt */
  opacity: 0.45;
  /* Switched to color-burn to interact more dynamically and grittily with the dark background */
  mix-blend-mode: overlay;
}
</style>
