<script setup lang="ts">

    // InfoState component
    //
    // A headless composition for empty, error, info, and success states. Renders
    // a <section role="status"> with an optional illustration, a required title,
    // an optional description, and an optional action area for buttons or links.
    // The level prop is exposed via data-level so consumers can vary visual
    // treatment per state without changing the markup.
    //
    // Props:
    //   level       — "info" | "empty" | "error" | "success", default "info".
    //   title       — string, REQUIRED. Section heading.
    //   description — string, optional. Body text under the title.
    //   label       — string, optional. aria-label override (defaults to title).
    //   illustration — named slot, optional. Visual element above the title.
    //   action       — named slot, optional. CTA buttons below the description.
    //   default slot — alternative custom content.
    //   ...restProps — additional HTML attributes spread onto the <section>.
    //
    // Syntax:
    //   <InfoState title="Nothing here yet" description="Add a project" level="empty">
    //     <template #illustration><svg /></template>
    //     <template #action><button>Add project</button></template>
    //   </InfoState>
    //
    // Examples:
    //   <!-- Empty state -->
    //   <InfoState level="empty" title="No tasks" description="Create one to get started">
    //     <template #action>
    //       <button>Create task</button>
    //     </template>
    //   </InfoState>
    //
    //   <!-- Error state -->
    //   <InfoState level="error" title="Something went wrong" description="Try again later" />
    //
    // Keyboard: None — passive container; any focusable elements inside the
    // action slot follow native tab order.
    //
    // Accessibility:
    //   - role="status" announces non-error state changes politely
    //   - aria-label defaults to the title for redundancy with the heading
    //   - data-level attribute exposes the variant for CSS hooks
    //
    // Internationalization:
    //   - title, description, and label are all consumer-supplied strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - The default slot replaces the title/description/action structure when present
    //
    // References:
    //   - WAI-ARIA role="status": https://www.w3.org/TR/wai-aria-1.2/#status

    import { useSlots } from "vue";

    withDefaults(defineProps<{
        /** Variant for the state. */
        level?: "info" | "empty" | "error" | "success";
        /** Section heading. */
        title: string;
        /** Body text. */
        description?: string;
        /** aria-label override. */
        label?: string;
    }>(), {
        level: "info",
        description: undefined,
        label: undefined,
    });

    const slots = useSlots();

</script>

<template>
    <!-- InfoState.vue -->
    <section
        class="info-state"
        role="status"
        :data-level="level"
        :aria-label="label ?? title"
    >
        <template v-if="slots.default">
            <slot />
        </template>
        <template v-else>
            <div v-if="slots.illustration" class="info-state-illustration">
                <slot name="illustration" />
            </div>
            <h2 class="info-state-title">{{ title }}</h2>
            <p v-if="description" class="info-state-description">{{ description }}</p>
            <div v-if="slots.action" class="info-state-action">
                <slot name="action" />
            </div>
        </template>
    </section>
</template>
