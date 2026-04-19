<script setup lang="ts">

    // FiveFaceRatingPickerButton component
    //
    // A headless button representing one face in a five-face rating picker. Renders
    // a <button> with aria-pressed to indicate the selected state and data-value for
    // consumer CSS targeting. Each button represents a satisfaction level (1-5) with
    // a descriptive label (e.g. "Very bad", "Good"). Commonly used in satisfaction
    // surveys, feedback forms, and experience ratings.
    //
    // Props:
    //   value — number, required. The rating value (1-5).
    //   label — string, required. Accessible name for the button (e.g. "Very bad", "Good").
    //   selected — boolean, default false. Whether this face is currently selected.
    //   disabled — boolean, default false. Whether the button is disabled.
    //   onclick — (event: MouseEvent) => void, optional. Click handler.
    //   ...restProps — additional HTML attributes spread onto the <button>.
    //
    // Syntax:
    //   <FiveFaceRatingPickerButton value={3} label="Okay" onclick={handleSelect} />
    //
    // Examples:
    //   <!-- Selected face button -->
    //   <FiveFaceRatingPickerButton value={4} label="Good" selected={true} onclick={handleSelect} />
    //   <!-- Disabled face button -->
    //   <FiveFaceRatingPickerButton value={1} label="Very bad" disabled={true} />
    //
    // Keyboard:
    //   - Tab: Move focus to the button
    //   - Enter: Activate the button (native button behavior)
    //   - Space: Activate the button (native button behavior)
    //
    // Accessibility:
    //   - aria-label provides an accessible name describing the face level
    //   - aria-pressed indicates whether the face is currently selected
    //   - data-value exposes the rating value for consumer CSS selectors
    //
    // Internationalization:
    //   - The label prop provides the accessible name; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Compound component: used as a child within FiveFaceRatingPicker
    //   - Consumer can use [data-value] CSS selectors for value-based styling
    //
    // References:
    //   - WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/

    withDefaults(defineProps<{
        /** The rating value (1-5). */
        value: number;
        /** Accessible name for the button (e.g. "Very bad", "Good"). */
        label: string;
        /** Whether this face is currently selected. */
        selected?: boolean;
        /** Whether the button is disabled. */
        disabled?: boolean;
    }>(), {
        selected: false,
        disabled: false,
    });

</script>

<template>
    <!-- FiveFaceRatingPickerButton.vue -->
    <button
        class="five-face-rating-picker-button"
        type="button"
        :aria-label="label"
        :aria-pressed="selected"
        :disabled="disabled"
        :data-value="value"
    >{{ label }}</button>
</template>
