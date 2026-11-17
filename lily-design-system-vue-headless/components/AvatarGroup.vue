<script setup lang="ts">
// AvatarGroup component
//
// A group of avatar components.
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
//
// References:
//   - HTML div element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div

withDefaults(
    defineProps<{
        /** Optional accessible label set on aria-label. */
        label?: string;
        /** the consumer's words for the avatars not shown ("and 12 more"), rendered last as -overflow */
        overflowLabel?: string;
    }>(),
    {
        label: undefined,
        overflowLabel: undefined,
    },
);
</script>

<template>
    <!-- AvatarGroup.vue -->
    <div
        class="avatar-group"
        role="group"
        :aria-label="label"
    >
        <slot />
        <span
            v-if="overflowLabel"
            class="avatar-group-overflow"
            >{{ overflowLabel }}</span
        >
    </div>
</template>
