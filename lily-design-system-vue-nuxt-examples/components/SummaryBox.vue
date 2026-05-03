<script setup lang="ts">

    // SummaryBox component
    //
    // A boxed callout highlighting key takeaways or next steps from a longer
    // page. Renders <aside class="summary-box"> with an <h3> heading and a
    // body <div>. Defaults aria-label to the heading text when no override is
    // supplied.
    //
    // Props:
    //   heading — string, REQUIRED. Box heading.
    //   label   — string, optional. aria-label override (defaults to heading).
    //   default slot — body content.
    //
    // Syntax:
    //   <SummaryBox heading="Key takeaways">…</SummaryBox>
    //
    // Accessibility:
    //   - <aside> as a complementary landmark
    //   - aria-label defaults to the heading; consumer may override
    //
    // Internationalization:
    //   - All text strings come from props
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - heading is required
    //
    // References:
    //   - USWDS Summary box: https://designsystem.digital.gov/components/summary-box/

    import { computed } from "vue";

    const props = withDefaults(defineProps<{
        /** Box heading (REQUIRED). */
        heading: string;
        /** aria-label override; defaults to heading. */
        label?: string;
    }>(), {
        label: undefined,
    });

    const accessibleLabel = computed<string>(() => props.label ?? props.heading);

</script>

<template>
    <!-- SummaryBox.vue -->
    <aside
        class="summary-box"
        :aria-label="accessibleLabel"
    >
        <h3 class="summary-box-heading">{{ heading }}</h3>
        <div class="summary-box-body">
            <slot />
        </div>
    </aside>
</template>
