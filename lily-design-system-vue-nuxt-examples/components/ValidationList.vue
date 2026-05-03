<script setup lang="ts">

    // ValidationList component
    //
    // A live-feedback list of input validation rules with pending, passed, and
    // failed states. Renders <ul class="validation-list" aria-live="polite">.
    // The aria-live polite region is the headless contract that makes status
    // changes announced to screen readers.
    //
    // Props:
    //   label — string, REQUIRED. aria-label for the list (typically describes
    //           the field being validated).
    //   default slot — ValidationListItem children.
    //
    // Syntax:
    //   <ValidationList label="Password requirements">
    //     <ValidationListItem status="passed">8+ characters</ValidationListItem>
    //   </ValidationList>
    //
    // Accessibility:
    //   - aria-label REQUIRED to name the rule list
    //   - aria-live="polite" announces status changes
    //
    // Internationalization:
    //   - The label prop accepts any string; consumers provide localized text
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - label is required
    //   - aria-live="polite" is always present
    //
    // References:
    //   - USWDS Validation: https://designsystem.digital.gov/components/validation/

    withDefaults(defineProps<{
        /** Accessible list label (REQUIRED). */
        label: string;
    }>(), {});

</script>

<template>
    <!-- ValidationList.vue -->
    <ul
        class="validation-list"
        :aria-label="label"
        aria-live="polite"
    >
        <slot />
    </ul>
</template>
