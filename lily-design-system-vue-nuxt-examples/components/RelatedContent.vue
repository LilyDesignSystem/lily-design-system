<script setup lang="ts">
  withDefaults(defineProps<{
    label?: string;
  }>(), {
    label: undefined,
  });
</script>

<template>
  <!-- RelatedContent.vue -->
  <aside
    class="related-content"
    :aria-label="label"
  >
    <slot />
  </aside>
</template>
