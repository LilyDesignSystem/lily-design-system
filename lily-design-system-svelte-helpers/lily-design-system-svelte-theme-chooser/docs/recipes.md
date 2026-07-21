# Recipes

Short solutions to common adjacent problems. Each recipe is the
smallest code that solves the problem; production code may want more
error handling.

## Follow the OS colour scheme on first visit

Pass `detectFromSystem` — you no longer need to resolve the media query
yourself:

```svelte
<script lang="ts">
  import ThemeChooser from "../ThemeChooser.svelte";
</script>

<ThemeChooser
  label="Theme"
  themesUrl="/assets/themes/"
  themes={["light", "dark"]}
  detectFromSystem
  storageKey="my-app:theme"
/>
```

Detection sits below storage in the resolution order, so the user's
explicit choice wins on later visits. It resolves to `"dark"` or
`"light"` only when that slug is in `themes`; otherwise resolution
falls through to `defaultValue`.

To use the underlying helper directly — on the server, in a store, or
to decide something else — import it:

```ts
import { matchSystemTheme } from "../ThemeChooser.svelte";

matchSystemTheme(["light", "dark"]);  // "dark" | "light"
matchSystemTheme(["solarized"]);      // "" — neither slug on offer
```

It returns `""` rather than throwing when `matchMedia` is unavailable,
so it is safe to call during SSR.

## Track OS colour scheme changes live

`detectFromSystem` resolves the preference **once**, on first mount. To
keep following it for the whole session, add your own listener and
write to the bound `value`:

```svelte
<script lang="ts">
  import ThemeChooser from "../ThemeChooser.svelte";
  import { onMount } from "svelte";

  let theme = $state("");

  onMount(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      theme = e.matches ? "dark" : "light";
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  });
</script>

<ThemeChooser
  label="Theme"
  themesUrl="/assets/themes/"
  themes={["light", "dark"]}
  bind:value={theme}
/>
```

## Read a theme cookie before render (SvelteKit)

See [`../examples/sveltekit-cookie/`](../examples/sveltekit-cookie/)
for the full recipe.

## Migrate from a localStorage-only select to a cookie-backed one

1. Keep `storageKey` for now so existing users don't lose their
   preference.
2. In `onChange`, also `fetch("/api/theme", { method: "POST", body: ... })`
   to write the cookie.
3. On the server, prefer the cookie. On the client, prefer the
   server-supplied value via `value` (which short-circuits the
   storage read).

## Style the flyout

The control **is** a button-triggered flyout now — no custom rendering
needed. What it does not ship is the CSS that positions the popup; see
[styling.md § Positioning the listbox](./styling.md#positioning-the-listbox).

To change what the *trigger* looks like, use
[custom-rendering](./custom-rendering.md): the `children` snippet
replaces the glyph inside the button.

## Show the active theme next to the control

The closed control is one glyph, so nothing on the page states the
active theme unless you state it:

```svelte
<script lang="ts">
  import ThemeChooser, { themeName } from "../ThemeChooser.svelte";
  let theme = $state("");
</script>

<ThemeChooser label="Theme" themesUrl="/assets/themes/" themes={["light", "dark"]} bind:value={theme} />

<p class="theme-chooser-status" aria-live="polite">
  Active theme: {themeName(theme)}
</p>
```

`themeName` is the same function the options use, so the two cannot
drift apart. Reasoning: [accessibility.md § The status region](./accessibility.md#the-status-region).

## Serve themes from a CDN

```svelte
<ThemeChooser
  themesUrl="https://cdn.example.com/lily-themes/"
  themes={["light", "dark", "abyss"]}
  label="Theme"
/>
```

The CDN must allow cross-origin stylesheet loading (a stylesheet
served from a different origin does not need CORS, but a `<link
crossorigin="…">` attribute is needed if you also need
`document.styleSheets[].cssRules` access from the same origin).

## Cache-bust a theme

```svelte
<ThemeChooser
  themesUrl="/assets/themes/"
  themes={["light", "dark"]}
  extension=".css?v=2025-06-05"
  label="Theme"
/>
```

The extension is concatenated verbatim, so anything that comes after
the slug works.

## Multiple regions with independent themes

See [`../examples/multiple-choosers.svelte`](../examples/multiple-choosers.svelte).
Each select gets a distinct `name` (so the hidden inputs and the
managed `<link>`s don't collide) and a distinct `target` (so
`data-theme` goes on the section root rather than `<html>`).

---

Lily™ and Lily Design System™ are trademarks.
