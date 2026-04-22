<script setup lang="ts">
  withDefaults(defineProps<{
    label?: string;
  }>(), {
    label: undefined,
  });
</script>

<template>
  <!-- SuccessPanel.vue -->
  <div
    class="success-panel"
    :aria-label="label"
  >
    <slot />
  </div>
</template>
