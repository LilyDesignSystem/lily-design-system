<script setup lang="ts">
  withDefaults(defineProps<{
    label?: string;
  }>(), {
    label: undefined,
  });
</script>

<template>
  <!-- BarChart.vue -->
  <figure
    class="bar-chart"
    :aria-label="label"
  >
    <slot />
  </figure>
</template>
