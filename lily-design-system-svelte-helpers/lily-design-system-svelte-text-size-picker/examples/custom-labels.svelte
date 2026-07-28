<!--
  Example 4 — Custom labels.

  Default labels title-case the slug ("x-large" → "X Large"). Pass
  `sizeLabels` to override per-slug — useful for i18n, or for a house
  style that prefers "Extra Large" over the default's "X Large".
-->
<script lang="ts">
  import TextSizePicker from "../TextSizePicker.svelte";

  const labels = {
    small: "Petit",
    medium: "Moyen",
    large: "Grand",
    "x-large": "Très grand",
  };
</script>

<TextSizePicker
  label="Taille du texte"
  sizes={["small", "medium", "large", "x-large"]}
  sizeLabels={labels}
/>
