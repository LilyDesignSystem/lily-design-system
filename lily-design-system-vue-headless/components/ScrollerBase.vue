<script setup lang="ts">

    // ScrollerBase component
    //
    // A low-level scroll-position tracking primitive for scrollytelling.
    // Direct children are treated as steps. IntersectionObserver reports
    // the active step index, and a scroll listener computes the overall
    // progress (0 at the top of the scroller, 1 at the bottom).
    //
    // Props:
    //   label   — string, optional. Accessible label.
    //   offset  — number, default 0.5. Trigger position in the viewport.
    //
    // Emits:
    //   indexChange    — fired with the active step index.
    //   progressChange — fired with overall scroll progress (0..1).
    //
    // Slots:
    //   default — step elements.
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling

    import { ref, onMounted, onBeforeUnmount } from "vue";

    const props = withDefaults(defineProps<{
        /** Accessible label for the scroll region. */
        label?: string;
        /** Trigger position (0=top, 0.5=center, 1=bottom). */
        offset?: number;
    }>(), {
        label: undefined,
        offset: 0.5,
    });

    const emit = defineEmits<{
        (e: "indexChange", index: number): void;
        (e: "progressChange", progress: number): void;
    }>();

    const scrollerEl = ref<HTMLDivElement | null>(null);
    let observer: IntersectionObserver | null = null;
    let onScroll: (() => void) | null = null;

    onMounted(() => {
        const root = scrollerEl.value;
        if (!root || typeof IntersectionObserver === "undefined") return;

        const steps = Array.from(root.children) as HTMLElement[];
        const triggerFromTop = `${(props.offset * 100).toFixed(2)}%`;

        observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        const idx = steps.indexOf(entry.target as HTMLElement);
                        if (idx !== -1) emit("indexChange", idx);
                    }
                }
            },
            {
                rootMargin: `-${triggerFromTop} 0px -${(100 - props.offset * 100).toFixed(2)}% 0px`,
                threshold: 0,
            }
        );
        for (const step of steps) observer.observe(step);

        onScroll = () => {
            if (!root) return;
            const rect = root.getBoundingClientRect();
            const winH = window.innerHeight || 1;
            const total = rect.height + winH;
            const passed = winH - rect.top;
            const progress = Math.max(0, Math.min(1, passed / total));
            emit("progressChange", progress);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    });

    onBeforeUnmount(() => {
        observer?.disconnect();
        if (onScroll) window.removeEventListener("scroll", onScroll);
    });

</script>

<template>
    <!-- ScrollerBase.vue -->
    <div
        ref="scrollerEl"
        class="scroller-base"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
