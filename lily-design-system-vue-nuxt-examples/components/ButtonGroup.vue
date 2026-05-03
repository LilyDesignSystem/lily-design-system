<script setup lang="ts">

    // ButtonGroup component
    //
    // A wrapper that groups related buttons together. Renders a <div> with
    // role="group" and a required aria-label so assistive technology can
    // identify the group's purpose.
    //
    // Props:
    //   label    — string, REQUIRED. aria-label for the group.
    //   default slot — the related buttons.
    //   ...restProps — additional HTML attributes spread onto the <div> via $attrs.
    //
    // Syntax:
    //   <ButtonGroup label="Pagination">…</ButtonGroup>
    //
    // Examples:
    //   <ButtonGroup label="Document actions">
    //     <button>Save</button>
    //     <button>Cancel</button>
    //   </ButtonGroup>
    //
    // Accessibility:
    //   - role="group"
    //   - aria-label is REQUIRED to name the group
    //
    // Internationalization:
    //   - The label prop accepts any string; consumers provide localized text
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - label is required — non-optional in the interface
    //
    // References:
    //   - USWDS Button group: https://designsystem.digital.gov/components/button-group/

    withDefaults(defineProps<{
        /** Accessible group label (REQUIRED). */
        label: string;
    }>(), {});

</script>

<template>
    <!-- ButtonGroup.vue -->
    <div
        class="button-group"
        role="group"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
