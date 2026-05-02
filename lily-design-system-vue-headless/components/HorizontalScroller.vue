<script setup lang="ts">

    // HorizontalScroller component
    //
    // A horizontally scrollable region. Renders <div role="region"> with
    // tabindex=0 so keyboard users can focus the area, and handles
    // ArrowLeft / ArrowRight to scroll horizontally inside it. Pointer /
    // touch scrolling is left to the browser's native overflow behaviour.
    //
    // Props:
    //   label — string, required.
    //   step  — number, default 100. Pixels to scroll per Arrow key press.
    //
    // Slots:
    //   default — horizontally arranged content.
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides
    //     overflow-x: auto + a flex/inline-flex track inside

    import { ref } from "vue";

    const props = withDefaults(defineProps<{
        /** Accessible label for the scrollable region. */
        label: string;
        /** Pixels to scroll per Arrow key press. */
        step?: number;
    }>(), {
        step: 100,
    });

    const scrollerEl = ref<HTMLDivElement | null>(null);

    function onKeyDown(event: KeyboardEvent) {
        const el = scrollerEl.value;
        if (!el) return;
        if (event.key === "ArrowRight") {
            event.preventDefault();
            el.scrollBy({ left: props.step, behavior: "smooth" });
        } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            el.scrollBy({ left: -props.step, behavior: "smooth" });
        } else if (event.key === "Home") {
            event.preventDefault();
            el.scrollTo({ left: 0, behavior: "smooth" });
        } else if (event.key === "End") {
            event.preventDefault();
            el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
        }
    }

</script>

<template>
    <!-- HorizontalScroller.vue -->
    <div
        ref="scrollerEl"
        class="horizontal-scroller"
        role="region"
        :aria-label="label"
        tabindex="0"
        @keydown="onKeyDown"
    >
        <slot />
    </div>
</template>
