<script setup lang="ts">
  withDefaults(defineProps<{
    label?: string;
  }>(), {
    label: undefined,
  });
</script>

<template>
  <!-- BackToTop.vue -->
  <a
    class="back-to-top"
    :aria-label="label"
  >
    <slot />
  </a>
</template>
