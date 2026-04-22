<script setup lang="ts">
  withDefaults(defineProps<{
    label?: string;
  }>(), {
    label: undefined,
  });
</script>

<template>
  <!-- AreaChart.vue -->
  <figure
    class="area-chart"
    :aria-label="label"
  >
    <slot />
  </figure>
</template>
