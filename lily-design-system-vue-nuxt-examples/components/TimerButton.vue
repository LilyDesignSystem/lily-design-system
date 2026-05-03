<script setup lang="ts">

    // TimerButton component
    //
    // A button that auto-activates after a configurable countdown. The
    // user can click it at any time to act immediately, or let the
    // countdown reach zero to trigger the same action automatically.
    //
    // Props:
    //   label    — string, required. Accessible label describing the action.
    //   duration — number, required. Countdown duration in seconds.
    //   disabled — boolean, default false. When true, the timer does not
    //              start and clicks do nothing.
    //   default slot — button content.
    //
    // Emits:
    //   click — fired once when the button activates, manually or via timer.
    //
    // Accessibility:
    //   - Native <button> semantics
    //   - aria-label describes the action
    //   - aria-live="polite" announces countdown updates without interruption
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - The component owns the timer; clears it on unmount and on activation

    import { ref, onMounted, onBeforeUnmount } from "vue";

    const props = withDefaults(defineProps<{
        /** Accessible label describing the action. */
        label: string;
        /** Countdown duration in seconds. */
        duration: number;
        /** Whether the button is disabled. */
        disabled?: boolean;
    }>(), {
        disabled: false,
    });

    const emit = defineEmits<{
        (e: "click"): void;
    }>();

    const remainingSeconds = ref(props.duration);
    const fired = ref(false);
    let intervalId: ReturnType<typeof setInterval> | null = null;

    function clearTimer() {
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    onMounted(() => {
        if (props.disabled) return;
        const start = Date.now();
        intervalId = setInterval(() => {
            const elapsed = (Date.now() - start) / 1000;
            const remaining = Math.max(0, props.duration - Math.floor(elapsed));
            remainingSeconds.value = remaining;
            if (remaining === 0 && !fired.value) {
                fired.value = true;
                clearTimer();
                emit("click");
            }
        }, 250);
    });

    onBeforeUnmount(() => {
        clearTimer();
    });

    function onClick() {
        if (fired.value || props.disabled) return;
        fired.value = true;
        clearTimer();
        emit("click");
    }

</script>

<template>
    <!-- TimerButton.vue -->
    <button
        type="button"
        class="timer-button"
        :aria-label="label"
        aria-live="polite"
        :data-remaining-seconds="remainingSeconds"
        :disabled="disabled"
        @click="onClick"
    >
        <slot />
    </button>
</template>
