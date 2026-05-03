<script setup lang="ts">

    // ThemePickerButton component
    //
    // One button in a theme picker, representing a single theme. Renders
    // as a <button> with aria-pressed reflecting whether this theme is
    // currently active.
    //
    // Props:
    //   label    — string, required. Accessible label describing the theme.
    //   pressed  — boolean, default false. Whether this theme is selected.
    //   disabled — boolean, default false. Whether the button is disabled.
    //   default slot — button content (icon, swatch, label).
    //
    // Emits:
    //   click — native click event.
    //
    // Accessibility:
    //   - Implicit button role from the <button> element
    //   - aria-pressed communicates toggle state for the active theme
    //   - aria-label provides a name when the visual content is not text
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Always renders type="button" so it does not submit a surrounding form

    withDefaults(defineProps<{
        /** Accessible label describing the theme. */
        label: string;
        /** Whether this theme is currently selected. */
        pressed?: boolean;
        /** Whether the button is disabled. */
        disabled?: boolean;
    }>(), {
        pressed: false,
        disabled: false,
    });

    const emit = defineEmits<{
        (e: "click", event: MouseEvent): void;
    }>();

</script>

<template>
    <!-- ThemePickerButton.vue -->
    <button
        type="button"
        class="theme-picker-button"
        :aria-pressed="pressed"
        :aria-label="label"
        :disabled="disabled"
        @click="(event: MouseEvent) => emit('click', event)"
    >
        <slot />
    </button>
</template>
