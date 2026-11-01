<script setup lang="ts">
// Slider component
//
// A headless range slider using the native HTML <input type="range"> element.
// Allows users to select a numeric value by dragging a handle along a track.
// Commonly used for adjusting settings like volume, brightness, price ranges,
// or timelines. Provides two-way binding and configurable min/max/step values.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   value — number, default 50. Current slider value; bindable with v-model.
//   min — number, default 0. Minimum allowed value.
//   max — number, default 100. Maximum allowed value.
//   step — number, default 1. Increment between allowed values.
//   disabled — boolean, default false. Whether the slider is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <Slider label="Volume" v-model min={0} max={100} step={5} />
//
// Examples:
//   <!-- Brightness control -->
//   <Slider label="Brightness" v-model={brightness} min={0} max={100} />
//
//   <!-- Price range with step -->
//   <Slider label="Max price" v-model={maxPrice} min={0} max={1000} step={10} />
//
// Keyboard:
//   - Left Arrow/Down Arrow: decrease value by one step (native behavior)
//   - Right Arrow/Up Arrow: increase value by one step (native behavior)
//   - Home: set to minimum value (native behavior)
//   - End: set to maximum value (native behavior)
//   - Page Up/Down: increase/decrease by a larger step (browser-dependent)
//
// Accessibility:
//   - aria-label provides the accessible name for the slider
//   - Native <input type="range"> has implicit slider role
//   - min, max, step attributes communicate range to assistive technology
//
// Internationalization:
//   - The label prop externalizes the accessible name for localization
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Value uses defineModel() for two-way binding with v-model
//   - Relies entirely on native <input type="range"> behavior
//
// References:
//   - WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/slider/
//   - MDN input type="range": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range

import { ref } from "vue";
import { useFormReset } from "./form-reset";

withDefaults(
    defineProps<{
        /** Accessible label. */
        label: string;
        /** Minimum value. */
        min?: number;
        /** Maximum value. */
        max?: number;
        /** Step increment. */
        step?: number;
        /** Whether disabled. */
        disabled?: boolean;
    }>(),
    {
        min: 0,
        max: 100,
        step: 1,
        disabled: false,
    },
);

const modelValue = defineModel<number>({ default: 50 });
const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
useFormReset(modelValue, field);
</script>

<template>
    <!-- Slider.vue -->
    <input
        class="slider"
        type="range"
        :aria-label="label"
        ref="field"
        v-model="modelValue"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
    />
</template>
