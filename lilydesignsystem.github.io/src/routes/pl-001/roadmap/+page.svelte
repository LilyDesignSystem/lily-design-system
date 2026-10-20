<script lang="ts">
  import LocalizedPage from '#lib/components/LocalizedPage.svelte';

  let { data } = $props();
</script>

<LocalizedPage slug="roadmap" locale="pl-001" />

<section class="prose doc-render">
  {@html data.html}
</section>
