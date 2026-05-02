<script setup lang="ts">

    // Framer component
    //
    // Framer for the Reuters-graphics-style article layout family.
    // Renders a <div> that consumers style.

    withDefaults(defineProps<{
        /** Optional accessible label set on aria-label. */
        label?: string;
    }>(), {
        
label: undefined,
    });

</script>

<template>
    <!-- Framer.vue -->
    <div
        class="framer"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
