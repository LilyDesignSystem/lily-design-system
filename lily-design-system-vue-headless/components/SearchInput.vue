<script setup lang="ts">

    // SearchInput component
    //
    // A headless search field using the native HTML <input type="search"> element.
    // Provides semantic search meaning and may trigger browser-specific behaviors
    // such as a clear button, search icon, or search-optimized mobile keyboard.
    // Commonly used for site-wide search bars, filtering lists, and query entry.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name via aria-label.
    //   value — string, default "". Current search text; bindable with v-model.
    //   required — boolean, default false. Whether the field must be filled before form submission.
    //   disabled — boolean, default false. Whether the input is disabled.
    //   ...restProps — additional HTML attributes spread onto the <input>.
    //
    // Syntax:
    //   <SearchInput label="Search" v-model />
    //
    // Examples:
    //   <!-- Required search with binding -->
    //   <SearchInput label="Filter products" v-model={query} required />
    //
    //   <!-- With placeholder and name -->
    //   <SearchInput label="Search articles" v-model placeholder="Type to search..." name="q" />
    //
    // Keyboard:
    //   - Escape: clears the search field (browser-native behavior for search inputs)
    //   - Enter: submits the containing form (standard input behavior)
    //
    // Accessibility:
    //   - aria-label provides the accessible name since there is no visible <label> element
    //   - Native <input type="search"> has implicit search semantics
    //
    // Internationalization:
    //   - The label prop externalizes the accessible name for localization
    //   - Placeholder text should be provided via restProps for localization
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Value uses defineModel() for two-way binding with v-model
    //   - No visible <label> element — relies on aria-label
    //
    // References:
    //   - MDN input type="search": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/search
    //   - WAI-ARIA Search Role: https://www.w3.org/WAI/ARIA/apg/patterns/search/

    withDefaults(defineProps<{
        /** Accessible label. */
        label: string;
        /** Whether required. */
        required?: boolean;
        /** Whether disabled. */
        disabled?: boolean;
    }>(), {
        required: false,
        disabled: false,
    });

    const modelValue = defineModel<string>({ default: "" });

</script>

<template>
    <!-- SearchInput.vue -->
    <input
        class="search"
        type="search"
        :aria-label="label"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
