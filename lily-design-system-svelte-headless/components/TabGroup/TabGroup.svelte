<script lang="ts">
    // TabBar component
    //
    // A headless tab list container that provides the ARIA tablist role and
    // built-in keyboard navigation for tabbed interfaces. It manages arrow key
    // navigation between tab elements, allowing users to cycle through tabs
    // with Left/Right arrow keys and jump to first/last with Home/End keys.
    // The consumer provides tab buttons as children and manages selection state.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the tab list via aria-label.
    //   children — Snippet, required. Tab button elements to render inside the tablist.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <TabBar label="Settings">...</TabBar>
    //
    // Examples:
    //   <!-- Tab list with manual tab buttons -->
    //   <TabBar label="Settings">
    //     <button role="tab" aria-selected="true">General</button>
    //     <button role="tab" aria-selected="false">Advanced</button>
    //   </TabBar>
    //
    // Keyboard:
    //   - ArrowRight: moves focus to the next tab (wraps to first)
    //   - ArrowLeft: moves focus to the previous tab (wraps to last)
    //   - Home: moves focus to the first tab
    //   - End: moves focus to the last tab
    //   - Tab: moves focus into and out of the tab list
    //
    // Accessibility:
    //   - role="tablist" identifies the container as a list of tabs
    //   - aria-label={label} provides an accessible name for the tab list
    //   - Child tabs should have role="tab" and aria-selected attributes
    //   - Associated tab panels should have role="tabpanel" with aria-labelledby
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Queries child [role='tab'] elements for keyboard navigation
    //   - Uses $state() for the internal DOM reference
    //
    // References:
    //   - WAI-ARIA Tabs Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
    //   - WAI-ARIA Authoring Practices - Tabs: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-automatic/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** Tab elements. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    let tablistRef: HTMLElement | undefined = $state(undefined);

    function onkeydown(event: KeyboardEvent) {
        if (!tablistRef) return;
        const tabs = Array.from(
            tablistRef.querySelectorAll<HTMLElement>("[role='tab']"),
        );
        const current = document.activeElement as HTMLElement;
        const index = tabs.indexOf(current);
        switch (event.key) {
            case "ArrowRight": {
                event.preventDefault();
                const next = index < tabs.length - 1 ? index + 1 : 0;
                tabs[next]?.focus();
                break;
            }
            case "ArrowLeft": {
                event.preventDefault();
                const prev = index > 0 ? index - 1 : tabs.length - 1;
                tabs[prev]?.focus();
                break;
            }
            case "Home": {
                event.preventDefault();
                tabs[0]?.focus();
                break;
            }
            case "End": {
                event.preventDefault();
                tabs[tabs.length - 1]?.focus();
                break;
            }
        }
    }
</script>

<!-- TabBar.svelte -->
<div
    class={`tab-bar ${className}`}
    role="tablist"
    aria-label={label}
    bind:this={tablistRef}
    {onkeydown}
    {...restProps}
>
    {@render children()}
</div>
