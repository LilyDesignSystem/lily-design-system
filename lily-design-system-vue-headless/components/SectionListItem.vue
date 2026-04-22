<script setup lang="ts">
  withDefaults(defineProps<{
    label?: string;
  }>(), {
    label: undefined,
  });
</script>

<template>
  <!-- SectionListItem.vue -->
  <li
    class="section-list-item"
    :aria-label="label"
  >
    <slot />
  </li>
</template>
