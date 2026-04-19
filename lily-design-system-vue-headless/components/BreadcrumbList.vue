<script setup lang="ts">

    // BreadcrumbList component
    //
    // An ordered list that contains BreadcrumbListItem children, representing
    // the hierarchical trail in a breadcrumb navigation. Renders a semantic
    // <ol> element to convey the ordered relationship of pages. Must be placed
    // inside a BreadcrumbNav container.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   default slot. BreadcrumbListItem elements.
    //   ...restProps — additional HTML attributes spread onto the <ol>.
    //
    // Syntax:
    //   <BreadcrumbList>
    //     <BreadcrumbListItem>...</BreadcrumbListItem>
    //   </BreadcrumbList>
    //
    // Examples:
    //   <!-- Breadcrumb list inside a nav -->
    //   <BreadcrumbNav label="Breadcrumb">
    //     <BreadcrumbList>
    //       <BreadcrumbListItem><a href="/">Home</a></BreadcrumbListItem>
    //       <BreadcrumbListItem><a href="/products">Products</a></BreadcrumbListItem>
    //       <BreadcrumbListItem current>Widget</BreadcrumbListItem>
    //     </BreadcrumbList>
    //   </BreadcrumbNav>
    //
    // Keyboard: None — passive container. Keyboard interactions are handled
    // by links within BreadcrumbListItem children.
    //
    // Accessibility:
    //   - <ol> conveys the ordered hierarchical relationship of the trail
    //   - Implicit list role allows screen readers to announce item count
    //
    // Internationalization:
    //   - No user-facing strings; all content comes through children
    //   - Separator characters (e.g. "/" or ">") should be added by the consumer
    //
    // Claude rules:
    //   - Compound component — used inside BreadcrumbNav, contains BreadcrumbListItem children
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Separator characters between items are the consumer's responsibility
    //
    // References:
    //   - WAI-ARIA Breadcrumb Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/

</script>

<template>
    <!-- BreadcrumbList.vue -->
    <ol
        class="breadcrumb-list"
    >
        <slot />
    </ol>
</template>
