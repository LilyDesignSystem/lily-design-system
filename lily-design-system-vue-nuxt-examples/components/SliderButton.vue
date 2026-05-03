<script setup lang="ts">

    // SliderButton component
    //
    // A "slide to confirm" button. Keyboard users adjust the slider with
    // Arrow Right / Arrow Left, jump to ends with Home / End, or activate
    // immediately with Enter or Space (accessibility fallback).
    // Pointer-drag styling and gesture handling are left to the consumer;
    // this component models the keyboard fallback and the slider state.
    //
    // Props:
    //   label    — string, required. Accessible label describing the action.
    //   step     — number, default 10. Percent step per Arrow press.
    //   disabled — boolean, default false.
    //   default slot — visible label content.
    //
    // Emits:
    //   confirm — fired when the slider reaches 100% (End / Enter / Space
    //             also trigger this).
    //
    // Accessibility:
    //   - role="slider" so assistive tech announces the position
    //   - aria-valuenow / aria-valuemin / aria-valuemax expose the percent
    //   - aria-label provides the accessible name
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling

    import { ref } from "vue";

    const props = withDefaults(defineProps<{
        /** Accessible label describing the confirmation action. */
        label: string;
        /** Percent step per Arrow Right / Arrow Left press. */
        step?: number;
        /** Whether the button is disabled. */
        disabled?: boolean;
    }>(), {
        step: 10,
        disabled: false,
    });

    const emit = defineEmits<{
        (e: "confirm"): void;
    }>();

    const position = ref(0);

    function fireIfComplete(next: number) {
        if (next >= 100) {
            position.value = 0;
            emit("confirm");
        } else {
            position.value = next;
        }
    }

    function onKeyDown(event: KeyboardEvent) {
        if (props.disabled) return;
        switch (event.key) {
            case "ArrowRight":
                event.preventDefault();
                fireIfComplete(Math.min(100, position.value + props.step));
                break;
            case "ArrowLeft":
                event.preventDefault();
                position.value = Math.max(0, position.value - props.step);
                break;
            case "Home":
                event.preventDefault();
                position.value = 0;
                break;
            case "End":
                event.preventDefault();
                fireIfComplete(100);
                break;
            case "Enter":
            case " ":
                event.preventDefault();
                fireIfComplete(100);
                break;
        }
    }

</script>

<template>
    <!-- SliderButton.vue -->
    <button
        type="button"
        role="slider"
        class="slider-button"
        :aria-label="label"
        :aria-valuenow="position"
        :aria-valuemin="0"
        :aria-valuemax="100"
        :disabled="disabled"
        @keydown="onKeyDown"
    >
        <slot />
    </button>
</template>
