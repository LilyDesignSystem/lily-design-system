<script setup lang="ts">

    // Combobox component
    //
    // A headless combobox combining a text input with a dropdown listbox of
    // suggestions for autocomplete or type-ahead search experiences. Users type into
    // the input to filter suggestions, then select from matching options in the
    // dropdown. Commonly used for search fields, address inputs, tag selectors, and
    // choosing from large option sets.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name via aria-label on both input and listbox.
    //   value — string, default "". Bindable current text input value.
    //   open — boolean, default false. Bindable dropdown visibility state.
    //   default slot. Option elements rendered inside the listbox dropdown.
    //   ...restProps — additional HTML attributes spread onto the wrapper <div>.
    //
    // Syntax:
    //   <Combobox label="Search" v-model v-model:open>
    //     <div role="option" tabindex="-1">Option 1</div>
    //   </Combobox>
    //
    // Examples:
    //   <!-- Combobox with filtered options -->
    //   <Combobox label="Select a fruit" v-model v-model:open>
    //     {#each filtered as option}
    //       <div role="option" tabindex="-1" onclick={() => { value = option; open = false; }}>
    //         {option}
    //       </div>
    //     {/each}
    //   </Combobox>
    //
    // Keyboard:
    //   - Escape: Close the dropdown listbox
    //
    // Accessibility:
    //   - role="combobox" on the input identifies it as a combobox widget
    //   - aria-expanded reflects the open state for screen readers
    //   - aria-controls links the input to the associated listbox by ID
    //   - aria-autocomplete="list" indicates suggestions are provided via a list
    //   - role="listbox" on the dropdown identifies selectable options
    //
    // Internationalization:
    //   - The label prop provides the accessible name; no hardcoded strings
    //   - All option content is provided by consumers through the default slot
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Generates a unique listboxId for the aria-controls relationship
    //   - Consumer is responsible for filtering options based on value
    //
    // References:
    //   - WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

    const props = defineProps<{
        /** Accessible label. */
        label: string;
    }>();

    const modelValue = defineModel<string>({ default: "" });

    const open = defineModel<boolean>("open", { default: false });

    const listboxId = `combobox-${Math.random().toString(36).slice(2, 9)}`;

    function onkeydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            event.preventDefault();
            open.value = false;
        }
    }

</script>

<template>
    <!-- Combobox.vue -->
    <div
        class="combobox"
    >
        <input
            type="text"
            role="combobox"
            :aria-label="label"
            :aria-expanded="open"
            :aria-controls="listboxId"
            aria-autocomplete="list"
            v-model="modelValue"
            @keydown="onkeydown"
        />
                <div v-if="open"
                role="listbox"
                :id="listboxId"
                :aria-label="label"
            >
                <slot />
            </div>
    </div>
</template>
