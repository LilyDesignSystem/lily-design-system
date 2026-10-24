<script setup lang="ts">

    // StepListItem component
    //
    // One step in a step list with status of waiting, in progress, finished,
    // or error. Status is exposed as `data-status` for styling. When `current`
    // is true, `data-current` is set.
    //
    // Props:
    //   status  — "waiting" | "in-progress" | "finished" | "error",
    //             default "waiting".
    //   current — boolean, default false. When true, sets data-current.
    //   label   — string, optional. aria-label override.
    //   default slot — content (typically title and description).
    //
    // Syntax:
    //   <StepListItem status="in-progress" :current="true">Address</StepListItem>
    //
    // Accessibility:
    //   - data-current when current=true
    //   - aria-label optional
    //
    // Internationalization:
    //   - All text content is consumer-supplied.
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //
    // References:
    //   - WAI-ARIA aria-current: https://www.w3.org/TR/wai-aria-1.2/#aria-current

    type Status = "waiting" | "in-progress" | "finished" | "error";

    withDefaults(defineProps<{
        /** Step status. */
        status?: Status;
        /** When true, renders data-current. */
        current?: boolean;
        /** aria-label override. */
        label?: string;
    }>(), {
        status: "waiting",
        current: false,
        label: undefined,
    });

</script>

<template>
    <!-- StepListItem.vue -->
    <li
        class="step-list-item"
        :data-status="status"
        :data-current="current ? '' : undefined"
        :aria-label="label"
    >
        <slot />
    </li>
</template>
