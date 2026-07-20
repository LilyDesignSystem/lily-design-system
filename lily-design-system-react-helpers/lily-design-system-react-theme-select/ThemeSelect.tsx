import * as React from "react";

/** Arguments passed to a custom `children` render prop. */
export type ChildArgs = {
    /** The theme slugs to render as `<option>` elements. */
    themes: string[];
    /** Currently selected theme slug. */
    value: string;
    /** Apply a theme imperatively (also updates internal state / triggers onChange). */
    setTheme: (theme: string) => void;
    /** `name` attribute of the `<select>`. */
    name: string;
    /** Resolve a slug to its display label. */
    labelFor: (theme: string) => string;
};

/** Public props for ThemeSelect. See `spec/index.md` §4 for the contract. */
export type Props = Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "onChange" | "children" | "value" | "defaultValue"
> & {
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
    /** Currently selected theme slug. When supplied, the component is controlled. */
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
    /** Custom render prop for the `<option>` elements; rendered inside the `<select>`. */
    children?: (args: ChildArgs) => React.ReactNode;
    /** Called after the select applies a new theme. */
    onChange?: (theme: string) => void;
    /** Extra CSS class on the `<select>` root. */
    className?: string;
};

/** Normalize the themes directory URL to end with exactly one "/". */
export function normalizeThemesUrl(themesUrl: string): string {
    return themesUrl.endsWith("/") ? themesUrl : themesUrl + "/";
}

/** Construct the href for a given theme slug. */
export function themeHref(
    themesUrl: string,
    slug: string,
    extension: string,
): string {
    return normalizeThemesUrl(themesUrl) + slug + extension;
}

function resolveInitialTheme(
    value: string | undefined,
    storageKey: string | undefined,
    defaultValue: string | undefined,
    themes: string[],
): string {
    if (value) return value;
    if (storageKey) {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) return stored;
        } catch {
            // ignore privacy errors
        }
    }
    if (defaultValue) return defaultValue;
    if (themes.includes("light")) return "light";
    return themes[0] ?? "";
}

export function ThemeSelect({
    label,
    placeholder,
    themesUrl,
    themes,
    value,
    defaultValue,
    storageKey,
    name = "theme",
    extension = ".css",
    target,
    themeLabels = {},
    children,
    onChange,
    className = "",
    ...restProps
}: Props): React.ReactElement {
    const isControlled = value !== undefined;

    // Internal state for uncontrolled mode. Starts empty; resolved
    // in the first effect after mount (SSR-safe).
    const [internalValue, setInternalValue] = React.useState<string>(
        isControlled ? value : "",
    );

    // Mirror controlled prop into local state so the render branch
    // is uniform.
    const currentValue = isControlled ? value : internalValue;

    function labelFor(theme: string): string {
        if (theme in themeLabels) return themeLabels[theme];
        return theme.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
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
        if (!isControlled) setInternalValue(slug);
        // For controlled mode, the consumer handles `value` via onChange,
        // but we still apply the theme to the DOM here so behaviour is
        // consistent. The effect below will also run when value updates.
        applyTheme(slug);
    }

    // Resolve initial value on mount when uncontrolled.
    const initialisedRef = React.useRef(false);
    React.useEffect(() => {
        if (initialisedRef.current) return;
        initialisedRef.current = true;

        const initial = resolveInitialTheme(
            currentValue || undefined,
            storageKey,
            defaultValue,
            themes,
        );
        if (!initial) return;

        if (isControlled) {
            applyTheme(initial);
        } else {
            // setInternalValue triggers another render; the value-change
            // effect below will run applyTheme.
            if (initial !== internalValue) {
                setInternalValue(initial);
            } else {
                applyTheme(initial);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Re-apply whenever the resolved value changes.
    React.useEffect(() => {
        if (!initialisedRef.current) return;
        if (!currentValue) return;
        applyTheme(currentValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentValue]);

    /**
     * The `<select>` is never bound to the resolved theme: its own DOM
     * selection snaps back to the placeholder option after every change,
     * so the closed control always reads `placeholder ?? label` rather
     * than the active theme name. The real selection lives in
     * `value` / `internalValue`.
     */
    function onSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const el = e.target;
        const chosen = el.value;
        el.value = ""; // snap back to the placeholder
        if (chosen) setTheme(chosen);
    }

    return (
        <select
            className={`theme-select ${className}`.trim()}
            aria-label={label}
            name={name}
            value=""
            onChange={onSelectChange}
            {...restProps}
        >
            <option
                className="theme-select-option theme-select-placeholder"
                value=""
            >
                {placeholder ?? label}
            </option>
            {children
                ? children({
                      themes,
                      value: currentValue ?? "",
                      setTheme,
                      name,
                      labelFor,
                  })
                : themes.map((theme) => (
                      <option
                          key={theme}
                          className="theme-select-option"
                          value={theme}
                      >
                          {labelFor(theme)}
                      </option>
                  ))}
        </select>
    );
}

export default ThemeSelect;
