<script setup lang="ts">
  withDefaults(defineProps<{
    label?: string;
  }>(), {
    label: undefined,
  });
</script>

<template>
  <!-- ScatterChart.vue -->
  <figure
    class="scatter-chart"
    :aria-label="label"
  >
    <slot />
  </figure>
</template>
