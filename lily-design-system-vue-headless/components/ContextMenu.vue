<script setup lang="ts">

    // ContextMenu component
    //
    // A headless context menu that displays a list of actions relevant to the current
    // context, typically triggered by a right-click or long-press. When opened, focus
    // moves to the first menu item automatically. Arrow keys navigate between items
    // with wrapping, and Escape closes the menu. Consumers trigger opening externally
    // and provide role="menuitem" children. Used with ContextMenuItem children.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the context menu via aria-label.
    //   open — boolean, default false. Whether the menu is visible; bindable for two-way control.
    //   default slot. Menu item content (should include role="menuitem" elements).
    //   ...restProps — additional HTML attributes spread onto the menu <div>.
    //
    // Syntax:
    //   <ContextMenu label="Actions" v-model:open>
    //     <ContextMenuItem>Cut</ContextMenuItem>
    //   </ContextMenu>
    //
    // Examples:
    //   <!-- Context menu with multiple actions -->
    //   <ContextMenu label="Actions" v-model:open>
    //     <li role="menuitem" tabindex="-1">Cut</li>
    //     <li role="menuitem" tabindex="-1">Copy</li>
    //     <li role="menuitem" tabindex="-1">Paste</li>
    //   </ContextMenu>
    //
    // Keyboard:
    //   - ArrowDown: Move focus to the next menu item (wraps to first)
    //   - ArrowUp: Move focus to the previous menu item (wraps to last)
    //   - Home: Move focus to the first menu item
    //   - End: Move focus to the last menu item
    //   - Escape: Close the menu
    //
    // Accessibility:
    //   - role="menu" identifies the container as a menu widget
    //   - aria-label provides an accessible name for the menu
    //   - Focus is automatically moved to the first menuitem when opened via $effect
    //
    // Internationalization:
    //   - The label prop provides the accessible name; no hardcoded strings
    //   - All menu item content is provided by consumers through children
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Compound component: use with ContextMenuItem for individual entries
    //   - Consumer triggers opening externally (e.g., via contextmenu event handler)
    //
    // References:
    //   - WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu/

    import { ref, watchEffect } from "vue";

    const props = defineProps<{
        /** Accessible name for the context menu. */
        label: string;
    }>();

    const open = defineModel<boolean>("open", { default: false });

    const menuRef = ref<HTMLElement | undefined>(undefined);

    function onkeydown(event: KeyboardEvent) {
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
            const firstItem =
                menuRef.value.querySelector<HTMLElement>("[role='menuitem']");
            firstItem?.focus();
        }
    });

</script>

<template>
        <div v-if="open"
            class="context-menu"
            role="menu"
            :aria-label="label"
            ref="menuRef"
            @keydown="onkeydown"
        >
            <slot />
        </div>
</template>
