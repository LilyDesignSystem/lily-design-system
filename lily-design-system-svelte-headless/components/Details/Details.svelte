<script lang="ts">
    // Details component
    //
    // A disclosure widget that reveals or hides additional content on demand.
    // Built on the native HTML <details> and <summary> elements, it provides
    // progressive disclosure with built-in browser accessibility. Common use
    // cases include FAQs, collapsible sections, and supplementary explanations.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   summary — string, required. Text displayed in the clickable summary toggle.
    //   open — boolean, default false. Whether the details section is expanded; bindable.
    //   printOpen — boolean, default true. A printed page cannot open a closed disclosure, so on `beforeprint` a closed
    //     one is opened and on `afterprint` it is closed again (one the reader had opened stays open). Pass false for a
    //     disclosure whose content should not print.
    //   children — Snippet, required. Content revealed when expanded.
    //   ...restProps — additional HTML attributes spread onto the <details> element.
    //
    // Syntax:
    //   <Details summary="More info">Content here</Details>
    //
    // Examples:
    //   <!-- Basic disclosure -->
    //   <Details summary="More information">
    //     <p>Additional details shown when expanded.</p>
    //   </Details>
    //
    //   <!-- Two-way binding with parent state -->
    //   <Details summary="Advanced options" bind:open={showAdvanced}>
    //     <p>Configure advanced settings here.</p>
    //   </Details>
    //
    // Keyboard:
    //   - Enter: toggles the disclosure open/closed when <summary> is focused
    //   - Space: toggles the disclosure open/closed when <summary> is focused
    //
    // Accessibility:
    //   - Native <details>/<summary> provide built-in ARIA semantics
    //   - Browser automatically exposes expanded/collapsed state to assistive technology
    //   - No additional ARIA attributes needed
    //
    // Internationalization:
    //   - The summary prop accepts any string; consumers provide localized text
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Uses $bindable() on open for two-way state synchronization
    //   - Browser-only: the print listeners are added in an effect, never during server rendering
    //   - Similar to Collapsible but uses a standards-based API
    //
    // References:
    //   - MDN details element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
    //   - MDN summary element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/summary
    //   - WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/

    import type { Snippet } from "svelte";

    import { keepOpenForPrint } from "./print-open";

    let {
        class: className = "",
        summary,
        open = $bindable(false),
        printOpen = true,
        children,
        ...restProps
    }: {
        /** Text for the summary toggle. */
        summary: string;
        /** Whether the details are expanded. Bindable. */
        open?: boolean;
        /** Open the disclosure while printing, and restore it afterwards. Default true. */
        printOpen?: boolean;
        /** Content shown when expanded. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    let element: HTMLDetailsElement | undefined = $state();

    // Print cannot open a closed disclosure, so open it for the page and close it again (P42-T9).
    $effect(() => {
        if (!printOpen || !element) return;
        const target = element;
        return keepOpenForPrint(() => [target]);
    });
</script>

<!-- Details.svelte -->
<details
    class={`details ${className}`}
    bind:this={element}
    bind:open
    {...restProps}
>
    <summary>{summary}</summary>
    {@render children?.()}
</details>
