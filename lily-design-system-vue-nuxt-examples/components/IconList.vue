<script setup lang="ts">

    // IconList component
    //
    // An ordered list of IconListItem components. Renders <ul> with the
    // icon-list class. Children supply icon content via the `icon` named slot.
    //
    // Props:
    //   label — string, optional. aria-label for the list.
    //   default slot — IconListItem children.
    //
    // Syntax:
    //   <IconList label="Highlights">
    //     <IconListItem>...</IconListItem>
    //   </IconList>
    //
    // Accessibility:
    //   - native <ul> list semantics
    //   - aria-label is optional
    //
    // Internationalization:
    //   - The label prop accepts any string; consumers provide localized text
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //
    // References:
    //   - USWDS Icon list: https://designsystem.digital.gov/components/icon-list/

    withDefaults(defineProps<{
        /** aria-label for the list. */
        label?: string;
    }>(), {
        label: undefined,
    });

</script>

<template>
    <!-- IconList.vue -->
    <ul
        class="icon-list"
        :aria-label="label"
    >
        <slot />
    </ul>
</template>
