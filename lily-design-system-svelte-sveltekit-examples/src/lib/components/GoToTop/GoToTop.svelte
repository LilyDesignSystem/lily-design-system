<script lang="ts">
    // GoToTop component
    //
    // A link back to the top of the page. Renders an <a> with the `go-to-top` hook; `href` defaults to
    // #top, so the page needs an element with id="top" (or the consumer passes another target).
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accepted but not rendered; the link's name is its children.
    //   href — string, default "#top". The link target.
    //   children — Snippet, required. The content.
    //   ...restProps — additional HTML attributes spread onto the root <a>.
    //
    // Syntax:
    //   <GoToTop>…</GoToTop>
    //
    // Examples:
    //   <GoToTop href="#top">Back to top</GoToTop>
    //
    // Keyboard:
    //   - Tab: moves focus onto the link
    //   - Enter: follows the link (native browser behaviour)
    //
    // Accessibility:
    //   - A native <a href>; the children are the accessible name
    //   - `label` is not rendered, so put the text in the children
    //
    // Internationalization:
    //   - The link text is the consumer's children; no hardcoded text
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //
    // References:
    //   - MDN <a>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label = undefined,
        href = "#top",
        children,
        ...restProps
    }: {
        label?: string;
        href?: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- GoToTop.svelte -->
<a
    class={`go-to-top ${className}`}
    {href}
    {...restProps}
>
    {@render children?.()}
</a>
