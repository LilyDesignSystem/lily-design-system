<!--
  Example 3 — Replacing the icon.

  `icon` replaces the cog inside the button, never the panel's
  content. The accessible name still comes from `label`, so keep the icon
  decorative.
-->
<script lang="ts">
  import SettingsPicker from "../SettingsPicker.svelte";
</script>

<SettingsPicker label="More">
  {#snippet icon({ open })}
    <span aria-hidden="true">{open ? "×" : "⋯"}</span>
  {/snippet}
  <a href="/help/">Help</a>
</SettingsPicker>
