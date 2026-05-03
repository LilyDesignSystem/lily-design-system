<script setup lang="ts">

    // Visible component
    //
    // An IntersectionObserver wrapper that exposes the element's viewport
    // visibility state to the consumer through a scoped slot.
    //
    // Props:
    //   once       — boolean, default false. Stop observing after first intersection.
    //   threshold  — number, default 0.
    //   rootMargin — string, default "0px".
    //
    // Slots:
    //   default — scoped slot receiving { visible } prop.
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling

    import { ref, onMounted, onBeforeUnmount } from "vue";

    const props = withDefaults(defineProps<{
        /** Stop observing after the first intersection. */
        once?: boolean;
        /** IntersectionObserver threshold. */
        threshold?: number;
        /** IntersectionObserver rootMargin. */
        rootMargin?: string;
    }>(), {
        once: false,
        threshold: 0,
        rootMargin: "0px",
    });

    const visibleEl = ref<HTMLDivElement | null>(null);
    const visible = ref(false);
    let observer: IntersectionObserver | null = null;

    onMounted(() => {
        const el = visibleEl.value;
        if (!el || typeof IntersectionObserver === "undefined") return;
        observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.target === el) {
                        visible.value = entry.isIntersecting;
                        if (props.once && entry.isIntersecting) {
                            observer?.disconnect();
                        }
                    }
                }
            },
            { threshold: props.threshold, rootMargin: props.rootMargin }
        );
        observer.observe(el);
    });

    onBeforeUnmount(() => {
        observer?.disconnect();
    });

</script>

<template>
    <!-- Visible.vue -->
    <div
        ref="visibleEl"
        class="visible"
        :data-visible="visible"
    >
        <slot :visible="visible" />
    </div>
</template>
