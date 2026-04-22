<script setup lang="ts">
  withDefaults(defineProps<{
    label?: string;
  }>(), {
    label: undefined,
  });
</script>

<template>
  <!-- AddressInput.vue -->
  <div
    class="address-input"
    :aria-label="label"
  >
    <slot />
  </div>
</template>
