<script setup lang="ts">

    // Comment component
    //
    // A comment is anything that expresses an opinion, observation, explanation, etc.
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
    <!-- Comment.vue -->
    <div
        class="comment"
        :aria-label="label"
        v-bind="$attrs"
    >
        <slot />
    </div>
</template>
