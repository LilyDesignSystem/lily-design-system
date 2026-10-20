<script lang="ts">
  import LocalizedPage from '#lib/components/LocalizedPage.svelte';

  let { data } = $props();
</script>

<LocalizedPage slug="roadmap" locale="fi-fi" />

<section class="prose doc-render">
  {@html data.html}
</section>
