<script setup lang="ts">

    // ScrollerVideo component
    //
    // Scroll-driven video: as the user scrolls through the scroller, the
    // muted <video> currentTime advances proportionally. Foreground
    // children scroll over the sticky video the way Scroller works.
    //
    // The video is muted because scroll-driven scrubbing produces erratic
    // timing that conflicts with audio.
    //
    // Props:
    //   src    — string, required.
    //   label  — string, required. Accessible label for the video story.
    //   alt    — string, required. Text alternative describing the video.
    //   offset — number, default 0.5.
    //
    // Emits:
    //   indexChange — active step index changed.
    //   progressChange — fired with overall scroll progress (0..1).
    //
    // Slots:
    //   default — foreground step content overlaid on the video.
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling

    import { ref, onMounted } from "vue";
    import ScrollerBase from "./ScrollerBase.vue";

    withDefaults(defineProps<{
        /** Video source URL. */
        src: string;
        /** Accessible label describing the video story. */
        label: string;
        /** Text alternative describing the video content. */
        alt: string;
        /** Step trigger position in the viewport (0..1). */
        offset?: number;
    }>(), {
        offset: 0.5,
    });

    const emit = defineEmits<{
        (e: "indexChange", index: number): void;
        (e: "progressChange", progress: number): void;
    }>();

    const videoEl = ref<HTMLVideoElement | null>(null);

    function onProgress(progress: number) {
        const video = videoEl.value;
        if (video && Number.isFinite(video.duration) && video.duration > 0) {
            video.currentTime = video.duration * progress;
        }
        emit("progressChange", progress);
    }

    onMounted(() => {
        const video = videoEl.value;
        if (video) {
            video.muted = true;
            video.playsInline = true;
        }
    });

</script>

<template>
    <!-- ScrollerVideo.vue -->
    <div class="scroller-video" :aria-label="label">
        <div
            class="scroller-video-background"
            role="img"
            aria-roledescription="scrollable video"
            :aria-label="alt"
        >
            <video
                ref="videoEl"
                class="scroller-video-element"
                :src="src"
                muted
                playsinline
                preload="auto"
            />
        </div>
        <ScrollerBase
            class="scroller-video-foreground"
            :offset="offset"
            @indexChange="(i: number) => emit('indexChange', i)"
            @progressChange="onProgress"
        >
            <slot />
        </ScrollerBase>
    </div>
</template>
