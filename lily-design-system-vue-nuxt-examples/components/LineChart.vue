<script setup lang="ts">
  withDefaults(defineProps<{
    label?: string;
  }>(), {
    label: undefined,
  });
</script>

<template>
  <!-- LineChart.vue -->
  <figure
    class="line-chart"
    :aria-label="label"
  >
    <slot />
  </figure>
</template>
