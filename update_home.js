const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.vue', 'utf8');

// 1. Add hoveredCategory ref
code = code.replace(
  'const lightboxIndex = ref(0);',
  'const lightboxIndex = ref(0);\nconst hoveredCategory = ref(null);'
);

// 2. Remove intro-heading and replace intro text with "Portfolio" (or "Lancelot Carrau")
code = code.replace(
  /<div class="intro-heading">[\s\S]*?<\/div>[\s]*<div class="header-content">/,
  '<div class="header-content">'
);

code = code.replace(
  '<h1 class="logo">Pixel perfect<br>visual experiences</h1>',
  '<h1 class="logo">Lancelot Carrau</h1>'
);

// 3. Update the category filters to use mouse events and a circular highlight.
const navCodeOld = /<nav class="category-filter">[\s\S]*?<\/nav>/;
const navCodeNew = `<nav class="category-filter">
          <button
            class="filter-btn"
            :class="{ active: selectedCategory === 'all' }"
            @click="setCategory('all')"
            @mouseenter="hoveredCategory = 'all'"
            @mouseleave="hoveredCategory = null"
          >
            All Works
            <!-- Ellipse highlight over the text dynamically drawing itself -->
            <svg viewBox="0 0 120 40" class="hover-circle" preserveAspectRatio="none" v-if="selectedCategory === 'all' || hoveredCategory === 'all'">
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
            <svg viewBox="0 0 120 40" class="hover-circle" preserveAspectRatio="none" v-if="selectedCategory === cat || hoveredCategory === cat">
              <path d="M 60 2 C 100 2 115 15 115 20 C 115 35 15 38 10 20 C 5 10 20 5 60 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>
        </nav>`;

code = code.replace(navCodeOld, navCodeNew);

// 4. Transform CSS line for underline-draw to hover-circle
code = code.replace(/\.underline-draw \{[\s\S]*?\}/, `.hover-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 200%;
  color: var(--color-text);
  pointer-events: none;
}`);

code = code.replace('.draw-animation path, .underline-draw path', '.draw-animation path, .hover-circle path');
code = code.replace('.intro-heading', '/* .intro-heading removed */');

fs.writeFileSync('src/views/HomeView.vue', code);
