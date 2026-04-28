<script setup lang="ts">

    // ActionBarButton component
    //
    // One action button intended to live inside an ActionBar. Renders a native
    // <button> with a required accessible label. Defaults to type="button" to
    // avoid accidental form submissions.
    //
    // Props:
    //   label    — string, REQUIRED. aria-label for the button.
    //   type     — "button" | "submit" | "reset", default "button".
    //   disabled — boolean, default false.
    //   default slot — button content (icon and/or text).
    //   emits click(event) — click handler.
    //
    // Syntax:
    //   <ActionBarButton label="Delete" @click="onDelete">Delete</ActionBarButton>
    //
    // Accessibility:
    //   - native <button> semantics
    //   - aria-label provides the accessible name
    //
    // Internationalization:
    //   - The label prop accepts any string; consumers provide localized text
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - label is required

    withDefaults(defineProps<{
        /** Accessible label (REQUIRED). */
        label: string;
        /** HTML button type. */
        type?: "button" | "submit" | "reset";
        /** Whether disabled. */
        disabled?: boolean;
    }>(), {
        type: "button",
        disabled: false,
    });

    defineEmits<{
        (e: "click", event: MouseEvent): void;
    }>();

</script>

<template>
    <!-- ActionBarButton.vue -->
    <button
        class="action-bar-button"
        :type="type"
        :disabled="disabled"
        :aria-label="label"
        @click="$emit('click', $event)"
    >
        <slot />
    </button>
</template>
