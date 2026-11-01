<script lang="ts">
    // SliderButton: a slide-to-confirm control. A <button role="slider"> whose aria-valuenow is the position, 0 to
    // 100. ArrowRight/ArrowLeft move it by `step`; Home returns it to 0; End, Enter or Space complete it (the
    // keyboard fallback for the drag). Reaching 100 calls `onconfirm` and resets to 0. The consumer draws the track
    // and thumb from aria-valuenow, and wires pointer drag through the same position if it wants one.
    import type { Snippet } from "svelte";
    let {
        class: className = "",
        label,
        step = 10,
        disabled = false,
        onconfirm = undefined,
        children = undefined,
        ...restProps
    }: {
        /** Accessible label describing the confirmation action. */
        label: string;
        /** How far one arrow press moves the slider, in percent. */
        step?: number;
        disabled?: boolean;
        /** Called when the slider reaches 100%. */
        onconfirm?: () => void;
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    let position = $state(0);

    function moveTo(next: number) {
        if (next >= 100) {
            position = 0;
            onconfirm?.();
        } else {
            position = Math.max(0, next);
        }
    }

    function onkeydown(event: KeyboardEvent) {
        if (disabled) return;
        switch (event.key) {
            case "ArrowRight":
                moveTo(position + step);
                break;
            case "ArrowLeft":
                moveTo(position - step);
                break;
            case "Home":
                moveTo(0);
                break;
            case "End":
            case "Enter":
            case " ":
                moveTo(100);
                break;
            default:
                return;
        }
        event.preventDefault();
    }
</script>

<!-- SliderButton.svelte -->
<button
    type="button"
    role="slider"
    class={`slider-button ${className}`}
    aria-label={label}
    aria-valuenow={position}
    aria-valuemin={0}
    aria-valuemax={100}
    {disabled}
    {onkeydown}
    {...restProps}
>
    {@render children?.()}
</button>
