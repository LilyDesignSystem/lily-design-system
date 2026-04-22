<script setup lang="ts">
  withDefaults(defineProps<{
    label?: string;
  }>(), {
    label: undefined,
  });
</script>

<template>
  <!-- DocumentList.vue -->
  <ul
    class="document-list"
    :aria-label="label"
  >
    <slot />
  </ul>
</template>
