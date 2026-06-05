<script lang="ts" module>
    import type { Snippet } from "svelte";

    /** Arguments passed to a custom `children` snippet. */
    export type ChildArgs = {
        /** The theme slugs to render as options. */
        themes: string[];
        /** Currently selected theme slug. */
        value: string;
        /** Apply a theme imperatively (also writes back to `value`). */
        setTheme: (theme: string) => void;
        /** Shared `name` attribute for the radio inputs. */
        name: string;
        /** Resolve a slug to its display label. */
        labelFor: (theme: string) => string;
    };

    /** Public props for ThemePicker. See `spec.md` §4 for the contract. */
    export type Props = {
        /** Accessible label for the radiogroup. */
        label: string;
        /** Base URL of the themes directory, e.g. "/assets/themes/". */
        themesUrl: string;
        /** Available theme slugs. */
        themes: string[];
        /** Currently selected theme slug. Two-way bindable. */
        value?: string;
        /** Initial theme when nothing else is supplied. */
        defaultValue?: string;
        /** If set, persist the selection to localStorage under this key. */
        storageKey?: string;
        /** `name` attribute shared by the radio inputs. */
        name?: string;
        /** File extension appended to each slug when constructing the URL. */
        extension?: string;
        /** Element that receives `data-theme`. Defaults to document.documentElement. */
        target?: HTMLElement | null;
        /** Optional pretty labels per slug. */
        themeLabels?: Record<string, string>;
        /** Custom rendering of the options. */
        children?: Snippet<[ChildArgs]>;
        /** Called after the picker applies a new theme. */
        onChange?: (theme: string) => void;
        /** Extra CSS class on the <fieldset> root. */
        class?: string;
        /** Spread props onto the root <fieldset>. */
        [key: string]: unknown;
    };

    /** Normalise the themes directory URL to end with exactly one "/". */
    export function normaliseThemesUrl(themesUrl: string): string {
        return themesUrl.endsWith("/") ? themesUrl : themesUrl + "/";
    }

    /** Construct the href for a given theme slug. */
    export function themeHref(themesUrl: string, slug: string, extension: string): string {
        return normaliseThemesUrl(themesUrl) + slug + extension;
    }
</script>

<script lang="ts">
    let {
        class: className = "",
        label,
        themesUrl,
        themes,
        value = $bindable(""),
        defaultValue,
        storageKey,
        name = "theme",
        extension = ".css",
        target,
        themeLabels = {},
        children,
        onChange,
        ...restProps
    }: Props = $props();

    function labelFor(theme: string): string {
        if (theme in themeLabels) return themeLabels[theme];
        return theme.charAt(0).toUpperCase() + theme.slice(1);
    }

    function getManagedLink(): HTMLLinkElement {
        const selector = `link[data-lily-theme-picker="${name}"]`;
        let link = document.head.querySelector<HTMLLinkElement>(selector);
        if (!link) {
            link = document.createElement("link");
            link.rel = "stylesheet";
            link.setAttribute("data-lily-theme-picker", name);
            document.head.appendChild(link);
        }
        return link;
    }

    function applyTheme(slug: string): void {
        if (typeof document === "undefined" || !slug) return;
        getManagedLink().href = themeHref(themesUrl, slug, extension);
        (target ?? document.documentElement).setAttribute("data-theme", slug);
        if (storageKey) {
            try {
                localStorage.setItem(storageKey, slug);
            } catch {
                // ignore quota / privacy errors
            }
        }
        onChange?.(slug);
    }

    function setTheme(slug: string): void {
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
                    (themes.includes("light") ? "light" : themes[0]) ??
                    "";
            }
            if (initial && initial !== current) {
                value = initial;
                return;
            }
        }

        if (current) applyTheme(current);
    });

    function onInputChange(e: Event) {
        const next = (e.target as HTMLInputElement).value;
        setTheme(next);
    }
</script>

<fieldset
    class={`theme-picker ${className}`.trim()}
    role="radiogroup"
    aria-label={label}
    {...restProps}
>
    {#if children}
        {@render children({ themes, value: value ?? "", setTheme, name, labelFor })}
    {:else}
        {#each themes as theme (theme)}
            <label class="theme-picker-option">
                <input
                    type="radio"
                    {name}
                    value={theme}
                    checked={value === theme}
                    onchange={onInputChange}
                />
                <span class="theme-picker-option-label">{labelFor(theme)}</span>
            </label>
        {/each}
    {/if}
</fieldset>
