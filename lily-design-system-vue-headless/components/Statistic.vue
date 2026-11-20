<script setup lang="ts">
// Statistic component
//
// A numeric value display with title, prefix, and suffix. Renders a
// role="group" container with a title and a value composed of optional
// prefix slot, the value text, and an optional suffix slot.
//
// Props:
//   title  — string, REQUIRED. Statistic label/heading.
//   value  — string, REQUIRED. Pre-formatted value text.
//   label  — string, optional. aria-label override (defaults to "{title}: {value}").
//   slot prefix — element rendered before the value (e.g., currency symbol).
//   slot suffix — element rendered after the value (e.g., unit or %).
//
// Syntax:
//   <Statistic title="Active users" value="12,345">
//     <template #prefix>$</template>
//     <template #suffix>%</template>
//   </Statistic>
//
// Accessibility:
//   - role="group" with aria-label combining title and value (overridable).
//
// Internationalization:
//   - All text content is consumer-supplied. Number formatting is the
//     consumer's responsibility — pass a pre-formatted string.
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - title and value are required — non-optional in the interface.
//
// References:
//   - Ant Design Statistic: https://ant.design/components/statistic

import { computed, useSlots } from "vue";

const props = withDefaults(
    defineProps<{
        /** Statistic label/heading (REQUIRED). */
        title: string;
        /** Pre-formatted value text (REQUIRED). */
        value: string;
        /** aria-label override. */
        label?: string;
        /** The change, in words that name what it is compared with ("0.5 more than October 2024"). */
        change?: string;
        /** The direction of the change, as data-trend for the theme; the words in `change` carry it for everyone. */
        trend?: "up" | "down" | "flat";
        /** When the value was measured, as an ISO 8601 date or date-time for the <time> element. */
        asOf?: string;
        /** When the value was measured, in words; the as-of line renders only with it. */
        asOfLabel?: string;
    }>(),
    {
        label: undefined,
        change: undefined,
        trend: undefined,
        asOf: undefined,
        asOfLabel: undefined,
    },
);

const slots = useSlots();

const ariaLabel = computed<string>(() => props.label ?? `${props.title}: ${props.value}`);
</script>

<template>
    <!-- Statistic.vue -->
    <div
        class="statistic"
        role="group"
        :aria-label="ariaLabel"
    >
        <div class="statistic-title">{{ title }}</div>
        <div class="statistic-value">
            <span
                v-if="slots.prefix"
                class="statistic-prefix"
            >
                <slot name="prefix" />
            </span>
            {{ value }}
            <span
                v-if="slots.suffix"
                class="statistic-suffix"
            >
                <slot name="suffix" />
            </span>
        </div>
        <div
            v-if="change"
            class="statistic-change"
            :data-trend="trend"
        >
            {{ change }}
        </div>
        <time
            v-if="asOfLabel"
            class="statistic-as-of"
            :datetime="asOf"
            >{{ asOfLabel }}</time
        >
    </div>
</template>
