import * as React from "react";
import { IconButton, Listbox } from "@lilydesignsystem/react-headless";
import { DEFAULT_ZONES, matchZone, orderedZones, systemZone, zoneInfo, type ZoneInfo } from "./zones.js";

export { DEFAULT_ZONES };
export type { ZoneInfo };

/** Default button icon: a bundled clock SVG, replaceable via `children`. */

/** Arguments passed to a custom `children` render prop (the button glyph). */
export type ChildArgs = {
    /** Currently selected zone, an IANA id. */
    value: string;
    /** Is the listbox open? */
    open: boolean;
    /** Offset, name and label of any zone. */
    infoFor: (zone: string) => ZoneInfo | undefined;
};

/** Public props for TimeZonePicker. See `spec/index.md` §4 for the contract. */
export type Props = Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "children" | "defaultValue"
> & {
    /** Accessible name for the button and the listbox. */
    label: string;
    /**
     * BCP 47 tag the zone names are written in (`en`, `fr-FR`). Required: the picker never picks a language for you.
     */
    locale: string;
    /** IANA zone ids to offer. Default: DEFAULT_ZONES. Shown ordered by offset, not in this order. */
    zones?: readonly string[];
    /** The moment offsets and names are worked out for. Default: now, read once. */
    date?: Date;
    /** Currently selected zone, an IANA id. When supplied, the component is controlled. */
    value?: string;
    /** Initial zone when nothing else is supplied. */
    defaultValue?: string;
    /** If set, persist the selection to localStorage under this key. */
    storageKey?: string;
    /** `name` of the hidden input that carries the value in a form. */
    name?: string;
    /** Element that receives `data-time-zone`. Defaults to document.documentElement. */
    target?: HTMLElement | null;
    /** Builds an option's text from its info. Default: `UTC+01:00 – Central European Standard Time`. */
    labelFor?: (zone: ZoneInfo) => string;
    /** Replaces the default clock icon inside the button. */
    children?: (args: ChildArgs) => React.ReactNode;
    /** Called after the control applies a new zone. */
    onChange?: (zone: string) => void;
    /** Is the popup open? Controlled when given; the popup starts as `defaultOpen` otherwise. */
    open?: boolean;
    /** Initial open state of an uncontrolled picker. */
    defaultOpen?: boolean;
    /** Called with the new open state whenever the user (or `disabled`) changes it. In controlled mode the parent applies it. */
    onOpenChange?: (open: boolean) => void;
    /** Disables the button; an open popup closes. */
    disabled?: boolean;
    /** Extra CSS class on the root. */
    className?: string;
};

// ------------------------------------------------------------------
// Pure helpers (exported so consumers can reuse them)
// ------------------------------------------------------------------

/**
 * Tooltip state for the icon button. Shown while the pointer is over the
 * button or over the tooltip itself (hoverable, WCAG 1.4.13) or while the
 * button has keyboard focus; Escape dismisses it without moving focus;
 * never shown while the popup is open, since the popup then explains the
 * control. Purely visual: the text is the button's own aria-label, so it
 * is deliberately not linked with aria-describedby.
 */
function usePickerTooltip(
    buttonRef: React.RefObject<HTMLButtonElement | null>,
    open: boolean,
) {
    const [hoverButton, setHoverButton] = React.useState(false);
    const [hoverTooltip, setHoverTooltip] = React.useState(false);
    const [focusButton, setFocusButton] = React.useState(false);
    const [dismissed, setDismissed] = React.useState(false);
    const visible = !open && !dismissed && (hoverButton || hoverTooltip || focusButton);
    // WCAG 1.4.13 "dismissable": Escape must work wherever focus is while
    // the tooltip is visible (pointer hover alone leaves focus elsewhere).
    // The document listener exists only while visible; never prevents
    // default, stops propagation, or moves focus.
    React.useEffect(() => {
        if (!visible) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setDismissed(true);
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [visible]);
    return {
        visible,
        buttonProps: {
            onMouseEnter: () => {
                setHoverButton(true);
                setDismissed(false);
            },
            onMouseLeave: () => setHoverButton(false),
            onFocus: () => {
                // Keyboard focus only: a mouse click also focuses the
                // button in Chromium, and the tooltip should not stick.
                try {
                    setFocusButton(buttonRef.current?.matches(":focus-visible") ?? false);
                } catch {
                    setFocusButton(true); // no :focus-visible — err towards showing
                }
            },
            onBlur: () => {
                setFocusButton(false);
                setDismissed(false);
            },
        },
        /** Call from the button's click handler. */
        onButtonClick: () => setHoverButton(false),
        /** Call first in the button's keydown handler; never prevents default. */
        onButtonKeyDown: (event: React.KeyboardEvent) => {
            if (event.key === "Escape" && visible) setDismissed(true);
        },
        tooltipProps: {
            onMouseEnter: () => setHoverTooltip(true),
            onMouseLeave: () => setHoverTooltip(false),
        },
    };
}

function resolveInitialZone(
    value: string | undefined,
    storageKey: string | undefined,
    defaultValue: string | undefined,
    infos: ZoneInfo[],
    locale: string,
    date: Date,
): string {
    if (value) return value;
    const ids = infos.map((z) => z.id);
    // A stored zone that is no longer offered is not restored.
    if (storageKey) {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored && ids.includes(stored)) return stored;
        } catch {
            // ignore privacy errors
        }
    }
    if (defaultValue) return defaultValue;
    // The reader's own zone when it is listed (or has a listed twin), else UTC, else the first.
    return matchZone(systemZone(), infos, locale, date) ?? (ids.includes("UTC") ? "UTC" : ids[0]) ?? "";
}

export function TimeZonePicker({
    label,
    locale,
    zones = DEFAULT_ZONES,
    date,
    value,
    defaultValue,
    storageKey,
    name = "time-zone",
    target,
    labelFor,
    children,
    onChange,
    className = "",
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    disabled = false,
    ...restProps
}: Props): React.ReactElement {
    const isControlled = value !== undefined;

    // Internal state for uncontrolled mode. Starts empty; resolved
    // in the first effect after mount (SSR-safe).
    const [internalValue, setInternalValue] = React.useState<string>(
        isControlled ? value : "",
    );

    // Mirror the controlled prop into a single read path so the render
    // branch is uniform.
    const currentValue = isControlled ? value : internalValue;

    // `useId` is stable across server and client render, so the option
    // ids survive hydration. No Math.random / Date.now.
    const baseId = `time-zone-picker-${React.useId()}`;
    const listId = `${baseId}-list`;
    const tooltipId = `${baseId}-tooltip`;
    const optionId = (i: number) => `${baseId}-option-${i}`;

    // `open` is controlled when the prop is given. `onOpenChange` is called once for each change the
    // component makes (the user's, or `disabled` closing it); mounting open is not a change.
    const [openInner, setOpenInner] = React.useState(defaultOpen);
    const openRaw = openProp ?? openInner;
    const open = openRaw && !disabled;
    const openRef = React.useRef(open);
    openRef.current = open;
    const onOpenChangeRef = React.useRef(onOpenChange);
    onOpenChangeRef.current = onOpenChange;
    const setOpen = React.useCallback(
      (next: boolean): void => {
        if (next === openRef.current) return;
        openRef.current = next;
        if (openProp === undefined) setOpenInner(next);
        onOpenChangeRef.current?.(next);
      },
      [openProp],
    );
    React.useEffect(() => {
      if (disabled && openRaw) setOpen(false);
    }, [disabled, openRaw, setOpen]);
    const [activeIndex, setActiveIndex] = React.useState(-1);

    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);
    const listRef = React.useRef<HTMLElement | null>(null);

    // Set when a close should hand focus back to the button.
    const refocusRef = React.useRef(false);

    // The zones as the listbox shows them, ordered by offset. The date is read once when none is given: a picker
    // that re-sorted itself while open would move the option under the pointer.
    const whenRef = React.useRef<Date | null>(null);
    if (whenRef.current === null) whenRef.current = new Date();
    const when = date ?? whenRef.current;
    const infos = React.useMemo(() => orderedZones(zones, locale, when, labelFor), [zones, locale, when, labelFor]);
    const sizes = React.useMemo(() => infos.map((z) => z.id), [infos]);
    const infoFor = (zone: string) => zoneInfo(zone, locale, when, labelFor);

    // The zone the DOM currently carries. Applying is idempotent: in
    // controlled mode `setZone` applies straight away and the consumer's
    // `onChange` writes the value back, which re-runs the apply effect —
    // without this, every selection fired `onChange` (and rewrote storage)
    // twice.
    const appliedRef = React.useRef("");

    function applyZone(slug: string): void {
        if (typeof document === "undefined" || !slug) return;
        if (slug === appliedRef.current) return;
        appliedRef.current = slug;
        (target ?? document.documentElement).setAttribute(
            "data-time-zone",
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

    function setZone(slug: string): void {
        if (isControlled) {
            // The consumer owns `value`; apply straight away so the DOM
            // stays in step even if they never write the value back.
            applyZone(slug);
        } else {
            // The value-change effect below runs applyZone, so the size
            // is applied exactly once per change.
            setInternalValue(slug);
        }
    }

    // ---------------------------------------------------------------
    // Open / close
    // ---------------------------------------------------------------

    function openList(startIndex?: number): void {
        const selected = sizes.indexOf(currentValue ?? "");
        // An empty list has no option to activate; -1 keeps
        // aria-activedescendant off rather than pointing at an id that
        // does not exist.
        setActiveIndex(
            sizes.length === 0
                ? -1
                : (startIndex ?? (selected >= 0 ? selected : 0)),
        );
        setOpen(true);
    }

    function closeList(refocus = true): void {
        if (!open) return;
        setOpen(false);
        setActiveIndex(-1);
        // Focus moves in the effect below, after the commit.
        if (refocus) refocusRef.current = true;
    }

    function choose(index: number): void {
        const slug = sizes[index];
        if (slug) setZone(slug);
        closeList();
    }

    function scrollActiveIntoView(index: number): void {
        if (index < 0) return;
        const el = listRef.current?.children[index] as HTMLElement | undefined;
        // jsdom does not implement scrollIntoView.
        el?.scrollIntoView?.({ block: "nearest" });
    }

    function handleTabOut(): void {
        // Tab moves on — but focus goes to the button FIRST, without
        // cancelling the key (Listbox's onTabOut never preventDefaults
        // Tab). Hiding the focused list drops focus to <body>, and the
        // browser then computes the default Tab move from the top of the
        // document, so tabbing out of an open picker teleported the user to
        // the page's first tab stop. From the button, the default Tab
        // lands exactly where leaving the picker should.
        buttonRef.current?.focus?.({ preventScroll: true });
        closeList(false);
    }

    function onButtonKeyDown(
        event: React.KeyboardEvent<HTMLButtonElement>,
    ): void {
        switch (event.key) {
            case "ArrowDown":
            case "Enter":
            case " ":
                event.preventDefault();
                openList();
                break;
            case "ArrowUp":
                event.preventDefault();
                openList(sizes.length - 1);
                break;
        }
    }

    /**
     * React's `onBlur` is the delegated equivalent of the native
     * `focusout` event: unlike the DOM's own `blur`, it bubbles, so the
     * root sees focus leaving any descendant.
     */
    function onRootBlur(event: React.FocusEvent<HTMLDivElement>): void {
        const next = event.relatedTarget as Node | null;
        if (next && rootRef.current?.contains(next)) return;
        closeList(false);
    }

    // Move focus to the listbox on open, back to the button on close.
    React.useEffect(() => {
        if (open) {
            listRef.current?.focus({ preventScroll: true });
        } else if (refocusRef.current) {
            refocusRef.current = false;
            buttonRef.current?.focus({ preventScroll: true });
        }
    }, [open]);

    // Keep the active option in view as it moves.
    React.useEffect(() => {
        if (open) scrollActiveIntoView(activeIndex);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, activeIndex]);

    // Clicking outside the root closes the listbox.
    React.useEffect(() => {
        if (!open) return;
        function onDocumentClick(event: MouseEvent) {
            const t = event.target as Node | null;
            if (t && rootRef.current && !rootRef.current.contains(t)) {
                closeList(false);
            }
        }
        document.addEventListener("click", onDocumentClick);
        return () => document.removeEventListener("click", onDocumentClick);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // ---------------------------------------------------------------
    // Initial value resolution + apply (unchanged from the select era)
    // ---------------------------------------------------------------

    const initialisedRef = React.useRef(false);
    React.useEffect(() => {
        if (initialisedRef.current) return;
        initialisedRef.current = true;

        const initial = resolveInitialZone(
            currentValue || undefined,
            storageKey,
            defaultValue,
            infos,
            locale,
            when,
        );
        if (!initial) return;

        if (isControlled) {
            applyZone(initial);
        } else {
            // setInternalValue triggers another render; the value-change
            // effect below will run applyZone.
            if (initial !== internalValue) {
                setInternalValue(initial);
            } else {
                applyZone(initial);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Re-apply whenever the resolved value changes.
    React.useEffect(() => {
        if (!initialisedRef.current) return;
        if (!currentValue) return;
        applyZone(currentValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentValue]);

    const tip = usePickerTooltip(buttonRef, open);

    return (
        <div
            ref={rootRef}
            className={`time-zone-picker ${className}`.trim()}
            onBlur={onRootBlur}
            {...restProps}
        >
            <input type="hidden" name={name} value={currentValue ?? ""} />

            <IconButton
                disabled={disabled}
                ref={buttonRef}
                {...tip.buttonProps}
                baseClass="time-zone-picker-button"
                label={label}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listId}
                onClick={() => {
                    tip.onButtonClick();
                    if (open) closeList();
                    else openList();
                }}
                onKeyDown={(event) => {
                    tip.onButtonKeyDown(event);
                    onButtonKeyDown(event);
                }}
            >
                {children ? (
                    children({ value: currentValue ?? "", open, infoFor })
                ) : (
                    <svg
                        className="time-zone-picker-icon"
                        viewBox="0 0 16 16"
                        width="1.05rem"
                        height="1.05rem"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M8 2.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM8 5v3l2 1.5" />
                    </svg>
                )}
            </IconButton>
            {/* Purely visual: the same text is already the button's aria-label,
                so it is not wired with aria-describedby. */}
            <div
                className="time-zone-picker-tooltip"
                role="tooltip"
                id={tooltipId}
                hidden={!tip.visible}
                {...tip.tooltipProps}
            >
                {label}
            </div>

            <Listbox
                ref={listRef}
                as="ul"
                baseClass="time-zone-picker-list"
                id={listId}
                label={label}
                navigation="active-descendant"
                clamp
                typeahead
                pageSize={10}
                activeIndex={activeIndex}
                onActiveIndexChange={setActiveIndex}
                hidden={!open}
                onActivate={choose}
                onEscape={() => closeList()}
                onTabOut={handleTabOut}
            >
                {infos.map((zone, i) => (
                    <li
                        key={zone.id}
                        className="time-zone-picker-option"
                        id={optionId(i)}
                        role="option"
                        aria-selected={zone.id === currentValue}
                        data-active={i === activeIndex ? "" : undefined}
                        data-offset={zone.offset}
                        onClick={() => choose(i)}
                    >
                        {zone.label}
                    </li>
                ))}
            </Listbox>
        </div>
    );
}

export default TimeZonePicker;
