<script setup lang="ts">
  withDefaults(defineProps<{
    label?: string;
  }>(), {
    label: undefined,
  });
</script>

<template>
  <!-- StatusTag.vue -->
  <span
    class="status-tag"
    :aria-label="label"
  >
    <slot />
  </span>
</template>
