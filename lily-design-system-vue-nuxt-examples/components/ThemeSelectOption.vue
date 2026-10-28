<script setup lang="ts">
// ThemeSelectOption component
//
// A single <option> element for use inside a ThemeSelect dropdown. Renders a
// native <option> with a theme value and label text. Supports selected and
// disabled states via native HTML attributes. Used as a compound child of
// ThemeSelect to define available theme choices such as light, dark, or
// high-contrast modes.
//
// Props:
//   className — string, optional. CSS class name.
//   value — string, required. The theme identifier submitted when selected.
//   selected — boolean, default false. Whether this option is pre-selected.
//   disabled — boolean, default false. Whether this option is disabled.
//   default slot. The visible label text for the theme option.
//   ...restProps — additional HTML attributes spread onto the <option>.
//
// Syntax:
//   <ThemeSelectOption value="dark">Dark</ThemeSelectOption>
//
// Examples:
//   <!-- Theme options inside a ThemeSelect -->
//   <ThemeSelect label="Theme" v-model={theme}>
//     <ThemeSelectOption value="light">Light</ThemeSelectOption>
//     <ThemeSelectOption value="dark">Dark</ThemeSelectOption>
//     <ThemeSelectOption value="high-contrast">High Contrast</ThemeSelectOption>
//     <ThemeSelectOption value="system">System Default</ThemeSelectOption>
//   </ThemeSelect>
//
// Keyboard:
//   None directly — keyboard behavior is managed by the parent <select> element
//   (Up/Down arrows, Home/End, type-ahead search).
//
// Accessibility:
//   - Native <option> element provides built-in accessibility via the parent <select>
//   - Screen readers announce the option text and selected state automatically
//
// Internationalization:
//   - Option label text comes through the default slot
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Must be used inside a ThemeSelect component for proper semantics
//   - Do not add ARIA attributes — native <option> provides all accessibility
//
// References:
//   - HTML option element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option

withDefaults(
    defineProps<{
        /** The theme value for this option. */
        value: string;
        /** Whether this option is pre-selected. */
        selected?: boolean;
        /** Whether this option is disabled. */
        disabled?: boolean;
    }>(),
    {
        selected: false,
        disabled: false,
    },
);
</script>

<template>
    <!-- ThemeSelectOption.vue -->
    <option
        class="theme-select-option"
        :value="value"
        :selected="selected"
        :disabled="disabled"
    >
        <slot />
    </option>
</template>
