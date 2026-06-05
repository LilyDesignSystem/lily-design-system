# Recipes

Short solutions to common adjacent problems. Each recipe is the
smallest code that solves the problem; production code may want more
error handling.

## Follow the OS colour scheme on first visit

```svelte
<script lang="ts">
  import ThemePicker from "../ThemePicker.svelte";

  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches;
</script>

<ThemePicker
  label="Theme"
  themesUrl="/assets/themes/"
  themes={["light", "dark"]}
  defaultValue={prefersDark ? "dark" : "light"}
  storageKey="my-app:theme"
/>
```

The user's explicit choice (via `storageKey`) wins on later visits.

## Track OS colour scheme changes live

```svelte
<script lang="ts">
  import ThemePicker from "../ThemePicker.svelte";
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

<ThemePicker
  label="Theme"
  themesUrl="/assets/themes/"
  themes={["light", "dark"]}
  bind:value={theme}
/>
```

## Read a theme cookie before render (SvelteKit)

See [`../examples/sveltekit-cookie/`](../examples/sveltekit-cookie/)
for the full recipe.

## Migrate from a localStorage-only picker to a cookie-backed one

1. Keep `storageKey` for now so existing users don't lose their
   preference.
2. In `onChange`, also `fetch("/api/theme", { method: "POST", body: ... })`
   to write the cookie.
3. On the server, prefer the cookie. On the client, prefer the
   server-supplied value via `value` (which short-circuits the
   storage read).

## Build a flyout / dropdown UI

Use [custom-rendering](./custom-rendering.md) to swap the radio list
for a button-triggered popover. Keep the picker's fieldset around the
flyout *trigger* so screen readers still hear the group label.

## Serve themes from a CDN

```svelte
<ThemePicker
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
<ThemePicker
  themesUrl="/assets/themes/"
  themes={["light", "dark"]}
  extension=".css?v=2025-06-05"
  label="Theme"
/>
```

The extension is concatenated verbatim, so anything that comes after
the slug works.

## Multiple regions with independent themes

See [`../examples/multiple-pickers.svelte`](../examples/multiple-pickers.svelte).
Each picker gets a distinct `name` (so the radios and managed
`<link>`s don't collide) and a distinct `target` (so `data-theme`
goes on the section root rather than `<html>`).
