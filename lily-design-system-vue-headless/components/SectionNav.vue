<script setup lang="ts">
  withDefaults(defineProps<{
    label?: string;
  }>(), {
    label: undefined,
  });
</script>

<template>
  <!-- SectionNav.vue -->
  <nav
    class="section-nav"
    :aria-label="label"
  >
    <slot />
  </nav>
</template>
