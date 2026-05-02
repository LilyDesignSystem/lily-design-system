<script setup lang="ts">

    // VideoPlayer component
    //
    // A <video> player rendered inside a <figure>. Supports autoplay-on-
    // scroll via IntersectionObserver: when `autoplay` is true the video
    // plays when scrolled into the viewport and pauses when scrolled out.
    // Native browser controls show by default; consumers can pass custom
    // controls overlay via default slot.
    //
    // Props:
    //   src      — string, required.
    //   label    — string, required.
    //   poster   — string, optional.
    //   autoplay — boolean, default false.
    //   muted    — boolean, default false.
    //   loop     — boolean, default false.
    //   controls — boolean, default true.
    //
    // Slots:
    //   default — custom controls overlay.
    //   caption — caption rendered inside <figcaption>.

    import { ref, onMounted, onBeforeUnmount, useSlots } from "vue";

    const props = withDefaults(defineProps<{
        /** Video source URL. */
        src: string;
        /** Accessible label for the video. */
        label: string;
        /** Poster image URL. */
        poster?: string;
        /** Auto-play when scrolled into view. */
        autoplay?: boolean;
        /** Muted state. */
        muted?: boolean;
        /** Loop playback. */
        loop?: boolean;
        /** Show native browser controls. */
        controls?: boolean;
    }>(), {
        autoplay: false,
        muted: false,
        loop: false,
        controls: true,
    });

    const slots = useSlots();
    const videoEl = ref<HTMLVideoElement | null>(null);
    let observer: IntersectionObserver | null = null;

    onMounted(() => {
        if (!props.autoplay) return;
        const video = videoEl.value;
        if (!video || typeof IntersectionObserver === "undefined") return;
        observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        void video.play().catch(() => {});
                    } else {
                        video.pause();
                    }
                }
            },
            { threshold: 0.5 }
        );
        observer.observe(video);
    });

    onBeforeUnmount(() => {
        observer?.disconnect();
    });

</script>

<template>
    <!-- VideoPlayer.vue -->
    <figure class="video-player" :aria-label="label">
        <video
            ref="videoEl"
            class="video-player-element"
            :src="src"
            :poster="poster"
            :muted="muted"
            :loop="loop"
            :controls="controls"
            playsinline
        />
        <div v-if="slots.default" class="video-player-controls">
            <slot />
        </div>
        <figcaption v-if="slots.caption" class="video-player-caption">
            <slot name="caption" />
        </figcaption>
    </figure>
</template>
