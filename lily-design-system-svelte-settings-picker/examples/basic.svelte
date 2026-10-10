<!--
  Example 1 — Basic usage.

  The app provides the panel's content: the package ships no links and no
  English. `label` names the button, the panel and the tooltip.
-->
<script lang="ts">
  import SettingsPicker from "../SettingsPicker.svelte";
</script>

<SettingsPicker label="Settings">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about/">About Us</a></li>
    <li><button type="button">Sign out</button></li>
  </ul>
</SettingsPicker>
