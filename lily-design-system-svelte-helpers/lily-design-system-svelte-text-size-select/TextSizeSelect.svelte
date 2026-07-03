<script lang="ts" module>
    import type { Snippet } from "svelte";

    /** Arguments passed to a custom `children` snippet. */
    export type ChildArgs = {
        /** The size slugs to render as `<option>` elements. */
        sizes: string[];
        /** Currently selected size slug. */
        value: string;
        /** Apply a size imperatively (also writes back to `value`). */
        setSize: (size: string) => void;
        /** `name` attribute of the `<select>`. */
        name: string;
        /** Resolve a slug to its display label. */
        labelFor: (size: string) => string;
    };

    /** Public props for TextSizeSelect. See `spec/index.md` §4 for the contract. */
    export type Props = {
        /** Accessible label for the `<select>`. */
        label: string;
        /** Available size slugs, e.g. ["small","medium","large","x-large"]. */
        sizes: string[];
        /** Currently selected size slug. Two-way bindable. */
        value?: string;
        /** Initial size when nothing else is supplied. */
        defaultValue?: string;
        /** If set, persist the selection to localStorage under this key. */
        storageKey?: string;
        /** `name` attribute of the `<select>`. */
        name?: string;
        /** Element that receives `data-text-size`. Defaults to document.documentElement. */
        target?: HTMLElement | null;
        /** Optional pretty labels per slug. */
        sizeLabels?: Record<string, string>;
        /** Custom rendering of the `<option>` elements. */
        children?: Snippet<[ChildArgs]>;
        /** Called after the select applies a new size. */
        onChange?: (size: string) => void;
        /** Extra CSS class on the `<select>` root. */
        class?: string;
        /** Spread props onto the root `<select>`. */
        [key: string]: unknown;
    };
</script>

<script lang="ts">
    let {
        class: className = "",
        label,
        sizes,
        value = $bindable(""),
        defaultValue,
        storageKey,
        name = "text-size",
        target,
        sizeLabels = {},
        children,
        onChange,
        ...restProps
    }: Props = $props();

    function labelFor(size: string): string {
        if (size in sizeLabels) return sizeLabels[size];
        // Title-case each hyphen-separated word so a slug like
        // "x-large" renders as "X Large".
        return size
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    function applySize(slug: string): void {
        if (typeof document === "undefined" || !slug) return;
        (target ?? document.documentElement).setAttribute("data-text-size", slug);
        if (storageKey) {
            try {
                localStorage.setItem(storageKey, slug);
            } catch {
                // ignore quota / privacy errors
            }
        }
        onChange?.(slug);
    }

    function setSize(slug: string): void {
        value = slug;
    }

    let initialised = false;

    $effect(() => {
        const current = value;

        if (!initialised) {
            initialised = true;
            let initial = current;
            if (!initial && storageKey) {
                try {
                    initial = localStorage.getItem(storageKey) ?? "";
                } catch {
                    // ignore privacy errors
                }
            }
            if (!initial) {
                initial =
                    defaultValue ??
                    (sizes.includes("medium") ? "medium" : sizes[0]) ??
                    "";
            }
            if (initial && initial !== current) {
                value = initial;
                return;
            }
        }

        if (current) applySize(current);
    });
</script>

<select
    class={`text-size-select ${className}`.trim()}
    aria-label={label}
    {name}
    bind:value
    {...restProps}
>
    {#if children}
        {@render children({ sizes, value: value ?? "", setSize, name, labelFor })}
    {:else}
        {#each sizes as size (size)}
            <option class="text-size-select-option" value={size}>{labelFor(size)}</option>
        {/each}
    {/if}
</select>
