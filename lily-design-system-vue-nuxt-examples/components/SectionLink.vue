<script setup lang="ts">
  withDefaults(defineProps<{
    label?: string;
  }>(), {
    label: undefined,
  });
</script>

<template>
  <!-- SectionLink.vue -->
  <a
    class="section-link"
    :aria-label="label"
  >
    <slot />
  </a>
</template>
