<script lang="ts">
  let { data } = $props();
</script>

<svelte:head>
  <title>News — Lily Design System</title>
  <meta
    name="description"
    content="Announcements, release highlights, project status, and press contacts for the Lily Design System."
  />
</svelte:head>

<section class="hero">
  <p class="hero-eyebrow">News</p>
  <h1>Announcements and status</h1>
  <p class="hero-tagline">
    Rendered from the repository's canonical
    <a
      href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/NEWS.md"
      >NEWS.md</a
    >
    at build time — the engineering record behind it is the
    <a
      href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/CHANGELOG.md"
      >changelog</a
    >, and the forward plan is the <a href="/roadmap/">roadmap</a>.
  </p>
</section>

<section class="prose doc-render">
  {@html data.html}
</section>
