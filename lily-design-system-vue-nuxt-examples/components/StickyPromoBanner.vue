<script setup lang="ts">

    // StickyPromoBanner component
    //
    // A fixed-position promotional banner with a dismiss button. Renders an
    // <aside> with role="complementary", a content wrapper, and a dismiss button.
    // Inline styles are used ONLY to apply position: fixed and the top/bottom
    // edge — all other visual styling is consumer-supplied.
    //
    // Props:
    //   label         — string, REQUIRED. aria-label for the aside region.
    //   open          — boolean, default true. Whether visible.
    //   position      — "top" | "bottom", default "bottom".
    //   dismissLabel  — string, REQUIRED. aria-label for the dismiss button.
    //   default slot  — banner content.
    //   emits dismiss(event) — dismiss click handler.
    //
    // Syntax:
    //   <StickyPromoBanner label="Promo" dismiss-label="Dismiss" @dismiss="onDismiss">
    //     Save 20% today.
    //   </StickyPromoBanner>
    //
    // Accessibility:
    //   - <aside role="complementary"> with aria-label
    //   - Dismiss button has its own aria-label
    //
    // Internationalization:
    //   - All text via props/slots
    //
    // Claude rules:
    //   - Headless: no CSS, no <style> blocks
    //   - Inline style ONLY for position: fixed; left/right; and top/bottom edge
    //   - Inspired by Mozilla Protocol Design System

    import { computed } from "vue";

    const props = withDefaults(defineProps<{
        /** aria-label for the region (REQUIRED). */
        label: string;
        /** Whether the banner is visible. */
        open?: boolean;
        /** Sticky edge of the viewport. */
        position?: "top" | "bottom";
        /** aria-label for the dismiss button (REQUIRED). */
        dismissLabel: string;
    }>(), {
        open: true,
        position: "bottom",
    });

    defineEmits<{
        (e: "dismiss", event: MouseEvent): void;
    }>();

    const fixedStyle = computed(() => ({
        position: "fixed" as const,
        left: "0",
        right: "0",
        ...(props.position === "top" ? { top: "0" } : { bottom: "0" }),
    }));

</script>

<template>
    <!-- StickyPromoBanner.vue -->
    <aside
        class="sticky-promo-banner"
        role="complementary"
        :aria-label="label"
        :data-position="position"
        :hidden="!open"
        :style="fixedStyle"
    >
        <div class="sticky-promo-banner-content">
            <slot />
        </div>
        <button
            type="button"
            class="sticky-promo-banner-dismiss"
            :aria-label="dismissLabel"
            @click="$emit('dismiss', $event)"
        >×</button>
    </aside>
</template>
