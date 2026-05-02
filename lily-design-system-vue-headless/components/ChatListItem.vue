<script setup lang="ts">

    // ChatListItem component
    //
    // One chat list item, typically containing a chat message.
    //
    // Props:
    //   label — string, optional. Accessible label via aria-label.
    //   default slot — component content.
    //
    // Accessibility:
    //   - native <li> semantics
    //   - aria-label exposes a screen-reader name when label is provided
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //
    // References:
    //   - HTML li element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li

    withDefaults(defineProps<{
        /** Optional accessible label set on aria-label. */
        label?: string;
    }>(), {
        label: undefined,
    });

</script>

<template>
    <!-- ChatListItem.vue -->
    <li
        class="chat-list-item"
        :aria-label="label"
    >
        <slot />
    </li>
</template>
