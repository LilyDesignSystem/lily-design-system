<script setup lang="ts">
  withDefaults(defineProps<{
    label?: string;
  }>(), {
    label: undefined,
  });
</script>

<template>
  <!-- DocumentListItem.vue -->
  <li
    class="document-list-item"
    :aria-label="label"
  >
    <slot />
  </li>
</template>
