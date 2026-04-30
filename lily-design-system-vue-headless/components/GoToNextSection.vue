<script setup lang="ts">
    // GoToNextSection component
    // A link that takes users to the next section of the current page.

    defineProps<{
    label: string;
    href: string;
}>();
</script>

<template>
    <!-- GoToNextSection.vue -->
    <a
        class="go-to-next-section"
        :href="href"
        :aria-label="label"
    >{{ label }}</a>
</template>
