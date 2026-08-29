<script setup lang="ts">
import { ref, computed } from "vue";
import { components, CATEGORY_LABEL } from "~/data/components";
import { suffixPatternOf, SUFFIX_LABEL, STANDALONE_ID } from "~/data/suffix-pattern";

// Plan P6-T5: category + suffix-pattern filters alongside the existing
// text search. Category comes from each component's own registry entry
// (bin/generate-component-categories, sourced from the canonical HTML
// tag in components/{slug}/AGENTS.md); suffix pattern is derived
// client-side from the slug (data/suffix-pattern.ts). Both dropdowns
// only ever list ids actually present in the catalog, so "All ..."
// plus real, populated options -- no dead choices that would always
// return zero results. Ported from the canonical Svelte reference:
// lily-design-system-svelte-sveltekit-examples/src/routes/components/+page.svelte

const search = ref("");
const categoryFilter = ref("");
const suffixFilter = ref("");

const withSuffix = components.map((c) => ({ ...c, suffix: suffixPatternOf(c.slug) }));

function countBy(items: Record<string, unknown>[], key: string) {
  const counts = new Map<string, number>();
  for (const item of items) {
    const id = item[key] as string;
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return counts;
}

const categoryCounts = countBy(withSuffix, "category");
const suffixCounts = countBy(withSuffix, "suffix");

const categoryOptions = Object.entries(CATEGORY_LABEL)
  .filter(([id]) => categoryCounts.has(id))
  .map(([id, label]) => ({ id, label, count: categoryCounts.get(id) ?? 0 }))
  .sort((a, b) => b.count - a.count);

const suffixOptions = Object.entries(SUFFIX_LABEL)
  .filter(([id]) => suffixCounts.has(id) && id !== STANDALONE_ID)
  .map(([id, label]) => ({ id, label, count: suffixCounts.get(id) ?? 0 }))
  .sort((a, b) => b.count - a.count)
  .concat(
    suffixCounts.has(STANDALONE_ID)
      ? [{ id: STANDALONE_ID, label: SUFFIX_LABEL[STANDALONE_ID], count: suffixCounts.get(STANDALONE_ID) ?? 0 }]
      : []
  );

const filtered = computed(() =>
  withSuffix.filter((c) => {
    const q = search.value.toLowerCase();
    const matchesSearch =
      q === "" ||
      c.name.toLowerCase().includes(q) ||
      c.slug.includes(q) ||
      c.description.toLowerCase().includes(q);
    const matchesCategory = categoryFilter.value === "" || c.category === categoryFilter.value;
    const matchesSuffix = suffixFilter.value === "" || c.suffix === suffixFilter.value;
    return matchesSearch && matchesCategory && matchesSuffix;
  })
);

const hasActiveFilters = computed(() => !!(search.value || categoryFilter.value || suffixFilter.value));

function resetFilters() {
  search.value = "";
  categoryFilter.value = "";
  suffixFilter.value = "";
}
</script>

<template>
  <main class="page-wrapper">
    <h1>Components</h1>
    <p>{{ components.length }} headless components</p>

    <div class="field">
      <label class="label" for="search">Filter components</label>
      <input
        id="search"
        type="search"
        class="search-input"
        placeholder="Search components..."
        v-model="search"
      />
    </div>

    <div class="field">
      <label class="label" for="category-filter">Category</label>
      <select id="category-filter" class="select" v-model="categoryFilter">
        <option value="">All categories ({{ components.length }})</option>
        <option v-for="opt in categoryOptions" :key="opt.id" :value="opt.id">
          {{ opt.label }} ({{ opt.count }})
        </option>
      </select>
    </div>

    <div class="field">
      <label class="label" for="suffix-filter">Suffix pattern</label>
      <select id="suffix-filter" class="select" v-model="suffixFilter">
        <option value="">All suffix patterns ({{ components.length }})</option>
        <option v-for="opt in suffixOptions" :key="opt.id" :value="opt.id">
          {{ opt.label }} ({{ opt.count }})
        </option>
      </select>
    </div>

    <p v-if="hasActiveFilters">
      <button type="button" class="button" @click="resetFilters">Clear filters</button>
    </p>

    <p role="status">{{ filtered.length }} of {{ components.length }} components</p>

    <ul class="component-index-list">
      <li v-for="component in filtered" :key="component.slug" class="component-index-list-item">
        <NuxtLink :to="`/components/${component.slug}`">{{ component.name }}</NuxtLink>
        <span class="component-index-list-item-description">{{ component.description }}</span>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.component-index-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.component-index-list-item {
  border-bottom: 1px solid var(--nhs-color-border, #d8dde0);
  padding: var(--nhs-space-3, 0.75rem) 0;
}

.component-index-list-item a {
  font-weight: 700;
}

.component-index-list-item-description {
  color: var(--nhs-color-secondary, #4c6272);
  margin-inline-start: 0.5rem;
}
</style>
