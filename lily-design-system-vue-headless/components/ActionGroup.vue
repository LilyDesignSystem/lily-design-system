<script setup lang="ts">
// ActionGroup component
//
// A group of action buttons that can collapse to an overflow menu when
// space is constrained. Renders a role="group" container with an optional
// overflow trigger button and overflow content panel.
//
// Props:
//   label         — string, REQUIRED. aria-label for the group.
//   overflowOpen  — boolean, default false, v-model:overflowOpen. Whether the overflow menu (popover="auto") is open.
//   overflowLabel — string, optional. aria-label for the overflow trigger.
//   default slot  — the visible action buttons.
//   overflow slot — optional content for the overflow menu.
//   emits overflowToggle(event) — overflow trigger click handler.
//
// Syntax:
//   <ActionGroup label="Toolbar" :overflow-open="open"
//                overflow-label="More actions"
//                @overflow-toggle="open = !open">
//     <Button>One</Button>
//     <template #overflow>
//       <Menu>...</Menu>
//     </template>
//   </ActionGroup>
//
// Accessibility:
//   - role="group" with aria-label
//   - overflow trigger has aria-haspopup="menu", aria-expanded
//   - overflow panel is popover="auto"; where the Popover API is missing it is hidden when overflowOpen is false
//
// Internationalization:
//   - All text content via props (label, overflowLabel)
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - label is required
//   - overflow trigger renders only when the overflow slot is provided

import { ref, useId, useSlots } from "vue";
import { popoverSupported, toggleOpened, usePopoverState } from "./popover";

withDefaults(
    defineProps<{
        /** Accessible label for the group (REQUIRED). */
        label: string;
        /** Accessible label for the overflow trigger. */
        overflowLabel?: string;
    }>(),
    {
        overflowLabel: undefined,
    },
);

const emit = defineEmits<{
    (e: "overflowToggle", event: MouseEvent): void;
}>();

/** Whether the overflow menu is open. v-model:overflowOpen: the browser opens and light-dismisses it. */
const overflowOpen = defineModel<boolean>("overflowOpen", { default: false });

const menuId = `action-group-overflow-menu-${useId()}`;
const menu = ref<HTMLElement | null>(null);

// popover="auto": the trigger's command="toggle-popover" opens and closes the menu and @toggle writes
// `overflowOpen` back. Without the API the click toggles it (unless an overflowToggle listener prevents the
// default) and `hidden` follows.
usePopoverState(menu, overflowOpen);

function onOverflowToggle(event: MouseEvent): void {
    emit("overflowToggle", event);
    if (event.defaultPrevented) return;
    if (menu.value && !popoverSupported(menu.value)) overflowOpen.value = !overflowOpen.value;
}

const slots = useSlots();
const hasOverflow = (): boolean => Boolean(slots.overflow);
</script>

<template>
    <!-- ActionGroup.vue -->
    <div
        class="action-group"
        role="group"
        :aria-label="label"
    >
        <slot />
        <template v-if="hasOverflow()">
            <button
                class="action-group-overflow-trigger"
                type="button"
                aria-haspopup="menu"
                :aria-expanded="overflowOpen"
                :aria-label="overflowLabel"
                :aria-controls="menuId"
                command="toggle-popover"
                :commandfor="menuId"
                :popovertarget="menuId"
                @click="onOverflowToggle"
            >
                …
            </button>
            <div
                ref="menu"
                class="action-group-overflow-menu"
                :id="menuId"
                popover="auto"
                @toggle="overflowOpen = toggleOpened($event)"
            >
                <slot name="overflow" />
            </div>
        </template>
    </div>
</template>
