<!--
    Persistence — localStorage plus first-visit detection.

    (This slot previously held a <datalist>-backed combobox built on the
    old children snippet. That is no longer possible: the snippet
    replaces the button's glyph, and its output lives inside a <button>,
    where an <input> would be invalid HTML. For a genuine
    type-ahead over hundreds of locales, use a dedicated APG Combobox
    primitive and drive it with this package's exported pure helpers —
    see ../docs/custom-rendering.md.)

    Two props cover the whole returning-visitor lifecycle:

    - storageKey  — write the chosen code to localStorage on every
                    apply, and read it back on a fresh mount.
    - detectFromNavigator
                  — on a FIRST visit only (nothing stored, no `value`
                    supplied), resolve navigator.languages against the
                    supported list.

    Resolution order:

        value > storage > detectFromNavigator > defaultValue > "en" > locales[0]

    Storage beats detection deliberately: someone who explicitly chose
    English keeps English even when travelling with a device set to
    something else. Detection is off by default for a related reason —
    guessing a language and getting it wrong is worse than showing a
    known default, because the user must then navigate a page in a
    language they did not choose in order to find the control that
    fixes it.

    Navigator matching is two-step: an exact match first
    (case-insensitive, treating - and _ as equivalent), then a
    language-only match, so navigator "fr-CA" resolves to "fr" when
    "fr_CA" is not on offer.

    Storage errors — private mode, quota, disabled storage — are
    swallowed silently; the select keeps working in memory.

    IMPORTANT for a real app: localStorage cannot help the SERVER, so
    the first paint of every returning visit is still in the default
    language until hydration. For a locale switch that flash is far
    more disruptive than a theme flash, because the user reads a
    sentence in the wrong language. Prefer a cookie in production —
    see ssr-cookie.svelte and ../docs/ssr.md. The migration path is in
    ../docs/recipes.md.

    The matcher is exported if you want to run it server-side against
    an Accept-Language header instead:

        import { matchNavigatorLanguage } from "../LocaleSelect.svelte";
        matchNavigatorLanguage(["fr-CA", "fr"], ["en", "fr"]);  // "fr"
-->
<script lang="ts">
    import LocaleSelect, { localeName } from "../LocaleSelect.svelte";

    let locale = $state("");
</script>

<LocaleSelect
    label="Language"
    locales={["en", "fr", "fr_CA", "es", "de", "ar"]}
    bind:value={locale}
    storageKey="lily-locale"
    detectFromNavigator
/>

<p class="locale-select-status" aria-live="polite">
    Active language: {localeName(locale)}
</p>

<p>
    Reload the page: the choice persists via
    <code>localStorage["lily-locale"]</code>. Clear that key and reload
    to see <code>detectFromNavigator</code> resolve from your browser's
    language settings instead.
</p>
