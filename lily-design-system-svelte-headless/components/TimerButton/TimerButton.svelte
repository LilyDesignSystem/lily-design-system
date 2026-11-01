<script lang="ts">
    // TimerButton: a button that counts down `duration` seconds and then activates itself; a click (or Enter /
    // Space, natively) activates it at once. It activates once only. data-remaining-seconds carries the countdown
    // for the consumer's display; aria-live="polite" announces the consumer's text as it changes.
    import { onMount, type Snippet } from "svelte";
    let {
        class: className = "",
        label,
        duration,
        disabled = false,
        onclick = undefined,
        children = undefined,
        ...restProps
    }: {
        /** Accessible label describing the action. */
        label: string;
        /** Countdown duration in seconds. */
        duration: number;
        disabled?: boolean;
        /** Called once, when the countdown ends or the button is pressed. */
        onclick?: () => void;
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    let remaining = $state(0);
    let fired = false;
    let timer: ReturnType<typeof setInterval> | undefined;

    function fire() {
        if (fired) return;
        fired = true;
        clearInterval(timer);
        onclick?.();
    }

    onMount(() => {
        remaining = duration;
        if (disabled) return;
        const start = Date.now();
        timer = setInterval(() => {
            remaining = Math.max(0, duration - Math.floor((Date.now() - start) / 1000));
            if (remaining === 0) fire();
        }, 250);
        return () => clearInterval(timer);
    });

    function handleClick() {
        if (disabled) return;
        fire();
    }
</script>

<!-- TimerButton.svelte -->
<button
    type="button"
    class={`timer-button ${className}`}
    aria-label={label}
    aria-live="polite"
    data-remaining-seconds={remaining}
    {disabled}
    onclick={handleClick}
    {...restProps}
>
    {@render children?.()}
</button>
