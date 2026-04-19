<script lang="ts">
    // TreeNav component
    //
    // A headless tree-based menu that displays hierarchical or nested navigation
    // options using the ARIA tree role. Renders a <ul> with role="tree" and
    // provides keyboard navigation between tree items using ArrowDown/ArrowUp
    // with wrapping, plus Home/End to jump to first/last items. Commonly used
    // for file directories, multi-level category navigation, or organizational
    // charts.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the tree via aria-label.
    //   children — Snippet, required. Tree item elements (expected to be <li role="treeitem">).
    //   ...restProps — additional HTML attributes spread onto the <ul>.
    //
    // Syntax:
    //   <TreeNav label="Navigation">...</TreeNav>
    //
    // Examples:
    //   <!-- Tree menu with navigable items -->
    //   <TreeNav label="Navigation">
    //     <li role="treeitem" tabindex="-1">Home</li>
    //     <li role="treeitem" tabindex="-1">About</li>
    //     <li role="treeitem" tabindex="-1">Contact</li>
    //   </TreeNav>
    //
    // Keyboard:
    //   - ArrowDown: move focus to the next tree item (wraps to first)
    //   - ArrowUp: move focus to the previous tree item (wraps to last)
    //   - Home: move focus to the first tree item
    //   - End: move focus to the last tree item
    //
    // Accessibility:
    //   - role="tree" identifies the container as a tree view widget
    //   - aria-label={label} provides an accessible name for the tree
    //   - Consumer items should use role="treeitem" and tabindex="-1"
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Queries [role='treeitem'] descendants for keyboard navigation
    //   - Uses $state() for internal DOM reference
    //
    // References:
    //   - WAI-ARIA Tree View Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/TreeList/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** Tree item elements. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    let treeRef: HTMLElement | undefined = $state(undefined);

    function onkeydown(event: KeyboardEvent) {
        if (!treeRef) return;
        const items = Array.from(
            treeRef.querySelectorAll<HTMLElement>("[role='treeitem']"),
        );
        const current = document.activeElement as HTMLElement;
        const index = items.indexOf(current);
        switch (event.key) {
            case "ArrowDown": {
                event.preventDefault();
                const next = index < items.length - 1 ? index + 1 : 0;
                items[next]?.focus();
                break;
            }
            case "ArrowUp": {
                event.preventDefault();
                const prev = index > 0 ? index - 1 : items.length - 1;
                items[prev]?.focus();
                break;
            }
            case "Home": {
                event.preventDefault();
                items[0]?.focus();
                break;
            }
            case "End": {
                event.preventDefault();
                items[items.length - 1]?.focus();
                break;
            }
        }
    }
</script>

<!-- TreeNav.svelte -->
<ul
    class={`tree-nav ${className}`}
    role="tree"
    aria-label={label}
    bind:this={treeRef}
    {onkeydown}
    {...restProps}
>
    {@render children()}
</ul>
