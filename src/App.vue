<script setup>
import { RouterView } from 'vue-router'
import NoiseOverlay from '@/components/NoiseOverlay.vue'
</script>

<template>
  <div id="app">
    <noise-overlay />
    <router-view />
  </div>
</template>

<style>
/* Styles globaux */
#app {
  min-height: 100vh;
}
</style>