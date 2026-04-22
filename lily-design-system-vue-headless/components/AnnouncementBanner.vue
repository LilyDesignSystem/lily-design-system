<script setup lang="ts">
  withDefaults(defineProps<{
    label?: string;
  }>(), {
    label: undefined,
  });
</script>

<template>
  <!-- AnnouncementBanner.vue -->
  <div
    class="announcement-banner"
    :aria-label="label"
  >
    <slot />
  </div>
</template>
