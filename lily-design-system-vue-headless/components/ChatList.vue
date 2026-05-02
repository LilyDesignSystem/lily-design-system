<script setup lang="ts">

    // ChatList component
    //
    // An ordered list of chat list items.
    //
    // Props:
    //   label — string, optional. Accessible label via aria-label.
    //   default slot — component content.
    //
    // Accessibility:
    //   - native <ol> semantics
    //   - aria-label exposes a screen-reader name when label is provided
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //
    // References:
    //   - HTML ol element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol

    withDefaults(defineProps<{
        /** Optional accessible label set on aria-label. */
        label?: string;
    }>(), {
        label: undefined,
    });

</script>

<template>
    <!-- ChatList.vue -->
    <ol
        class="chat-list"
        :aria-label="label"
    >
        <slot />
    </ol>
</template>
