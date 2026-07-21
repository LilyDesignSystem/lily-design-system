<!--
  Example 8 — Follow the OS `prefers-color-scheme`.

  Pass `detectFromSystem`. You no longer need to resolve the media
  query yourself and feed it in as `defaultValue` — the select owns
  this now, mirroring `detectFromNavigator` on locale-chooser.

  Resolution order:

      value > storage > detectFromSystem > defaultValue > "light" > themes[0]

  So detection only fires when the consumer supplied no value AND
  nothing was stored: a user who explicitly picked a theme keeps it
  when they later flip their OS setting.

  It resolves to "dark" or "light" only when that slug is actually in
  `themes`; otherwise it returns "" and resolution falls through to the
  next step. It also returns "" — rather than throwing — when
  matchMedia is unavailable, which is the case during SSR and under
  jsdom.

  detectFromSystem resolves ONCE, on mount. To keep tracking the OS
  preference for the whole session, add a matchMedia listener and write
  to the bound `value`:

      onMount(() => {
        const mql = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = (e: MediaQueryListEvent) => {
          theme = e.matches ? "dark" : "light";
        };
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
      });

  The underlying helper is exported if you want to call it directly:

      import { matchSystemTheme } from "../ThemeChooser.svelte";
      matchSystemTheme(["light", "dark"]);  // "dark" | "light"
      matchSystemTheme(["solarized"]);      // ""
-->
<script lang="ts">
  import ThemeChooser from "../ThemeChooser.svelte";

  let theme = $state("");
</script>

<ThemeChooser
  label="Theme"
  themesUrl="/assets/themes/"
  themes={["light", "dark"]}
  detectFromSystem
  bind:value={theme}
  storageKey="my-app:theme"
/>
