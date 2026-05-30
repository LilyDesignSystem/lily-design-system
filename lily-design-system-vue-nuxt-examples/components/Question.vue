<script setup lang="ts">

    // Question component
    //
    // A question is anything that asks for information, invites a response, tests knowledge, etc.
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
    <!-- Question.vue -->
    <div
        class="question"
        :aria-label="label"
        v-bind="$attrs"
    >
        <slot />
    </div>
</template>
