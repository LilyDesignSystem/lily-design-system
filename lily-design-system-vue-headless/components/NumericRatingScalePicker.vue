<script setup lang="ts">
// NumericRatingScalePicker: a 0 to 10 rating such as a numeric pain rating scale (spec/healthcare-ui item 12). A fieldset
// named by its legend, one native radio per number, the consumer's anchor words linked to the end radios. v-model.
// Props: NumericRatingScalePicker.md.
import { computed, useAttrs } from "vue";
import { warnMissingName } from "./dev-warning";

const props = withDefaults(
    defineProps<{
        /** The question, rendered as the legend. */
        label: string;
        min?: number;
        max?: number;
        minLabel?: string;
        maxLabel?: string;
        name?: string;
        required?: boolean;
    }>(),
    { min: 0, max: 10, name: "rating", required: false },
);
const value = defineModel<string>({ default: "" });
warnMissingName("NumericRatingScalePicker", props.label, useAttrs()["aria-labelledby"]);

const id = `numeric-rating-scale-picker-${Math.random().toString(36).slice(2, 9)}`;
const steps = computed(() =>
    Array.from({ length: Math.max(0, props.max - props.min + 1) }, (_, i) => props.min + i),
);
function describedBy(i: number) {
    if (i === 0 && props.minLabel) return `${id}-min`;
    if (i === steps.value.length - 1 && props.maxLabel) return `${id}-max`;
    return undefined;
}
</script>

<template>
    <!-- NumericRatingScalePicker.vue -->
    <fieldset class="numeric-rating-scale-picker">
        <legend class="numeric-rating-scale-picker-legend">{{ label }}</legend>
        <span
            v-if="minLabel"
            :id="`${id}-min`"
            class="numeric-rating-scale-picker-min-label"
            >{{ minLabel }}</span
        >
        <span class="numeric-rating-scale-picker-options">
            <label
                v-for="(step, i) in steps"
                :key="step"
                class="numeric-rating-scale-picker-option"
            >
                <input
                    type="radio"
                    :name="name"
                    :value="String(step)"
                    :checked="value === String(step)"
                    :required="required && i === 0"
                    :aria-describedby="describedBy(i)"
                    @change="value = String(step)"
                />
                {{ step }}
            </label>
        </span>
        <span
            v-if="maxLabel"
            :id="`${id}-max`"
            class="numeric-rating-scale-picker-max-label"
            >{{ maxLabel }}</span
        >
    </fieldset>
</template>
