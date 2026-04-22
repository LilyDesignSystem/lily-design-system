<script setup lang="ts">
  withDefaults(defineProps<{
    label?: string;
  }>(), {
    label: undefined,
  });
</script>

<template>
  <!-- PhaseBanner.vue -->
  <div
    class="phase-banner"
    :aria-label="label"
  >
    <slot />
  </div>
</template>
