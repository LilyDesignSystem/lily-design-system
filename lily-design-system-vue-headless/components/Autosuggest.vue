<script setup lang="ts">
  withDefaults(defineProps<{
    label?: string;
  }>(), {
    label: undefined,
  });
</script>

<template>
  <!-- Autosuggest.vue -->
  <div
    class="autosuggest"
    :aria-label="label"
  >
    <slot />
  </div>
</template>
