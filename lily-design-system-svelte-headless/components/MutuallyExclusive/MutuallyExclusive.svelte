<script lang="ts">
    // MutuallyExclusive component
    //
    // A group of options of which only one may apply (the "or" pattern, such as a "None of these" choice
    // beside a checkbox list). Renders a <fieldset> with the `mutually-exclusive` hook; the exclusivity
    // logic is the consumer's.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name, rendered as aria-label on the root.
    //   children — Snippet, required. The grouped inputs.
    //   ...restProps — additional HTML attributes spread onto the root <fieldset>.
    //
    // Syntax:
    //   <MutuallyExclusive label="…">…</MutuallyExclusive>
    //
    // Examples:
    //   <MutuallyExclusive>…</MutuallyExclusive>
    //
    // Keyboard:
    //   - Tab and Space/Arrow keys follow the native controls inside the fieldset
    //
    // Accessibility:
    //   - aria-label comes from `label` when given
    //   - A <fieldset> is a group; prefer a visible <legend> inside it for the name, and use `label` only when no legend is shown
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //
    // References:
    //   - MDN <fieldset>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset

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

<!-- MutuallyExclusive.svelte -->
<fieldset
    class={`mutually-exclusive ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</fieldset>
