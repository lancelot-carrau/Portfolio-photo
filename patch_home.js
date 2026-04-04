const fs = require('fs');

let content = fs.readFileSync('src/views/HomeView.vue', 'utf8');

// 1. Remove email tag
content = content.replace(
  '<a href="mailto:hello@lancelot.fr" class="contact-small">hello@lancelot.fr</a>',
  ''
);

// 2. Change category buttons back to simple text but with a drawn underline
content = content.replace(/<nav class="category-filter">[\s\S]*?<\/nav>/, `<nav class="category-filter">
          <button
            class="filter-btn"
            :class="{ active: selectedCategory === 'all' }"
            @click="setCategory('all')"
          >
            All Works
            <svg viewBox="0 0 100 10" class="underline-draw" preserveAspectRatio="none" v-if="selectedCategory === 'all'">
              <path d="M 0 5 Q 50 8 100 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
          <button
            v-for="(cat, index) in categories"
            :key="cat"
            class="filter-btn"
            :class="{ active: selectedCategory === cat }"
            @click="setCategory(cat)"
          >
            {{ cat.charAt(0).toUpperCase() + cat.slice(1) }}
            <svg viewBox="0 0 100 10" class="underline-draw" preserveAspectRatio="none" v-if="selectedCategory === cat">
              <path d="M 0 5 Q 50 8 100 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
        </nav>`);

// 3. Update CSS for category filter
content = content.replace(/\/\* Filter Navigation \*\/[\s\S]*?\.loader \{/, `/* Filter Navigation */
.category-filter {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 2rem;
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

.underline-draw {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 10px;
  color: var(--color-text);
  pointer-events: none;
}

.draw-animation path, .underline-draw path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: drawLine 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes drawLine {
  to {
    stroke-dashoffset: 0;
  }
}

.loader {`);

fs.writeFileSync('src/views/HomeView.vue', content, 'utf8');
