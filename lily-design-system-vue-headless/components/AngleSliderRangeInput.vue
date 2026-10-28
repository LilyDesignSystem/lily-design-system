<script setup lang="ts">
// AngleSliderRangeInput component
//
// A headless slider for selecting an angle value (0–360 degrees). Built on
// the native <input type="range"> with full ARIA slider semantics. Useful
// for rotation controls, compass direction pickers, hue angle selectors,
// or any circular/angular value input.
//
// Props:
//   className — string, optional. CSS class name.
//   value           — number, default 0, bindable. Current angle in degrees.
//   min             — number, default 0. Minimum angle.
//   max             — number, default 360. Maximum angle.
//   step            — number, default 1. Step increment.
//   label           — string, required. Accessible label for the slider.
//   disabled        — boolean, default false. Whether the slider is disabled.
//   name            — string, optional. Form field name for submission.
//   id              — string, optional. Element ID.
//   valueTextSuffix — string, default "°". Suffix for aria-valuetext
//                     (e.g., "°" makes "90°" for screen readers).
//   ...restProps    — additional HTML attributes spread onto <input>.
//
// Syntax:
//   <AngleSliderRangeInput label="Rotation" v-model={angle} />
//
// Examples:
//   <!-- Basic angle slider -->
//   <AngleSliderRangeInput label="Rotation" v-model={angle} />
//
//   <!-- Stepped compass direction -->
//   <AngleSliderRangeInput label="Direction" value={90} step={15} />
//
//   <!-- Custom range with suffix -->
//   <AngleSliderRangeInput label="Hue" min={0} max={360}
//     valueTextSuffix=" degrees" v-model={hue} />
//
//   <!-- Disabled slider -->
//   <AngleSliderRangeInput label="Locked angle" value={45} disabled />
//
// Keyboard:
//   - Arrow Right / Arrow Up: Increase value by step
//   - Arrow Left / Arrow Down: Decrease value by step
//   - Home: Set to min value
//   - End: Set to max value
//   (All provided by native <input type="range"> behavior.)
//
// Accessibility:
//   - Implicit slider role from <input type="range">
//   - aria-label provides accessible name
//   - aria-valuemin, aria-valuemax, aria-valuenow for range semantics
//   - aria-valuetext provides human-readable value (e.g., "90°")
//
// Internationalization:
//   - Label text comes through the label prop
//   - Value text suffix (e.g., "°" or " degrees") via valueTextSuffix prop
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Use native <input type="range">, not custom slider markup
//   - The value prop must use defineModel() for two-way binding
//   - aria-valuetext is derived from value + valueTextSuffix
//
// References:
//   - WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/slider/

import { computed } from "vue";

const props = withDefaults(
    defineProps<{
        /** Minimum angle */
        min?: number;
        /** Maximum angle */
        max?: number;
        /** Step increment */
        step?: number;
        /** Accessible label for the slider */
        label: string;
        /** Whether the slider is disabled */
        disabled?: boolean;
        /** Form field name */
        name?: string;
        /** Element ID */
        id?: string;
        /** Suffix for the value text (default: "°") */
        valueTextSuffix?: string;
    }>(),
    {
        min: 0,
        max: 360,
        step: 1,
        disabled: false,
        name: undefined,
        id: undefined,
        valueTextSuffix: "°",
    },
);

const modelValue = defineModel<number>({ default: 0 });

const valueText = computed(() => `${modelValue.value}${props.valueTextSuffix}`);
</script>

<template>
    <!-- AngleSliderRangeInput.vue -->
    <input
        class="angle-slider-range-input"
        type="range"
        v-model="modelValue"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        :name="name"
        :id="id"
        :aria-label="label"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="modelValue"
        :aria-valuetext="valueText"
    />
</template>
