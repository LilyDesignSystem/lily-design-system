<script lang="ts">
  let { data } = $props();
</script>

<svelte:head>
  <title>Roadmap — Lily Design System</title>
  <meta
    name="description"
    content="What the Lily Design System is working on and planning: the phased improvement plan, rendered from the repository's canonical plan.md."
  />
</svelte:head>

<section class="hero">
  <p class="hero-eyebrow">Roadmap</p>
  <h1>What we're working on</h1>
  <p class="hero-tagline">
    The phased improvement plan, rendered from the repository's canonical
    <a
      href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/plan.md"
      >plan.md</a
    >
    at build time. Its checklist lives in
    <a
      href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/tasks.md"
      >tasks.md</a
    >; completed work is folded into the
    <a
      href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/CHANGELOG.md"
      >changelog</a
    >. Like any roadmap, it can change.
  </p>
</section>

<section class="prose doc-render">
  {@html data.html}
</section>
