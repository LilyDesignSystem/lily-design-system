<!--
  Example 3 — localStorage persistence.

  Pass `storageKey` to make the picker remember the user's choice across
  reloads. On a fresh mount the picker reads the stored slug and re-
  applies it before the user interacts. Quota / private-mode errors are
  silently swallowed.

  This is client-side only: the first server-rendered paint still uses
  the default resolution order (no `value` prop, no defaultValue here,
  so "medium"), and the stored size is applied after hydration. If that
  one-frame flash of the wrong size matters for your page, see
  ./sveltekit-cookie/ for a server-resolved alternative.
-->
<script lang="ts">
  import TextSizePicker from "../TextSizePicker.svelte";
</script>

<TextSizePicker
  label="Text size"
  sizes={["small", "medium", "large", "x-large"]}
  storageKey="my-app:text-size"
/>
