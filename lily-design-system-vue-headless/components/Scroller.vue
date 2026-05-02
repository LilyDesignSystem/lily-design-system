<script setup lang="ts">

    // Scroller component
    //
    // A scrollytelling container with a sticky `background` that updates
    // as the foreground steps scroll past. Built on top of ScrollerBase:
    // each direct child of the foreground default slot is a step.
    //
    // Slots:
    //   default    — foreground step content.
    //   background — sticky background that changes with the active step.
    //
    // Props:
    //   label  — string, optional. Accessible label.
    //   offset — number, default 0.5. Trigger position in viewport.
    //
    // Emits:
    //   indexChange    — active step index changed.
    //   progressChange — overall scroll progress (0..1).
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - position: sticky on the background is the consumer's CSS responsibility

    import ScrollerBase from "./ScrollerBase.vue";

    withDefaults(defineProps<{
        /** Accessible label for the scroller region. */
        label?: string;
        /** Step trigger position in viewport (0..1). */
        offset?: number;
    }>(), {
        label: undefined,
        offset: 0.5,
    });

    const emit = defineEmits<{
        (e: "indexChange", index: number): void;
        (e: "progressChange", progress: number): void;
    }>();

</script>

<template>
    <!-- Scroller.vue -->
    <div class="scroller" :aria-label="label">
        <div class="scroller-background" aria-live="polite">
            <slot name="background" />
        </div>
        <ScrollerBase
            class="scroller-foreground"
            :offset="offset"
            @indexChange="(i: number) => emit('indexChange', i)"
            @progressChange="(p: number) => emit('progressChange', p)"
        >
            <slot />
        </ScrollerBase>
    </div>
</template>
