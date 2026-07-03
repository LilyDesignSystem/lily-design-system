<!--
  Example 5 — Custom rendering via the `children` snippet.

  When the default radio-list markup isn't enough, take over completely.
  The snippet receives:
    - themes:   the slug list
    - value:    the active slug
    - setTheme: imperatively apply a slug (also updates `value`)
    - name:     the radio `name` (shared identity for the select)
    - labelFor: the resolved display label for a slug

  Below, we render a row of swatch buttons. Each button:
    - exposes its pressed state via aria-pressed,
    - sets data-theme on itself so consumer CSS can preview the swatch
      colours via the same :root[data-theme] cascade.
-->
<script lang="ts">
  import ThemeSelect from "../ThemeSelect.svelte";
</script>

<ThemeSelect
  label="Theme"
  themesUrl="/assets/themes/"
  themes={["light", "dark", "abyss", "cupcake", "dracula"]}
>
  {#snippet children({ themes, value, setTheme, labelFor })}
    {#each themes as t (t)}
      <button
        type="button"
        class="theme-select-swatch"
        data-theme={t}
        aria-pressed={value === t}
        onclick={() => setTheme(t)}
      >
        {labelFor(t)}
      </button>
    {/each}
  {/snippet}
</ThemeSelect>
