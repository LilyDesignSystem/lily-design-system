<script lang="ts">
    // DigitalObjectIdentifierLink: a link to a Digital Object Identifier through the https://doi.org/ resolver.
    // The display text is the consumer's children, or the DOI itself when none is given.
    import type { Snippet } from "svelte";
    let {
        class: className = "",
        doi,
        children = undefined,
        ...restProps
    }: {
        /** The Digital Object Identifier, e.g. "10.1000/xyz123". */
        doi: string;
        /** Link display text; the DOI when omitted. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- DigitalObjectIdentifierLink.svelte -->
<a
    class={`digital-object-identifier-link ${className}`}
    href={`https://doi.org/${doi}`}
    rel="noopener noreferrer"
    {...restProps}
>
    {#if children}{@render children()}{:else}{doi}{/if}
</a>
