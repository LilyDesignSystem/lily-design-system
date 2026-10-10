<!--
  Layout that renders the text-size picker and writes the user's choice
  back to a cookie so the next SSR pass sees it.
-->
<script lang="ts">
  import TextSizePicker from "../../TextSizePicker.svelte";
  import type { Snippet } from "svelte";

  let {
    data,
    children,
  }: {
    data: { textSize: string };
    children: Snippet;
  } = $props();

  let size = $state(data.textSize);

  async function persistTextSizeCookie(slug: string) {
    await fetch("/api/text-size", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ textSize: slug }),
    });
  }
</script>

<header>
  <TextSizePicker
    label="Text size"
    sizes={["small", "medium", "large", "x-large"]}
    bind:value={size}
    onChange={persistTextSizeCookie}
  />
</header>

<main>
  {@render children()}
</main>
