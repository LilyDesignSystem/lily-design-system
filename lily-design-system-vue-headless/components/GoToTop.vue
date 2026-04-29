<script setup lang="ts">
  withDefaults(defineProps<{
    label?: string;
  }>(), {
    label: undefined,
  });
</script>

<template>
  <!-- GoToTop.vue -->
  <a
    class="go-to-top"
    :aria-label="label"
  >
    <slot />
  </a>
</template>
