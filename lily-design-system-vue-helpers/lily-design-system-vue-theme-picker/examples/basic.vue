<!--
    Example 1 — Basic usage.

    The minimum viable select: a label, a themes directory, and a slug
    list. The select resolves "light" as the initial active theme (since
    "light" is in the list), sets data-theme="light" on <html>, and
    injects a <link rel="stylesheet"> pointing at /assets/themes/light.css.

    The default markup is a <div class="theme-chooser"> holding a hidden
    input, a <button class="theme-chooser-button"> showing the half-circle
    glyph (◑, U+25D1), and a <ul class="theme-chooser-list" role="listbox">
    with one <li class="theme-chooser-option" role="option"> per slug.

    The status line is part of the basic pattern, not an add-on.
    ------------------------------------------------------------------
    The control is icon-only: the closed button shows a glyph and
    nothing else, so the active theme has no on-screen representation
    and is not announced as any control's value. The
    <p class="theme-chooser-status"> below is the compensating channel,
    and it is the default pattern this package ships — see
    ../docs/accessibility.md.

    Two details worth copying verbatim:

    - It is VISIBLE, not sr-only. Sighted users benefit too: with only a
      glyph on the closed button, the active theme is otherwise
      invisible, which matters for cognitive accessibility. If your
      design genuinely cannot spare the line, keep the element and hide
      it with the visually-hidden recipe in ../docs/styling.md rather
      than deleting it.

    - aria-live="polite" announces MUTATIONS only, so this stays silent
      on first paint and speaks once on each subsequent change. That is
      the intended behaviour: no announcement on page load, one polite
      announcement per user action, and no focus movement.
-->
<script setup lang="ts">
import { ref } from "vue";
import ThemeChooser from "../ThemeChooser.vue";

const theme = ref("");

/*
 * ThemeChooser keeps its own labelFor() internal and exposes it only
 * through the default scoped slot (which replaces the button glyph).
 * The status line below is outside the component, so mirror the
 * component's default label rule: title-case the slug. Pass the same
 * map to themeLabels if you override labels.
 */
function labelFor(slug: string): string {
    return slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
</script>

<template>
    <ThemeChooser
        label="Theme"
        themes-url="/assets/themes/"
        :themes="['light', 'dark', 'abyss']"
        v-model:value="theme"
    />

    <p class="theme-chooser-status" aria-live="polite">
        Active theme: {{ labelFor(theme) }}
    </p>
</template>
