<script setup lang="ts">
  withDefaults(defineProps<{
    label?: string;
  }>(), {
    label: undefined,
  });
</script>

<template>
  <!-- DescriptionListItem.vue -->
  <div
    class="description-list-item"
    :aria-label="label"
  >
    <slot />
  </div>
</template>
