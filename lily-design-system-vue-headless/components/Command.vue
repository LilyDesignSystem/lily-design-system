<script setup lang="ts">
// Command component
//
// A headless command palette providing a searchable list of actions or items.
// It renders a search region containing a text input and a listbox for results.
// The search value is bindable, allowing consumers to implement their own filtering
// logic and dynamically update the listbox content. Commonly used for Ctrl+K quick-access
// command palettes, searchable menus, and action launchers.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the search region and input.
//   placeholder — string, default undefined. Placeholder text for the search input.
//   value — string, default "". Current search text; bindable via v-model.
//   default slot. Listbox content, typically option or command items.
//   ...restProps — additional HTML attributes spread onto the outer <div>.
//
// Syntax:
//   <Command label="Command palette" placeholder="Search..." v-model={query}>
//     <div role="option">Action</div>
//   </Command>
//
// Examples:
//   <!-- Command palette with filtered commands -->
//   <Command label="Command palette" placeholder="Search commands..." v-model={query}>
//     {#each filteredCommands as cmd}
//       <div role="option">{cmd.name}</div>
//     {/each}
//   </Command>
//
// Keyboard:
//   - Tab: Move focus into and out of the search input
//   - Additional keyboard navigation within the listbox should be implemented by the consumer
//
// Accessibility:
//   - role="search" identifies the outer container as a search landmark
//   - aria-label provides accessible names for the search region, input, and listbox
//   - role="listbox" identifies the results container for selectable options
//   - autocomplete="off" prevents browser autocomplete from interfering
//
// Internationalization:
//   - The label and placeholder props provide all text; no hardcoded strings
//   - All command content is provided by consumers through the default slot
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Consumer is responsible for filtering and rendering listbox content
//   - Consumer should implement arrow key navigation within the listbox
//
// References:
//   - WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
//   - WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

import { onBeforeUnmount, onMounted, ref, useAttrs, useId } from "vue";
import { attachCommand } from "./command-keys";
import { useFormReset } from "./form-reset";
import { warnMissingName } from "./dev-warning";

const props = withDefaults(
    defineProps<{
        label: string;
        placeholder?: string;
    }>(),
    {
        placeholder: undefined,
    },
);

warnMissingName("Command", props.label, useAttrs()["aria-label"], useAttrs()["aria-labelledby"]);

const modelValue = defineModel<string>({ default: "" });
const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
useFormReset(modelValue, field);

const listId = `command-list-${useId()}`;
const listEl = ref<HTMLElement | null>(null);
let detach: (() => void) | undefined;
onMounted(() => {
    detach = attachCommand(field.value as HTMLInputElement, listEl.value!);
});
onBeforeUnmount(() => detach?.());
</script>

<template>
    <!-- Command.vue -->
    <div
        class="command"
        role="search"
        :aria-label="label"
    >
        <input
            type="search"
            ref="field"
            :aria-controls="listId"
            v-model="modelValue"
            :aria-label="label"
            :placeholder="placeholder"
            autocomplete="off"
        />
        <div
            ref="listEl"
            :id="listId"
            role="listbox"
            :aria-label="label"
        >
            <slot />
        </div>
    </div>
</template>
