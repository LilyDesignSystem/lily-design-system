<!--
    Example 1 — Basic usage.

    The minimum viable picker: a label and a size list. On mount the
    picker resolves "medium" as the initial active size (since "medium"
    is in the list) and sets data-text-size="medium" on <html>.

    The default markup is a <div class="text-size-picker"> holding a
    hidden input, a <button class="text-size-picker-button"> showing
    the "A" glyph, and a <ul class="text-size-picker-list" role="listbox">
    with one <li class="text-size-picker-option" role="option"> per
    slug.

    The status line is part of the basic pattern, not an add-on.
    ------------------------------------------------------------------
    The control is icon-only: the closed button shows a single "A" and
    nothing else, so the active size has no on-screen representation
    and is not announced as any control's value. The
    <p class="text-size-picker-status"> below is the compensating
    channel, and it is the default pattern this package ships — see
    ../docs/accessibility.md.

    Two details worth copying verbatim:

    - It is VISIBLE, not sr-only. Sighted users benefit too: with only a
      glyph on the closed button, the active size is otherwise invisible,
      which matters for cognitive accessibility. It has a bonus here
      that the sibling helpers don't get: this line renders AT the
      selected size, so it doubles as a live preview.

    - aria-live="polite" announces MUTATIONS only, so this stays silent
      on first paint and speaks once on each subsequent change. That is
      the intended behaviour: no announcement on page load, one polite
      announcement per user action, and no focus movement.

    Finally, note the CSS below: the helper only ever sets the
    data-text-size attribute. Mapping that slug to an actual font size
    is entirely the consumer's job, always in relative units — see
    ../docs/accessibility.md, "Common mistakes to avoid".
-->
<script setup lang="ts">
import { ref } from "vue";
import TextSizePicker from "../TextSizePicker.vue";

const size = ref("");

/*
 * TextSizePicker keeps its own labelFor() internal and exposes it only
 * through the default scoped slot (which replaces the button glyph).
 * The status line below is outside the component, so mirror the
 * component's default label rule: title-case the slug. Pass the same
 * map to sizeLabels if you override labels.
 */
function labelFor(slug: string): string {
    return slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
</script>

<template>
    <TextSizePicker
        label="Text size"
        :sizes="['small', 'medium', 'large', 'x-large']"
        v-model:value="size"
    />

    <p class="text-size-picker-status" aria-live="polite">
        Text size: {{ labelFor(size) }}
    </p>
</template>

<style>
/*
 * The helper signals the choice; it defines no typography. THIS is the
 * half that actually satisfies WCAG 1.4.4. Relative units only —
 * absolute px would defeat both this control and the user's own
 * browser settings.
 */
:root,
:root[data-text-size="medium"] {
    --text-scale: 1;
}
:root[data-text-size="small"] {
    --text-scale: 0.875;
}
:root[data-text-size="large"] {
    --text-scale: 1.25;
}
:root[data-text-size="x-large"] {
    --text-scale: 1.5;
}

body {
    font-size: calc(1rem * var(--text-scale));
}
</style>
