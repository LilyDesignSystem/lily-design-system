<!--
  Example 6 — Multiple pickers in one page.

  Each picker gets a distinct `name` and its own `target`. `name` keeps
  the two hidden-input groups from colliding in a shared <form>; `target`
  scopes which DOM subtree receives data-text-size, so one picker cannot
  clobber the other's effect.

  This is useful for: an app shell with independently resizable "main
  content" and "sidebar" regions, or a print-preview column that should
  keep its own size while the surrounding editor changes.

  Without a distinct `target` per picker, whichever picker fires last
  wins — both would otherwise write data-text-size to the same default
  <html> element.
-->
<script lang="ts">
  import TextSizePicker from "../TextSizePicker.svelte";

  let mainRegion: HTMLElement | undefined = $state();
  let sidebarRegion: HTMLElement | undefined = $state();
</script>

<section bind:this={mainRegion}>
  <TextSizePicker
    label="Main content text size"
    name="main-text-size"
    sizes={["small", "medium", "large", "x-large"]}
    target={mainRegion}
  />
</section>

<aside bind:this={sidebarRegion}>
  <TextSizePicker
    label="Sidebar text size"
    name="sidebar-text-size"
    sizes={["small", "medium", "large"]}
    target={sidebarRegion}
  />
</aside>
