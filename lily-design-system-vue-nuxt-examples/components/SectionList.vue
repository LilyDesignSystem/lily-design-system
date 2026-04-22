<script setup lang="ts">
  withDefaults(defineProps<{
    label?: string;
  }>(), {
    label: undefined,
  });
</script>

<template>
  <!-- SectionList.vue -->
  <ul
    class="section-list"
    :aria-label="label"
  >
    <slot />
  </ul>
</template>
