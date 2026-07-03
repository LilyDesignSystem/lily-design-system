import * as React from "react";

/** Arguments passed to a custom `children` render prop. */
export type ChildArgs = {
    /** The size slugs to render as `<option>` elements. */
    sizes: string[];
    /** Currently selected size slug. */
    value: string;
    /** Apply a size imperatively (also updates internal state / triggers onChange). */
    setSize: (size: string) => void;
    /** `name` attribute of the `<select>`. */
    name: string;
    /** Resolve a slug to its display label. */
    labelFor: (size: string) => string;
};

/** Public props for TextSizeSelect. See `spec/index.md` §4 for the contract. */
export type Props = Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "onChange" | "children" | "value" | "defaultValue"
> & {
    /** Accessible label for the `<select>`. */
    label: string;
    /** Available size slugs, e.g. ["small","medium","large","x-large"]. */
    sizes: string[];
    /** Currently selected size slug. When supplied, the component is controlled. */
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
    /** Custom render prop for the `<option>` elements; rendered inside the `<select>`. */
    children?: (args: ChildArgs) => React.ReactNode;
    /** Called after the select applies a new size. */
    onChange?: (size: string) => void;
    /** Extra CSS class on the `<select>` root. */
    className?: string;
};

// ------------------------------------------------------------------
// Pure helpers (exported so consumers can reuse them)
// ------------------------------------------------------------------

/**
 * Title-case a size slug per hyphen-separated word, so a slug like
 * "x-large" renders as "X Large". The word "default" is never emitted.
 */
export function titleCaseSize(size: string): string {
    return size
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function resolveInitialSize(
    value: string | undefined,
    storageKey: string | undefined,
    defaultValue: string | undefined,
    sizes: string[],
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
    if (sizes.includes("medium")) return "medium";
    return sizes[0] ?? "";
}

export function TextSizeSelect({
    label,
    sizes,
    value,
    defaultValue,
    storageKey,
    name = "text-size",
    target,
    sizeLabels = {},
    children,
    onChange,
    className = "",
    ...restProps
}: Props): React.ReactElement {
    const isControlled = value !== undefined;

    const [internalValue, setInternalValue] = React.useState<string>(
        isControlled ? value : "",
    );

    const currentValue = isControlled ? value : internalValue;

    function labelFor(size: string): string {
        if (size in sizeLabels) return sizeLabels[size];
        return titleCaseSize(size);
    }

    function applySize(slug: string): void {
        if (typeof document === "undefined" || !slug) return;
        (target ?? document.documentElement).setAttribute(
            "data-text-size",
            slug,
        );
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
        if (!isControlled) setInternalValue(slug);
        applySize(slug);
    }

    // Resolve initial value on mount.
    const initialisedRef = React.useRef(false);
    React.useEffect(() => {
        if (initialisedRef.current) return;
        initialisedRef.current = true;

        const initial = resolveInitialSize(
            currentValue || undefined,
            storageKey,
            defaultValue,
            sizes,
        );
        if (!initial) return;

        if (isControlled) {
            applySize(initial);
        } else {
            if (initial !== internalValue) {
                setInternalValue(initial);
            } else {
                applySize(initial);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Re-apply whenever the resolved value changes (controlled prop
    // changes from outside, or internal state changes after mount).
    React.useEffect(() => {
        if (!initialisedRef.current) return;
        if (!currentValue) return;
        applySize(currentValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentValue]);

    function onSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setSize(e.target.value);
    }

    return (
        <select
            className={`text-size-select ${className}`.trim()}
            aria-label={label}
            name={name}
            value={currentValue ?? ""}
            onChange={onSelectChange}
            {...restProps}
        >
            {children
                ? children({
                      sizes,
                      value: currentValue ?? "",
                      setSize,
                      name,
                      labelFor,
                  })
                : sizes.map((size) => (
                      <option
                          key={size}
                          className="text-size-select-option"
                          value={size}
                      >
                          {labelFor(size)}
                      </option>
                  ))}
        </select>
    );
}

export default TextSizeSelect;
