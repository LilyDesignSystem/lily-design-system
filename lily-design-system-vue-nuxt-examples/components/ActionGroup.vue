<script setup lang="ts">

    // ActionGroup component
    //
    // A group of action buttons that can collapse to an overflow menu when
    // space is constrained. Renders a role="group" container with an optional
    // overflow trigger button and overflow content panel.
    //
    // Props:
    //   label         — string, REQUIRED. aria-label for the group.
    //   overflowOpen  — boolean, default false. Whether the overflow menu is open.
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
    //   - overflow panel is hidden when overflowOpen is false
    //
    // Internationalization:
    //   - All text content via props (label, overflowLabel)
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - label is required
    //   - overflow trigger renders only when the overflow slot is provided

    import { useSlots } from "vue";

    withDefaults(defineProps<{
        /** Accessible label for the group (REQUIRED). */
        label: string;
        /** Whether the overflow menu is open. */
        overflowOpen?: boolean;
        /** Accessible label for the overflow trigger. */
        overflowLabel?: string;
    }>(), {
        overflowOpen: false,
        overflowLabel: undefined,
    });

    defineEmits<{
        (e: "overflowToggle", event: MouseEvent): void;
    }>();

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
                @click="$emit('overflowToggle', $event)"
            >…</button>
            <div class="action-group-overflow-menu" :hidden="!overflowOpen">
                <slot name="overflow" />
            </div>
        </template>
    </div>
</template>
