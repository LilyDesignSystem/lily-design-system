<script setup lang="ts">

    // ValidationListItem component
    //
    // One validation rule in a ValidationList with a status of pending,
    // passed, or failed. The status is exposed as data-status on the <li>
    // for consumer styling.
    //
    // Props:
    //   status — "pending" | "passed" | "failed", default "pending".
    //            Rendered as data-status attribute.
    //   label  — string, optional. aria-label override.
    //   default slot — rule text (e.g., "At least 8 characters").
    //
    // Syntax:
    //   <ValidationListItem status="passed">8+ characters</ValidationListItem>
    //
    // Accessibility:
    //   - data-status is for styling (not announced)
    //   - When the surrounding ValidationList has aria-live="polite",
    //     changes to text content are announced
    //   - Consumers are expected to convey status to screen readers via the
    //     rule text itself or via additional screen-reader-only content
    //
    // Internationalization:
    //   - The default slot accepts any text; consumers provide localized text
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - status defaults to "pending"
    //
    // References:
    //   - USWDS Validation: https://designsystem.digital.gov/components/validation/

    withDefaults(defineProps<{
        /** Validation status. */
        status?: "pending" | "passed" | "failed";
        /** aria-label override. */
        label?: string;
    }>(), {
        status: "pending",
        label: undefined,
    });

</script>

<template>
    <!-- ValidationListItem.vue -->
    <li
        class="validation-list-item"
        :data-status="status"
        :aria-label="label"
    >
        <slot />
    </li>
</template>
