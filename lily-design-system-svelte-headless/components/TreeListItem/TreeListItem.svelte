<script lang="ts">
    import type { Snippet } from "svelte";
    let {
        class: className = "",
        label = undefined,
        expanded = $bindable(undefined),
        children,
        ...restProps
    }: {
        label?: string;
        /** Expanded state, bindable. Leave undefined for a leaf (no aria-expanded). */
        expanded?: boolean;
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    // ArrowRight/ArrowLeft (WAI-ARIA tree pattern). Only for the focused item itself, not a
    // nested one the event bubbled up from. Swapped in right-to-left layouts.
    function onkeydown(event: KeyboardEvent) {
        const item = event.currentTarget as HTMLElement;
        if (event.target !== item) return;
        const rtl = getComputedStyle(item).direction === "rtl";
        const open = rtl ? "ArrowLeft" : "ArrowRight";
        const close = rtl ? "ArrowRight" : "ArrowLeft";
        if (event.key === open) {
            if (expanded === false) {
                event.preventDefault();
                expanded = true;
            } else if (expanded === true) {
                const child = item.querySelector<HTMLElement>("[role='treeitem']");
                if (child) {
                    event.preventDefault();
                    child.focus();
                }
            }
        } else if (event.key === close) {
            if (expanded === true) {
                event.preventDefault();
                expanded = false;
            } else {
                const parent = item.parentElement?.closest<HTMLElement>("[role='treeitem']");
                if (parent) {
                    event.preventDefault();
                    parent.focus();
                }
            }
        }
    }
</script>

<!-- TreeListItem.svelte -->
<li class={`tree-list-item ${className}`} role="treeitem" tabindex="-1" aria-label={label} aria-expanded={expanded} {onkeydown} {...restProps}>
    {@render children?.()}
</li>
