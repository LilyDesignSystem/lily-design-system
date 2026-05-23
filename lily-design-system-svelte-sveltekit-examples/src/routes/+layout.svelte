<script lang="ts">
    import "$lib/css/nhs.css";
    import SkipLink from "$lib/components/SkipLink/SkipLink.svelte";

    let { children } = $props();
</script>

<SkipLink href="#content" label="Skip to main content" />
<div id="content">
    {@render children()}
</div>
