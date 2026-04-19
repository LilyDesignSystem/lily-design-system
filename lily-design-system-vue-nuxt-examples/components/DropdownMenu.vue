<script setup lang="ts">

    // DropdownMenu component
    //
    // A dropdown menu triggered by a button that reveals a list of actions or
    // options. Combines a toggle button with a conditionally rendered menu panel.
    // When the menu opens, focus moves automatically to the first menu item.
    // Common use cases include action menus, settings menus, and context-sensitive
    // option lists.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the menu button; also displayed as button text.
    //   open — boolean, default false. Whether the menu is visible; bindable.
    //   default slot. Menu items, each should have role="menuitem" and tabindex="-1".
    //   ...restProps — additional HTML attributes spread onto the outer wrapper <div>.
    //
    // Syntax:
    //   <DropdownMenu label="Options" v-model:open>
    //     <li role="menuitem" tabindex="-1">Action</li>
    //   </DropdownMenu>
    //
    // Examples:
    //   <!-- Basic dropdown menu -->
    //   <DropdownMenu label="Options" v-model:open>
    //     <li role="menuitem" tabindex="-1">Edit</li>
    //     <li role="menuitem" tabindex="-1">Duplicate</li>
    //     <li role="menuitem" tabindex="-1">Delete</li>
    //   </DropdownMenu>
    //
    //   <!-- With action handler -->
    //   <DropdownMenu label="Actions" v-model:open={menuOpen}>
    //     <li role="menuitem" tabindex="-1" onclick={() => handleAction('edit')}>Edit</li>
    //     <li role="menuitem" tabindex="-1" onclick={() => handleAction('delete')}>Delete</li>
    //   </DropdownMenu>
    //
    // Keyboard:
    //   - Enter/Space on button: toggles the menu open/closed
    //   - ArrowDown: moves focus to the next menu item (wraps to first)
    //   - ArrowUp: moves focus to the previous menu item (wraps to last)
    //   - Home: moves focus to the first menu item
    //   - End: moves focus to the last menu item
    //   - Escape: closes the menu
    //
    // Accessibility:
    //   - aria-haspopup="true" on the trigger button indicates it opens a menu
    //   - aria-expanded communicates whether the menu is shown
    //   - aria-label on both button and menu provides accessible names
    //   - role="menu" on the menu container identifies it as a menu widget
    //   - Consumer provides role="menuitem" on each child item
    //
    // Internationalization:
    //   - The label prop accepts any string; consumers provide localized text
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Auto-focuses first menuitem on open via $effect
    //   - Menu items discovered dynamically via querySelectorAll("[role='menuitem']")
    //   - Arrow navigation wraps around from last to first and vice versa
    //
    // References:
    //   - WAI-ARIA Menu Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menubutton/
    //   - WAI-ARIA menu role: https://www.w3.org/TR/wai-aria-1.2/#menu
    //   - WAI-ARIA menuitem role: https://www.w3.org/TR/wai-aria-1.2/#menuitem

    import { ref, watchEffect } from "vue";

    const props = defineProps<{
        /** Accessible name for the menu button. */
        label: string;
    }>();

    const open = defineModel<boolean>("open", { default: false });

    const menuRef = ref<HTMLElement | undefined>(undefined);

    function toggleMenu() {
        open.value = !open.value;
    }

    function onMenuKeydown(event: KeyboardEvent) {
        if (!menuRef.value) return;
        const items = Array.from(
            menuRef.value.querySelectorAll<HTMLElement>("[role='menuitem']"),
        );
        const current = document.activeElement as HTMLElement;
        const index = items.indexOf(current);

        switch (event.key) {
            case "ArrowDown": {
                event.preventDefault();
                const next = index < items.length - 1 ? index + 1 : 0;
                items[next]?.focus();
                break;
            }
            case "ArrowUp": {
                event.preventDefault();
                const prev = index > 0 ? index - 1 : items.length - 1;
                items[prev]?.focus();
                break;
            }
            case "Home": {
                event.preventDefault();
                items[0]?.focus();
                break;
            }
            case "End": {
                event.preventDefault();
                items[items.length - 1]?.focus();
                break;
            }
            case "Escape": {
                event.preventDefault();
                open.value = false;
                break;
            }
        }
    }

    watchEffect(() => {
        if (open.value && menuRef.value) {
            const first =
                menuRef.value.querySelector<HTMLElement>("[role='menuitem']");
            first?.focus();
        }
    });

</script>

<template>
    <!-- DropdownMenu.vue -->
    <div
        class="dropdown-menu"
    >
        <button
            type="button"
            aria-haspopup="true"
            :aria-expanded="open"
            :aria-label="label"
            @click="toggleMenu"
        >
            {{ label }}
        </button>
                <div v-if="open"
                role="menu"
                :aria-label="label"
                ref="menuRef"
                @keydown="onMenuKeydown"
            >
                <slot />
            </div>
    </div>
</template>
