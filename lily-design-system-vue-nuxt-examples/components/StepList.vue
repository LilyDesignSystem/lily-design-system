<script setup lang="ts">

    // StepList component
    //
    // An ordered list of step items showing progress through a multi-step
    // process. Renders an <ol> with optional aria-label and the current-step
    // index exposed as `data-current` for consumer styling hooks.
    //
    // Props:
    //   label   — string, optional. aria-label for the ordered list.
    //   current — number, optional. Index of current step (0-based).
    //   default slot — step-list-item children.
    //
    // Syntax:
    //   <StepList label="Checkout" :current="1">
    //     <StepListItem status="finished">Cart</StepListItem>
    //     <StepListItem status="in-progress" :current="true">Address</StepListItem>
    //     <StepListItem status="waiting">Payment</StepListItem>
    //   </StepList>
    //
    // Accessibility:
    //   - Native <ol> list semantics
    //   - aria-label optional
    //
    // Internationalization:
    //   - All text via children/props, no hardcoded strings.
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //
    // References:
    //   - WAI-ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/
    //   - Ant Design Steps: https://ant.design/components/steps

    withDefaults(defineProps<{
        /** aria-label for the ordered list. */
        label?: string;
        /** Index of current step (0-based). */
        current?: number;
    }>(), {
        label: undefined,
        current: undefined,
    });

</script>

<template>
    <!-- StepList.vue -->
    <ol
        class="step-list"
        :aria-label="label"
        :data-current="current"
    >
        <slot />
    </ol>
</template>
