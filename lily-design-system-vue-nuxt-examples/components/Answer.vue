<script setup lang="ts">

    // Answer component
    //
    // An answer is anything that responds to a question, request, action, etc.
    //
    // Props:
    //   label — string, optional. Accessible label via aria-label.
    //   default slot — component content.
    //
    // Accessibility:
    //   - native <div> semantics
    //   - aria-label exposes a screen-reader name when label is provided
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling

    withDefaults(defineProps<{
        /** Optional accessible label set on aria-label. */
        label?: string;
    }>(), {
        label: undefined,
    });

</script>

<template>
    <!-- Answer.vue -->
    <div
        class="answer"
        :aria-label="label"
        v-bind="$attrs"
    >
        <slot />
    </div>
</template>
