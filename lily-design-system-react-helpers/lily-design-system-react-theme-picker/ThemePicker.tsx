import * as React from "react";

/** Arguments passed to a custom `children` render prop. */
export type ChildArgs = {
    /** The theme slugs to render as options. */
    themes: string[];
    /** Currently selected theme slug. */
    value: string;
    /** Apply a theme imperatively (also updates internal state / triggers onChange). */
    setTheme: (theme: string) => void;
    /** Shared `name` attribute for the radio inputs. */
    name: string;
    /** Resolve a slug to its display label. */
    labelFor: (theme: string) => string;
};

/** Public props for ThemePicker. See `spec.md` §4 for the contract. */
export type Props = Omit<
    React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
    "onChange" | "children"
> & {
    /** Accessible label for the radiogroup. */
    label: string;
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
    /** `name` attribute shared by the radio inputs. */
    name?: string;
    /** File extension appended to each slug when constructing the URL. */
    extension?: string;
    /** Element that receives `data-theme`. Defaults to document.documentElement. */
    target?: HTMLElement | null;
    /** Optional pretty labels per slug. */
    themeLabels?: Record<string, string>;
    /** Custom render prop for the options. */
    children?: (args: ChildArgs) => React.ReactNode;
    /** Called after the picker applies a new theme. */
    onChange?: (theme: string) => void;
    /** Extra CSS class on the <fieldset> root. */
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

export function ThemePicker({
    label,
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

    function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setTheme(e.target.value);
    }

    return (
        <fieldset
            className={`theme-picker ${className}`.trim()}
            role="radiogroup"
            aria-label={label}
            {...restProps}
        >
            {children
                ? children({
                      themes,
                      value: currentValue ?? "",
                      setTheme,
                      name,
                      labelFor,
                  })
                : themes.map((theme) => (
                      <label key={theme} className="theme-picker-option">
                          <input
                              type="radio"
                              name={name}
                              value={theme}
                              checked={currentValue === theme}
                              onChange={onInputChange}
                          />
                          <span className="theme-picker-option-label">
                              {labelFor(theme)}
                          </span>
                      </label>
                  ))}
        </fieldset>
    );
}

export default ThemePicker;
