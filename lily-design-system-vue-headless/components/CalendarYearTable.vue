<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useAttrs } from "vue";
import { warnMissingName } from "./dev-warning";
import { attachGrid } from "./widget-keys";
// CalendarYearTable component
//
// A calendar grid for a grid of the twelve months of one year (typically 3 x 4 or 4 x 3 month cells). A structural wrapper like CalendarTable:
// a <table> with role="grid" and data-view="year"; the consumer supplies the
// head, body and rows by reusing the CalendarTable* sub-elements.
//
// Props:
//   label — string, required. Accessible name describing the period shown (e.g. "2025").
//   caption — string, optional. Visible caption text displayed above the table.
//   default slot. CalendarTableHead, CalendarTableBody, CalendarTableFoot elements.
//   ...restProps — additional HTML attributes spread onto the <table>
//     (the consumer class is merged after the base class by Vue).
//
// Keyboard:
//   Arrows, Home, End, Ctrl+Home, Ctrl+End, PageUp, PageDown, Enter, F2 and Escape over the cells, with one tab stop; data-consumer-keys on the root turns them off.
//
// Accessibility:
//   - role="grid" identifies the table as an interactive grid widget
//   - aria-label names the period; <caption> gives a visible name
//   - data-view="year" lets consumer CSS and JS key on the view
//
// Internationalization:
//   - Consumer owns locale formatting (Intl) and all cell content
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - Reuse the CalendarTable* sub-elements; there are no CalendarYearTable* sub-elements

const props = withDefaults(
    defineProps<{
        /** Accessible name describing the period shown. */
        label: string;
        /** Visible caption for the table. */
        caption?: string;
    }>(),
    {
        caption: undefined,
    },
);

warnMissingName("CalendarYearTable", props.label, useAttrs()["aria-labelledby"]);

const rootRef = ref<HTMLElement | null>(null);
let detach: (() => void) | undefined;
onMounted(() => {
    detach = attachGrid(rootRef.value!);
});
onBeforeUnmount(() => detach?.());
</script>

<template>
    <!-- CalendarYearTable.vue -->
    <table
        ref="rootRef"
        class="calendar-year-table"
        role="grid"
        :aria-label="label"
        data-view="year"
    >
        <caption v-if="caption">
            {{
                caption
            }}
        </caption>
        <slot />
    </table>
</template>
