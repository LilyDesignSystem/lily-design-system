<script lang="ts">
    // PaginationList component
    //
    // A headless pagination navigation component that divides content into separate
    // pages. It renders a semantic <nav> element wrapping a <ul> list, with an
    // accessible label to identify the navigation purpose. Commonly used in search
    // results, product listings, data tables, and any interface with paginated content.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the pagination navigation via aria-label.
    //   children — Snippet, required. Pagination list items, typically <li> elements with links or buttons.
    //   ...restProps — additional HTML attributes spread onto the <nav>.
    //
    // Syntax:
    //   <PaginationList label="Pagination">{children}</PaginationList>
    //
    // Examples:
    //   <!-- Basic pagination with current page indicated -->
    //   <PaginationList label="Pagination">
    //     <li><a href="/page/1">1</a></li>
    //     <li><a href="/page/2" aria-current="page">2</a></li>
    //     <li><a href="/page/3">3</a></li>
    //   </PaginationList>
    //
    //   <!-- With previous/next controls -->
    //   <PaginationList label="Search results pages">
    //     <li><a href="/page/1">Previous</a></li>
    //     <li><a href="/page/2" aria-current="page">2</a></li>
    //     <li><a href="/page/3">Next</a></li>
    //   </PaginationList>
    //
    // Keyboard:
    //   - Tab: moves focus between pagination links/buttons in the list
    //   - Enter: activates the focused link or button to navigate to that page
    //
    // Accessibility:
    //   - <nav aria-label="..."> creates a navigation landmark for assistive technology
    //   - Consumer should apply aria-current="page" on the link for the active page
    //   - Compound component; see PaginationListItem for individual page items
    //
    // Internationalization:
    //   - The label prop is the only text provided by the component
    //   - All page link text comes through children
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - This is a compound component parent; use with PaginationListItem
    //   - Do not add page numbers or navigation logic — consumer provides all items
    //
    // References:
    //   - WAI-ARIA navigation role: https://www.w3.org/TR/wai-aria-1.2/#navigation
    //   - WAI-ARIA Practices - Navigation: https://www.w3.org/WAI/ARIA/apd/patterns/navigation/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** Pagination items. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- PaginationList.svelte -->
<nav
    class={`pagination-list ${className}`}
    aria-label={label}
    {...restProps}
>
    <ol>
        {@render children()}
    </ol>
</nav>
