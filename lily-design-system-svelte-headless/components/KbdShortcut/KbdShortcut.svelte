<script lang="ts">
    // KbdShortcut component
    //
    // A headless keyboard shortcut: an outer <kbd> holding one inner <kbd> per key,
    // with a decorative separator between keys. Use Kbd for a single key.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   keys — string[], required. The key names, in order, e.g. ["Ctrl", "K"].
    //   separator — string, default "+". Decorative text between keys (aria-hidden).
    //   label — string, optional. Spoken form; becomes aria-label on the root.
    //   ...restProps — additional HTML attributes spread onto the root <kbd>.
    //
    // Keyboard:
    //   - None; display only
    //
    // Accessibility:
    //   - Separators are aria-hidden so screen readers read the keys
    //   - label (optional) overrides the spoken form, e.g. "Control K"
    //
    // Internationalization:
    //   - Key names are consumer-supplied; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no icons for keys

    let {
        class: className = "",
        keys,
        separator = "+",
        label = undefined,
        ...restProps
    }: {
        /** Key names, in order. */
        keys: string[];
        /** Decorative separator between keys. */
        separator?: string;
        /** Optional spoken form (aria-label). */
        label?: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- KbdShortcut.svelte -->
<kbd class={`kbd-shortcut ${className}`} aria-label={label} {...restProps}>
    {#each keys as key, i (i)}
        {#if i > 0}<span class="kbd-shortcut-separator" aria-hidden="true">{separator}</span>{/if}<kbd class="kbd-shortcut-key">{key}</kbd>
    {/each}
</kbd>
