<!--
  Example 3 — localStorage persistence.

  Pass `storageKey` to make the select remember the user's choice across
  reloads. On a fresh mount the select reads the stored slug and re-
  applies it before the user interacts. Quota / private-mode errors are
  silently swallowed.
-->
<script lang="ts">
  import ThemeSelect from "../ThemeSelect.svelte";
</script>

<ThemeSelect
  label="Theme"
  themesUrl="/assets/themes/"
  themes={["light", "dark", "abyss"]}
  storageKey="my-app:theme"
/>
