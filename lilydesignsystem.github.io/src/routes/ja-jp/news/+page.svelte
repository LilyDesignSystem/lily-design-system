<script lang="ts">
  import LocalizedPage from '#lib/components/LocalizedPage.svelte';

  let { data } = $props();
</script>

<LocalizedPage slug="news" locale="ja-jp" />

<section class="prose doc-render">
  {@html data.html}
</section>
