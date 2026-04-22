<script setup lang="ts">
  withDefaults(defineProps<{
    label?: string;
  }>(), {
    label: undefined,
  });
</script>

<template>
  <!-- SharePage.vue -->
  <div
    class="share-page"
    :aria-label="label"
  >
    <slot />
  </div>
</template>
