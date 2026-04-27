<script setup lang="ts">

    // CollectionList component
    //
    // A compact list of multiple related items such as articles or events.
    // Renders a <ul> with the collection-list class. Children are typically
    // CollectionListItem components.
    //
    // Props:
    //   label — string, optional. aria-label for the list.
    //   default slot — collection-list-item children.
    //   ...restProps — additional HTML attributes spread via $attrs.
    //
    // Syntax:
    //   <CollectionList label="Recent articles">…</CollectionList>
    //
    // Examples:
    //   <CollectionList label="Articles">
    //     <CollectionListItem heading="One" />
    //     <CollectionListItem heading="Two" />
    //   </CollectionList>
    //
    // Accessibility:
    //   - native <ul> list semantics
    //   - aria-label is optional but improves identification when multiple
    //     lists are present
    //
    // Internationalization:
    //   - The label prop accepts any string; consumers provide localized text
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //
    // References:
    //   - USWDS Collection: https://designsystem.digital.gov/components/collection/

    withDefaults(defineProps<{
        /** Accessible list label. */
        label?: string;
    }>(), {
        label: undefined,
    });

</script>

<template>
    <!-- CollectionList.vue -->
    <ul
        class="collection-list"
        :aria-label="label"
    >
        <slot />
    </ul>
</template>
