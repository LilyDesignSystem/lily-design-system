<!--
  Example 2 — Two-way binding + onChange callback.

  `bind:value` exposes the active slug to surrounding code. `onChange`
  fires after each apply, which is the right hook for analytics, telling
  the server, or notifying a sibling component.
-->
<script lang="ts">
  import TextSizePicker from "../TextSizePicker.svelte";

  let size = $state("");

  function trackSizeChange(slug: string) {
    // e.g. fetch("/api/preferences", { method: "POST", body: JSON.stringify({ textSize: slug }) });
    console.info("text size changed:", slug);
  }
</script>

<TextSizePicker
  label="Text size"
  sizes={["small", "medium", "large", "x-large"]}
  bind:value={size}
  onChange={trackSizeChange}
/>

<p>Current text size: <strong>{size || "(resolving…)"}</strong></p>
