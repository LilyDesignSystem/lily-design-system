<script setup lang="ts">

    // BreadcrumbNav component
    //
    // A navigation landmark for a breadcrumb trail that shows the user's current
    // location within a site hierarchy. Renders a <nav> element with an accessible
    // label. Contains a BreadcrumbList which holds BreadcrumbListItem children.
    // Used in sites with deep hierarchies such as e-commerce catalogs,
    // documentation, and content management systems.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the navigation landmark.
    //   default slot. BreadcrumbList element.
    //   ...restProps — additional HTML attributes spread onto the <nav>.
    //
    // Syntax:
    //   <BreadcrumbNav label="Breadcrumb">
    //     <BreadcrumbList>...</BreadcrumbList>
    //   </BreadcrumbNav>
    //
    // Examples:
    //   <!-- Full breadcrumb navigation -->
    //   <BreadcrumbNav label="Breadcrumb">
    //     <BreadcrumbList>
    //       <BreadcrumbListItem><a href="/">Home</a></BreadcrumbListItem>
    //       <BreadcrumbListItem><a href="/products">Products</a></BreadcrumbListItem>
    //       <BreadcrumbListItem current>Widget</BreadcrumbListItem>
    //     </BreadcrumbList>
    //   </BreadcrumbNav>
    //
    // Keyboard:
    //   - Tab: Focus moves between links in the breadcrumb trail
    //   - Enter: Activates the focused breadcrumb link
    //
    // Accessibility:
    //   - <nav> with aria-label creates a navigation landmark
    //   - Screen readers announce the landmark name for orientation
    //
    // Internationalization:
    //   - Label text comes through the label prop; no hardcoded strings
    //
    // Claude rules:
    //   - Compound component — use with BreadcrumbList and BreadcrumbListItem
    //   - Headless: no CSS, no styles — consumer provides all styling
    //
    // References:
    //   - WAI-ARIA Breadcrumb Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
    //   - HTML nav element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav

    defineProps<{
        /** Accessible label for the breadcrumb navigation. */
        label: string;
    }>();

</script>

<template>
    <!-- BreadcrumbNav.vue -->
    <nav
        class="breadcrumb-nav"
        :aria-label="label"
    >
        <slot />
    </nav>
</template>
