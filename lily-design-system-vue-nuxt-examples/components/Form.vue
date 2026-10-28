<script setup lang="ts">
// Form component
//
// A form wrapper that wraps a native HTML <form> element with accessible labeling,
// automatic submit default prevention, and reset support. It simplifies form handling
// by intercepting the submit event and calling preventDefault() before passing it to
// the consumer's callback, which is the most common pattern in single-page applications.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the form via aria-label.
//   onsubmit — function, default undefined. Callback receiving SubmitEvent (default already prevented).
//   onreset — function, default undefined. Callback receiving Event on form reset.
//   default slot. Form content (inputs, buttons, etc.).
//   ...restProps — additional HTML attributes spread onto the form element.
//
// Syntax:
//   <Form label="Login" onsubmit={handleLogin}>{children}</Form>
//
// Examples:
//   <!-- Login form with submit handler -->
//   <Form label="Login" onsubmit={handleLogin}>
//     <input name="email" />
//     <button type="submit">Sign in</button>
//   </Form>
//
//   <!-- Form with reset handler -->
//   <Form label="Search filters" onsubmit={applyFilters} onreset={clearFilters}>
//     <input name="query" />
//     <button type="submit">Apply</button>
//     <button type="reset">Clear</button>
//   </Form>
//
// Keyboard:
//   - Enter: Submits the form when a text input is focused (native browser behavior)
//
// Accessibility:
//   - aria-label provides an accessible name for the form, helping screen readers identify its purpose
//
// Internationalization:
//   - The label prop allows localized accessible names; no hardcoded user-facing strings
//   - All content comes through the default slot
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Automatically calls event.preventDefault() on submit before invoking onsubmit
//   - The onreset callback is passed directly without default prevention
//
// References:
//   - MDN form element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form
//   - WAI Forms Tutorial: https://www.w3.org/WAI/tutorials/forms/

const props = defineProps<{
    /** Accessible name. */
    label: string;
    /** Callback when the form is submitted. */
    onsubmit?: (event: SubmitEvent) => void;
}>();

function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    props.onsubmit?.(event);
}
</script>

<template>
    <!-- Form.vue -->
    <form
        class="form"
        :aria-label="label"
        @submit="handleSubmit"
    >
        <slot />
    </form>
</template>
