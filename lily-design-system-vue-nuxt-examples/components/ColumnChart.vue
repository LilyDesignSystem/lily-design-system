<script setup lang="ts">
  withDefaults(defineProps<{
    label?: string;
  }>(), {
    label: undefined,
  });
</script>

<template>
  <!-- ColumnChart.vue -->
  <figure
    class="column-chart"
    :aria-label="label"
  >
    <slot />
  </figure>
</template>
