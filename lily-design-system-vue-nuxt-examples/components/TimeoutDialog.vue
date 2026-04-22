<script setup lang="ts">
  withDefaults(defineProps<{
    label?: string;
  }>(), {
    label: undefined,
  });
</script>

<template>
  <!-- TimeoutDialog.vue -->
  <dialog
    class="timeout-dialog"
    :aria-label="label"
  >
    <slot />
  </dialog>
</template>
