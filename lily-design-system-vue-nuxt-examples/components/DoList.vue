<script setup lang="ts">

    // DoList component
    //
    // A list of recommended actions or best practices. Renders as a <ol> with
    // role="list" and an accessible label. Used in design system documentation,
    // guidelines, and instructional content to communicate what users should do.
    // Paired with DontList to create do/don't guidance patterns.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, default "Do". Accessible name for the list.
    //   default slot. List items, each should be an <li> element.
    //   ...restProps — additional HTML attributes spread onto the <ol> element.
    //
    // Syntax:
    //   <DoList><li>Best practice</li></DoList>
    //
    // Examples:
    //   <!-- Basic do list -->
    //   <DoList>
    //     <li>Write clear labels</li>
    //     <li>Use semantic HTML</li>
    //   </DoList>
    //
    //   <!-- Custom label for internationalization -->
    //   <DoList label="Recommended">
    //     <li>Provide alt text for images</li>
    //     <li>Use sufficient color contrast</li>
    //   </DoList>
    //
    // Keyboard:
    //   - None — passive container for list items
    //
    // Accessibility:
    //   - role="list" preserves list semantics even when CSS removes default styling
    //   - aria-label provides an accessible name (defaults to "Do")
    //
    // Internationalization:
    //   - The label prop defaults to "Do" but can be overridden for any locale
    //   - All list item text comes through consumer-provided children
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Companion to DontList; typically used together
    //
    // References:
    //   - MDN ul element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul
    //   - WAI list role: https://www.w3.org/WAI/ARIA/apd/roles/list/

    withDefaults(defineProps<{
        /** Accessible name for the list. */
        label?: string;
    }>(), {
        label: "Do",
    });

</script>

<template>
    <!-- DoList.vue -->
    <ul
        class="do-list"
        role="list"
        :aria-label="label"
    >
        <slot />
    </ul>
</template>
