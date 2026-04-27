<script setup lang="ts">

    // GovernmentBanner component
    //
    // A banner identifying a website as belonging to a government, with an
    // expandable details panel. Renders an <aside> landmark with a header
    // containing a toggle <button>, plus a panel <div> referenced via
    // aria-controls. When the consumer manages the `expanded` prop, the panel
    // shows/hides via the `hidden` attribute.
    //
    // Props:
    //   label       — string, REQUIRED. aria-label for the aside.
    //   headerText  — string, REQUIRED. Top headline text.
    //   expanded    — boolean, default false. Whether the details panel is open.
    //   expandLabel — string, REQUIRED. Toggle button text.
    //   default slot — details panel content.
    //
    // Emits:
    //   toggle(event: MouseEvent) — fired when the toggle button is clicked.
    //
    // Syntax:
    //   <GovernmentBanner
    //     label="Official government website"
    //     headerText="An official website of the United States government"
    //     expandLabel="Here's how you know"
    //     :expanded="open"
    //     @toggle="open = !open"
    //   >…</GovernmentBanner>
    //
    // Accessibility:
    //   - <aside> as a complementary landmark with aria-label
    //   - toggle <button> has aria-expanded and aria-controls referencing the
    //     panel id
    //   - panel uses the `hidden` attribute when not expanded
    //
    // Internationalization:
    //   - All text strings come from props
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - label, headerText, expandLabel are required
    //   - panel id is generated with Math.random
    //
    // References:
    //   - USWDS Banner: https://designsystem.digital.gov/components/banner/

    withDefaults(defineProps<{
        /** aria-label for the aside (REQUIRED). */
        label: string;
        /** Top headline text (REQUIRED). */
        headerText: string;
        /** Toggle button label (REQUIRED). */
        expandLabel: string;
        /** Whether the details panel is open. */
        expanded?: boolean;
    }>(), {
        expanded: false,
    });

    defineEmits<{
        (e: "toggle", event: MouseEvent): void;
    }>();

    const panelId: string = `government-banner-panel-${Math.random().toString(36).slice(2, 9)}`;

</script>

<template>
    <!-- GovernmentBanner.vue -->
    <aside
        class="government-banner"
        :aria-label="label"
    >
        <header class="government-banner-header">
            <span class="government-banner-text">{{ headerText }}</span>
            <button
                type="button"
                class="government-banner-toggle"
                :aria-expanded="expanded"
                :aria-controls="panelId"
                @click="$emit('toggle', $event)"
            >
                {{ expandLabel }}
            </button>
        </header>
        <div
            class="government-banner-details"
            :id="panelId"
            :hidden="!expanded"
        >
            <slot />
        </div>
    </aside>
</template>
