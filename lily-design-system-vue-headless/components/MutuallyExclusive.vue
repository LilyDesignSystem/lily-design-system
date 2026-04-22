<script setup lang="ts">
  withDefaults(defineProps<{
    label?: string;
  }>(), {
    label: undefined,
  });
</script>

<template>
  <!-- MutuallyExclusive.vue -->
  <fieldset
    class="mutually-exclusive"
    :aria-label="label"
  >
    <slot />
  </fieldset>
</template>
