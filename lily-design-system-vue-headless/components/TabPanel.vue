<script setup lang="ts">

    // TabPanel component
    //
    // A content panel associated with a tab in a tab bar. Renders a div with
    // role="tabpanel". When `labelledBy` is provided, the panel sets
    // aria-labelledby and omits aria-label; otherwise it uses aria-label.
    // Hidden via the native hidden attribute when not selected.
    //
    // Props:
    //   label       — string, REQUIRED. aria-label fallback for the panel.
    //   labelledBy  — string, optional. ID of the controlling tab button;
    //                 when set, used as aria-labelledby and aria-label is omitted.
    //   selected    — boolean, default false. Whether the panel is selected.
    //   default slot — panel content.
    //
    // Syntax:
    //   <TabPanel label="Details" :labelled-by="`tab-${id}`" :selected="active === 1">
    //     <p>Details content…</p>
    //   </TabPanel>
    //
    // Accessibility:
    //   - role="tabpanel"
    //   - aria-labelledby links to the controlling tab when provided
    //   - tabindex="0" so the panel is focusable for keyboard users
    //
    // Internationalization:
    //   - The label prop accepts any string
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - label is required
    //   - When labelledBy is provided, aria-label is omitted

    withDefaults(defineProps<{
        /** Accessible label fallback (REQUIRED). */
        label: string;
        /** ID of the controlling tab button. */
        labelledBy?: string;
        /** Whether the panel is selected. */
        selected?: boolean;
    }>(), {
        labelledBy: undefined,
        selected: false,
    });

</script>

<template>
    <!-- TabPanel.vue -->
    <div
        class="tab-panel"
        role="tabpanel"
        :aria-label="labelledBy ? undefined : label"
        :aria-labelledby="labelledBy"
        :hidden="!selected"
        tabindex="0"
    >
        <slot />
    </div>
</template>
