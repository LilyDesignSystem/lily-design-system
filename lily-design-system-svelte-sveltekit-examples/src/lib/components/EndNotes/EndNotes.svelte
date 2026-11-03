<script lang="ts">
    // EndNotes component
    //
    // The notes section at the end of an article. Renders a <section> with the `end-notes` hook, named by
    // `label`.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, default "End notes". Accessible name, rendered as aria-label on the section.
    //   children — Snippet, required. The content.
    //   ...restProps — additional HTML attributes spread onto the root <section>.
    //
    // Syntax:
    //   <EndNotes label="…">…</EndNotes>
    //
    // Examples:
    //   <EndNotes label="Notes"><ol><li>First note.</li></ol></EndNotes>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - A <section> with an accessible name is exposed as a region landmark
    //
    // Internationalization:
    //   - The default label "End notes" is English text inside the component; always pass a translated `label` (tracked as a defect against the no-hardcoded-strings rule)
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Always pass `label`, so the English default is never used
    //
    // References:
    //   - MDN <section>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section

    import type { Snippet } from "svelte";
    let {
        class: className = "",
        label = "End notes",
        children,
        ...restProps
    }: {
        label?: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- EndNotes.svelte -->
<section
    class={`end-notes ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</section>
