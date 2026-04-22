<script setup lang="ts">
  withDefaults(defineProps<{
    label?: string;
  }>(), {
    label: undefined,
  });
</script>

<template>
  <!-- DescriptionList.vue -->
  <dl
    class="description-list"
    :aria-label="label"
  >
    <slot />
  </dl>
</template>
