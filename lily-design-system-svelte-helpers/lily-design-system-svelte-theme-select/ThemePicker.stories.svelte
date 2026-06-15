<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import ThemeSelect from "./ThemeSelect.svelte";

  const { Story } = defineMeta({
    title: "Helpers/ThemeSelect",
    component: ThemeSelect,
    args: {
      label: "Theme",
      themesUrl: "/assets/themes/",
      themes: ["light", "dark", "abyss"],
    },
  });
</script>

<Story name="Default" tags={["autodocs"]} />

<Story
  name="With persistence"
  args={{
    label: "Theme",
    themesUrl: "/assets/themes/",
    themes: ["light", "dark", "abyss"],
    storageKey: "lily-theme-story",
  }}
/>

<Story
  name="Custom labels"
  args={{
    label: "Thème",
    themesUrl: "/assets/themes/",
    themes: ["light", "dark"],
    themeLabels: { light: "Clair", dark: "Sombre" },
  }}
/>

<Story
  name="Many themes"
  args={{
    label: "Lily theme",
    themesUrl: "/assets/themes/",
    themes: [
      "light",
      "dark",
      "abyss",
      "cupcake",
      "dracula",
      "emerald",
      "forest",
      "nord",
      "sunset",
      "synthwave",
    ],
  }}
/>

<Story name="Custom rendering">
  {#snippet template(args)}
    <ThemeSelect {...args}>
      {#snippet children({ themes, value, setTheme, labelFor })}
        {#each themes as t (t)}
          <button
            type="button"
            data-theme={t}
            aria-pressed={value === t}
            onclick={() => setTheme(t)}
            style="padding: 0.25rem 0.5rem; margin: 0 0.25rem;"
          >
            {labelFor(t)}
          </button>
        {/each}
      {/snippet}
    </ThemeSelect>
  {/snippet}
</Story>
