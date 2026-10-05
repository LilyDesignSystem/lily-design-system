<script setup lang="ts">

    // EmptyState component
    //
    // A headless "nothing here yet" container. Heading, text and action are
    // supplied by the consumer as default-slot content. No icon. Not a live region.
    //
    // Props:
    //   label -- string, optional. When given, adds role="group" and aria-label.
    //   default slot -- consumer content.
    //   ...attrs -- fall through onto the root <div>.

    withDefaults(defineProps<{
        /** Optional accessible name; adds role="group". */
        label?: string;
    }>(), {
        label: undefined,
    });

</script>

<template>
    <!-- EmptyState.vue -->
    <div
        class="empty-state"
        :role="label ? 'group' : undefined"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
