<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <photography-portfolio />
  </div>
</template>

<script>
import PhotographyPortfolio from '@/components/Portfolio.vue'

export default {
  name: 'App',
  components: {
    PhotographyPortfolio
  }
}
</script>

<style>
/* Styles globaux */
body {
  font-family: 'Poppins', sans-serif;
  color: #f5f5f5;
  background: linear-gradient(145deg, #121212 0%, #000000 100%);
  line-height: 1.6;
  min-height: 100vh;
  margin: 0;
  padding: 0;
}
</style>