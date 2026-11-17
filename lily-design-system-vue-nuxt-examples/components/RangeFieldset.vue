<script setup lang="ts">
// RangeFieldset component
//
// A headless two-thumb range: a <fieldset> with a visible <legend> and two native
// <input type="range"> on one scale, for the minimum and the maximum of a span of values.
// The thumbs cannot cross: a thumb moved past the other stops where the other is. Each
// input is its own form field, and a form reset puts both back (tasks.md P34-T1).
//
// Keyboard: native range keys on each thumb; Tab moves from the lower to the upper.
// References: https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/

import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { warnMissingName, warnMissingProp } from "./dev-warning";

const props = withDefaults(
    defineProps<{
        /** Visible name of the whole range. */
        legend: string;
        /** Accessible name of the lower thumb. */
        minimumLabel: string;
        /** Accessible name of the upper thumb. */
        maximumLabel: string;
        /** Lowest value either thumb can take. */
        min?: number;
        /** Highest value either thumb can take. */
        max?: number;
        /** Increment of both thumbs. */
        step?: number;
        /** Form field name of the lower value. */
        minimumName?: string;
        /** Form field name of the upper value. */
        maximumName?: string;
        /** Disables both thumbs. */
        disabled?: boolean;
    }>(),
    { min: 0, max: 100, step: 1, disabled: false },
);

const emit = defineEmits<{ change: [minimum: number, maximum: number] }>();

warnMissingProp(
    "RangeFieldset",
    "legend",
    props.legend,
    "The group of thumbs has no visible name.",
);
warnMissingName("RangeFieldset minimum", props.minimumLabel);
warnMissingName("RangeFieldset maximum", props.maximumLabel);

/** Lower value; v-model:minimum. */
const minimum = defineModel<number>("minimum");
/** Upper value; v-model:maximum. */
const maximum = defineModel<number>("maximum");

// The values a form reset returns to.
const initialMinimum = minimum.value ?? props.min;
const initialMaximum = maximum.value ?? props.max;

const lower = ref<HTMLInputElement | null>(null);
const upper = ref<HTMLInputElement | null>(null);

// The value attribute is what a form reset returns to, and Vue's :value binding writes
// it too, so a model change sets only the value property.
watch(minimum, (value) => {
    if (lower.value && value !== undefined) lower.value.value = String(value);
});
watch(maximum, (value) => {
    if (upper.value && value !== undefined) upper.value.value = String(value);
});

function move(which: "lower" | "upper") {
    const low = lower.value!;
    const high = upper.value!;
    if (which === "lower" && Number(low.value) > Number(high.value)) low.value = high.value;
    if (which === "upper" && Number(high.value) < Number(low.value)) high.value = low.value;
    minimum.value = Number(low.value);
    maximum.value = Number(high.value);
    emit("change", minimum.value, maximum.value);
}

// A form reset restores the inputs after the reset event, so read them on the next task.
let form: HTMLFormElement | null = null;
function onReset() {
    setTimeout(() => {
        if (lower.value) minimum.value = Number(lower.value.value);
        if (upper.value) maximum.value = Number(upper.value.value);
    }, 0);
}
onMounted(() => {
    form = lower.value?.form ?? null;
    form?.addEventListener("reset", onReset);
});
onBeforeUnmount(() => form?.removeEventListener("reset", onReset));
</script>

<template>
    <!-- RangeFieldset.vue -->
    <fieldset
        class="range-fieldset"
        :disabled="disabled"
    >
        <legend class="range-fieldset-legend">{{ legend }}</legend>
        <input
            ref="lower"
            class="range-fieldset-minimum"
            type="range"
            :aria-label="minimumLabel"
            :name="minimumName"
            :min="min"
            :max="max"
            :step="step"
            :defaultValue="initialMinimum"
            @input="move('lower')"
        />
        <input
            ref="upper"
            class="range-fieldset-maximum"
            type="range"
            :aria-label="maximumLabel"
            :name="maximumName"
            :min="min"
            :max="max"
            :step="step"
            :defaultValue="initialMaximum"
            @input="move('upper')"
        />
    </fieldset>
</template>
