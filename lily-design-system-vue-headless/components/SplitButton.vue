<script setup lang="ts">
import { ref, useId, useAttrs } from "vue";
import { popoverSupported, toggleOpened, usePopoverState } from "./popover";
import { warnMissingName } from "./dev-warning";
// SplitButton component
//
// A headless split button: a primary action paired with a dropdown trigger
// that opens a related-actions menu. Renders <div role="group"> with two
// buttons (primary, menu trigger) and a hideable menu container that holds
// consumer-supplied menu content via the default slot.
//
// Props:
//   label        — string, REQUIRED. aria-label for the group.
//   primaryLabel — string, REQUIRED. Text rendered in the primary button.
//   menuLabel    — string, REQUIRED. aria-label for the dropdown trigger.
//   menuOpen     — boolean, default false, v-model:menuOpen. The menu is popover="auto", so the browser opens and light-dismisses it.
//   disabled     — boolean, default false. Disables both buttons.
//   default slot — menu content (e.g., a Menu component).
//   emits primaryClick(event), menuToggle(event)
//   ...restProps — additional HTML attributes spread onto the wrapper <div>.
//
// Syntax:
//   <SplitButton
//     label="Save options"
//     primary-label="Save"
//     menu-label="More save actions"
//     :menu-open="open"
//     @primary-click="onSave"
//     @menu-toggle="onToggle"
//   >
//     <Menu>...</Menu>
//   </SplitButton>
//
// Keyboard:
//   - Tab moves focus between the primary button and the menu trigger
//   - Enter / Space activates each button
//   - Menu interactions are handled by the consumer's menu content
//
// Accessibility:
//   - role="group" with aria-label clusters the two buttons
//   - aria-haspopup="menu" and aria-expanded on the menu trigger
//   - The menu is popover="auto"; where the Popover API is missing it is hidden when menuOpen is false
//   - data-menu-open exposes the open state for CSS hooks
//
// Internationalization:
//   - All labels are consumer-supplied
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - Trigger renders no inner glyph; consumer can style via the
//     split-button-menu-trigger class
//
// References:
//   - WAI-ARIA Menu Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/

const props = withDefaults(
    defineProps<{
        /** Group aria-label (REQUIRED). */
        label: string;
        /** Primary button label (REQUIRED). */
        primaryLabel: string;
        /** Menu trigger aria-label (REQUIRED). */
        menuLabel: string;
        /** Whether both buttons are disabled. */
        disabled?: boolean;
    }>(),
    {
        disabled: false,
    },
);

warnMissingName(
    "SplitButton",
    props.label,
    useAttrs()["aria-label"],
    useAttrs()["aria-labelledby"],
);

const emit = defineEmits<{
    (e: "primaryClick", event: MouseEvent): void;
    (e: "menuToggle", event: MouseEvent): void;
}>();

/** Whether the dropdown menu is open. v-model:menuOpen: the browser opens and light-dismisses it. */
const menuOpen = defineModel<boolean>("menuOpen", { default: false });

const menuId = `split-button-menu-${useId()}`;
const menu = ref<HTMLElement | null>(null);

// popover="auto": the trigger's command="toggle-popover" opens and closes the menu and @toggle writes `menuOpen`
// back. Without the API the click toggles `menuOpen` (unless a menuToggle listener prevents the default) and
// `hidden` follows.
usePopoverState(menu, menuOpen);

function onMenuToggle(event: MouseEvent): void {
    emit("menuToggle", event);
    if (event.defaultPrevented) return;
    if (menu.value && !popoverSupported(menu.value)) menuOpen.value = !menuOpen.value;
}
</script>

<template>
    <!-- SplitButton.vue -->
    <div
        class="split-button"
        role="group"
        :aria-label="label"
        :data-menu-open="menuOpen"
    >
        <button
            class="split-button-primary"
            type="button"
            :disabled="disabled"
            @click="$emit('primaryClick', $event)"
        >
            {{ primaryLabel }}
        </button>
        <button
            class="split-button-menu-trigger"
            type="button"
            :disabled="disabled"
            :aria-haspopup="'menu'"
            :aria-expanded="menuOpen"
            :aria-label="menuLabel"
            :aria-controls="menuId"
            command="toggle-popover"
            :commandfor="menuId"
            :popovertarget="menuId"
            @click="onMenuToggle"
        ></button>
        <div
            ref="menu"
            class="split-button-menu"
            :id="menuId"
            popover="auto"
            @toggle="menuOpen = toggleOpened($event)"
        >
            <slot />
        </div>
    </div>
</template>
