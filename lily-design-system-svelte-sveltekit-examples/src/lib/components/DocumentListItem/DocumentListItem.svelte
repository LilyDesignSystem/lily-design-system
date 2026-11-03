<script lang="ts">
    // DocumentListItem component
    //
    // One document in a DocumentList. Renders an <li> with the `document-list-item` hook around the
    // consumer's link, type and size.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accepted for API symmetry but not rendered by this component.
    //   children — Snippet, required. The document link and its details.
    //   ...restProps — additional HTML attributes spread onto the root <li>.
    //
    // Syntax:
    //   <DocumentListItem>…</DocumentListItem>
    //
    // Examples:
    //   <DocumentList><DocumentListItem><a href="/report.pdf">Report</a></DocumentListItem></DocumentList>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - `label` is not rendered; name the element through restProps (aria-label or aria-labelledby) if it needs one
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //
    // References:
    //   - MDN <li>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li

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

<!-- DocumentListItem.svelte -->
<li
    class={`document-list-item ${className}`}
    {...restProps}
>
    {@render children?.()}
</li>
