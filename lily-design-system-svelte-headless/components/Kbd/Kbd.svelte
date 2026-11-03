<script lang="ts">
    // Kbd component
    //
    // Marks keyboard input, such as a key or shortcut. Renders a <kbd> with the `kbd` hook.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name, rendered as aria-label on the root.
    //   children — Snippet, required. The key text, for example Ctrl.
    //   ...restProps — additional HTML attributes spread onto the root <kbd>.
    //
    // Syntax:
    //   <Kbd label="…">…</Kbd>
    //
    // Examples:
    //   <p>Press <Kbd>Esc</Kbd> to close.</p>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - aria-label comes from `label` when given
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //
    // References:
    //   - MDN <kbd>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kbd

    import type { Snippet } from "svelte";
    let {
        class: className = "",
        label = undefined,
        children,
        ...restProps
    }: {
        label?: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Kbd.svelte -->
<kbd
    class={`kbd ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</kbd>
