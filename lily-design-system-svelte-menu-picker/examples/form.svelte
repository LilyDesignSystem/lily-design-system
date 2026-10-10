<!--
  Example 2 — A form in the panel.

  The content receives `close`. The input is not a link or button, so
  typing does not close the panel; submitting calls `close()` itself.
-->
<script lang="ts">
  import MenuPicker from "../MenuPicker.svelte";
  let query = $state("");
</script>

<MenuPicker label="Menu">
  {#snippet children({ close })}
    <form
      onsubmit={(event) => {
        event.preventDefault();
        close();
      }}
    >
      <input type="search" aria-label="Search" bind:value={query} />
      <button type="submit" data-menu-picker-keep-open>Go</button>
    </form>
  {/snippet}
</MenuPicker>
