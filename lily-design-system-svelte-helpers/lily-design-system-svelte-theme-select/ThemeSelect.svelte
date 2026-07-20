<script lang="ts" module>
    import type { Snippet } from "svelte";

    /** Arguments passed to a custom `children` snippet. */
    export type ChildArgs = {
        /** The theme slugs to render as `<option>` elements. */
        themes: string[];
        /** Currently selected theme slug. */
        value: string;
        /** Apply a theme imperatively (also writes back to `value`). */
        setTheme: (theme: string) => void;
        /** `name` attribute of the `<select>`. */
        name: string;
        /** Resolve a slug to its display label. */
        labelFor: (theme: string) => string;
    };

    /** Public props for ThemeSelect. See `spec/index.md` §4 for the contract. */
    export type Props = {
        /** Accessible label for the `<select>`. */
        label: string;
        /**
         * Text of the always-displayed placeholder option. The closed
         * `<select>` shows this instead of the selected theme name, so the
         * control stays as narrow as this word. Defaults to `label`.
         */
        placeholder?: string;
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
        /** `name` attribute of the `<select>`. */
        name?: string;
        /** File extension appended to each slug when constructing the URL. */
        extension?: string;
        /** Element that receives `data-theme`. Defaults to document.documentElement. */
        target?: HTMLElement | null;
        /** Optional pretty labels per slug. */
        themeLabels?: Record<string, string>;
        /** Custom rendering of the `<option>` elements. */
        children?: Snippet<[ChildArgs]>;
        /** Called after the select applies a new theme. */
        onChange?: (theme: string) => void;
        /** Extra CSS class on the `<select>` root. */
        class?: string;
        /** Spread props onto the root `<select>`. */
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
        placeholder,
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
        // Title-case each hyphen-separated word so a slug like
        // "united-kingdom-national-health-service-england-for-patients"
        // renders as "United Kingdom National Health Service England For
        // Patients" rather than a half-capitalised hyphenated string.
        return theme
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    function getManagedLink(): HTMLLinkElement {
        const selector = `link[data-lily-theme-select="${name}"]`;
        let link = document.head.querySelector<HTMLLinkElement>(selector);
        if (!link) {
            link = document.createElement("link");
            link.rel = "stylesheet";
            link.setAttribute("data-lily-theme-select", name);
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

    /**
     * The `<select>` is never bound to `value`: its own selection snaps back
     * to the placeholder option after every change, so the closed control
     * always reads `placeholder ?? label` rather than the active theme name.
     * The real selection lives in `value`.
     */
    function handleChange(event: Event & { currentTarget: HTMLSelectElement }): void {
        const el = event.currentTarget;
        const chosen = el.value;
        el.value = "";
        if (chosen) value = chosen;
        (restProps.onchange as ((event: Event) => void) | undefined)?.(event);
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
</script>

<select
    class={`theme-select ${className}`.trim()}
    aria-label={label}
    {name}
    {...restProps}
    onchange={handleChange}
>
    <option class="theme-select-option theme-select-placeholder" value="" selected
        >{placeholder ?? label}</option
    >
    {#if children}
        {@render children({ themes, value: value ?? "", setTheme, name, labelFor })}
    {:else}
        {#each themes as theme (theme)}
            <option class="theme-select-option" value={theme}>{labelFor(theme)}</option>
        {/each}
    {/if}
</select>
