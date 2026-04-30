<script setup lang="ts">
    // GoToPreviousSection component
    // A link that takes users to the previous section of the current page.

    defineProps<{
    label: string;
    href: string;
}>();
</script>

<template>
    <!-- GoToPreviousSection.vue -->
    <a
        class="go-to-previous-section"
        :href="href"
        :aria-label="label"
    >{{ label }}</a>
</template>
