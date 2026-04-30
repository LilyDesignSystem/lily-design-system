<script setup lang="ts">
    // MockupPhoneLandscape component
    // A box area that looks like a mobile phone in landscape orientation.

    defineProps<{
    label: string;
}>();
</script>

<template>
    <!-- MockupPhoneLandscape.vue -->
    <div
        class="mockup-phone-landscape" role="img"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
