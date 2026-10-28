<script setup lang="ts">
// DataFilterForm component
//
// A headless data filter container that wraps filter controls in a semantic <form>
// with role="search" and accessible labelling. It prevents default form submission,
// allowing the consumer's onsubmit callback to handle filter application
// programmatically. Suitable for client-side filtering, AJAX-based search, or any
// scenario where a full page reload is undesirable.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the filter region via aria-label.
//   onsubmit — (event: SubmitEvent) => void, default undefined. Called when the form is submitted.
//   onreset — (event: Event) => void, default undefined. Called when the form is reset.
//   default slot. Filter controls rendered inside the form.
//   ...restProps — additional HTML attributes spread onto the <form>.
//
// Syntax:
//   <DataFilterForm label="Filter results" onsubmit={applyFilters}>
//     <button type="submit">Apply</button>
//   </DataFilterForm>
//
// Examples:
//   <!-- Filter with category select, submit, and reset -->
//   <DataFilterForm label="Filter results" onsubmit={applyFilters} onreset={clearFilters}>
//     <label>Category <select>...</select></label>
//     <button type="submit">Apply</button>
//     <button type="reset">Clear</button>
//   </DataFilterForm>
//
// Keyboard:
//   - None — passive container; keyboard behavior is determined by consumer-provided form controls
//
// Accessibility:
//   - role="search" identifies the form as a search landmark for assistive technology
//   - aria-label provides an accessible name for the search region
//
// Internationalization:
//   - The label prop provides the accessible name; no hardcoded strings
//   - All filter controls and button text are provided by consumers
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Form submission is prevented by default; consumer handles logic in onsubmit
//
// References:
//   - WAI-ARIA Landmark Roles: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
//   - ARIA search role: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/search_role

const props = defineProps<{
    /** Accessible name for the filter region. */
    label: string;
    /** Callback when the form is submitted. */
    onsubmit?: (event: SubmitEvent) => void;
    /** Callback when the form is reset. */
    onreset?: (event: Event) => void;
}>();

function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    props.onsubmit?.(event);
}
</script>

<template>
    <!-- DataFilterForm.vue -->
    <form
        class="data-filter-form"
        role="search"
        :aria-label="label"
        @submit="handleSubmit"
    >
        <slot />
    </form>
</template>
