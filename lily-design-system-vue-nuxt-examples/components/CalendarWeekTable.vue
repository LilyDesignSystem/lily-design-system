<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useAttrs } from "vue";
import { warnMissingName } from "./dev-warning";
import { attachGrid } from "./widget-keys";
// CalendarWeekTable component
//
// A calendar grid for a grid of the seven days of one week: seven day columns. A structural wrapper like CalendarTable:
// a <table> with role="grid" and data-view="week"; the consumer supplies the
// head, body and rows by reusing the CalendarTable* sub-elements.
//
// Props:
//   label — string, required. Accessible name describing the period shown (e.g. "Week of 6 January 2025").
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
//   - data-view="week" lets consumer CSS and JS key on the view
//
// Internationalization:
//   - Consumer owns locale formatting (Intl) and all cell content
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - Reuse the CalendarTable* sub-elements; there are no CalendarWeekTable* sub-elements

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

warnMissingName("CalendarWeekTable", props.label, useAttrs()["aria-labelledby"]);

const rootRef = ref<HTMLElement | null>(null);
let detach: (() => void) | undefined;
onMounted(() => {
    detach = attachGrid(rootRef.value!);
});
onBeforeUnmount(() => detach?.());
</script>

<template>
    <!-- CalendarWeekTable.vue -->
    <table
        ref="rootRef"
        class="calendar-week-table"
        role="grid"
        :aria-label="label"
        data-view="week"
    >
        <caption v-if="caption">
            {{
                caption
            }}
        </caption>
        <slot />
    </table>
</template>
