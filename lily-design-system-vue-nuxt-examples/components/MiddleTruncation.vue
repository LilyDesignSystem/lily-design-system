<script setup lang="ts">

    // MiddleTruncation component
    //
    // A string shortened in the middle to fit the width its container gives it ("report-fi…q3.pdf"), keeping the start and
    // the end. The width is measured in the browser (canvas text metrics in the element's own font) and re-measured when the
    // container resizes; until then, and on the server, the full text is shown.
    //
    // The full text always stays in the accessibility tree: the shortened string is aria-hidden and the whole text sits in a
    // sibling the consumer visually hides. Screen readers, find-in-page and copy get the real text.
    //
    // Props:
    //   text — string, required. The full text.
    //   ellipsis — string, required. The cut marker. No default: the headless layer ships no text.
    //   strategy — "even" | "fixed-end" | "min-end", default "even".
    //   end — number, optional. Characters kept at the end for "fixed-end" and "min-end".
    //   ...restProps (attrs) — fall through onto the root <span>, with the consumer class after the base class.
    //
    // Markup:
    //   <span class="middle-truncation" data-strategy data-truncated?>
    //     <span class="middle-truncation-visual" aria-hidden="true">…</span>
    //     <span class="middle-truncation-full">…</span>
    //   </span>
    //
    // Keyboard: none.

    import { onBeforeUnmount, onMounted, ref, watch } from "vue";
    import { truncateMiddle, type TruncationStrategy } from "./middle-truncation";

    const props = withDefaults(defineProps<{
        /** The full text. */
        text: string;
        /** The cut marker; no default. */
        ellipsis: string;
        /** How the room is shared between start and end. */
        strategy?: TruncationStrategy;
        /** Characters kept at the end for "fixed-end" and "min-end". */
        end?: number;
    }>(), {
        strategy: "even",
        end: undefined,
    });

    const root = ref<HTMLSpanElement | null>(null);
    const shown = ref<string | null>(null);
    let context: CanvasRenderingContext2D | null | undefined;
    let observer: ResizeObserver | undefined;
    let frame = 0;

    function recalculate(): void {
        const el = root.value;
        if (!el) return;
        const width = el.clientWidth;
        if (context === undefined) context = document.createElement("canvas").getContext("2d");
        if (!context || width <= 0) {
            shown.value = null;
            return;
        }
        const style = getComputedStyle(el);
        context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        const ctx = context;
        const result = truncateMiddle(props.text, {
            ellipsis: props.ellipsis,
            strategy: props.strategy,
            end: props.end,
            maxWidth: width,
            measure: (s) => ctx.measureText(s).width,
        });
        shown.value = result === props.text ? null : result;
    }

    onMounted(() => {
        recalculate();
        if (!root.value || typeof ResizeObserver === "undefined") return;
        observer = new ResizeObserver(() => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(recalculate);
        });
        observer.observe(root.value);
    });

    onBeforeUnmount(() => {
        cancelAnimationFrame(frame);
        observer?.disconnect();
    });

    watch(() => [props.text, props.ellipsis, props.strategy, props.end], recalculate, { flush: "post" });
</script>

<template>
    <!-- MiddleTruncation.vue -->
    <span
        ref="root"
        class="middle-truncation"
        :data-strategy="strategy"
        :data-truncated="shown === null ? undefined : ''"
    ><span class="middle-truncation-visual" aria-hidden="true">{{ shown ?? text }}</span><span class="middle-truncation-full">{{ text }}</span></span>
</template>
