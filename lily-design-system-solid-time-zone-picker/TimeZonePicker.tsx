import { IconButton, Listbox } from "@lilydesignsystem/solid-headless";
import type { JSX } from "@solidjs/web";
import {
    createEffect,
    createMemo,
    createSignal,
    createUniqueId,
    For,
    omit,
    onSettled,
    untrack,
} from "solid-js";
import {
    DEFAULT_ZONES,
    matchZone,
    orderedZones,
    systemZone,
    zoneInfo,
    type ZoneInfo,
    type ZoneNames,
} from "./zones.js";

export { DEFAULT_ZONES };
export type { ZoneInfo, ZoneNames };

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
    JSX.HTMLAttributes<HTMLDivElement>,
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
    /** Zone names by IANA id (one name, or `[standard, daylight]`), which win over `Intl`: from the locale-translations zone-name packs (CLDR) via `zoneNamesFrom()`. */
    names?: ZoneNames;
    /** Replaces the default clock icon inside the button. */
    children?: (args: ChildArgs) => JSX.Element;
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
    class?: string;
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
export function createPickerTooltip(
    button: () => HTMLButtonElement | undefined,
    open: () => boolean,
) {
    const [hoverButton, setHoverButton] = createSignal(false);
    const [hoverTooltip, setHoverTooltip] = createSignal(false);
    const [focusButton, setFocusButton] = createSignal(false);
    const [dismissed, setDismissed] = createSignal(false);
    const visible = () =>
        !open() && !dismissed() && (hoverButton() || hoverTooltip() || focusButton());
    // WCAG 1.4.13 "dismissable": Escape must work wherever focus is while
    // the tooltip is visible (pointer hover alone leaves focus elsewhere).
    // The document listener exists only while visible; never prevents
    // default, stops propagation, or moves focus.
    createEffect(visible, (isVisible) => {
        if (!isVisible) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setDismissed(true);
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    });
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
                    setFocusButton(button()?.matches(":focus-visible") ?? false);
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
        onButtonKeyDown: (event: KeyboardEvent) => {
            if (event.key === "Escape" && untrack(visible)) setDismissed(true);
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
    names?: ZoneNames,
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
    return (
        matchZone(systemZone(), infos, locale, date, names) ??
        (ids.includes("UTC") ? "UTC" : ids[0]) ??
        ""
    );
}

export function TimeZonePicker(props: Props): JSX.Element {
    const rest = omit(
        props,
        "label",
        "locale",
        "zones",
        "date",
        "value",
        "defaultValue",
        "storageKey",
        "name",
        "target",
        "labelFor",
        "names",
        "children",
        "onChange",
        "class",
        "open",
        "defaultOpen",
        "onOpenChange",
        "disabled",
    );
    const isControlled = () => props.value !== undefined;
    const [internalValue, setInternalValue] = createSignal("");
    const currentValue = () => (isControlled() ? (props.value as string) : internalValue());

    // `createUniqueId` is stable across server and client render, so the option ids survive hydration.
    const baseId = `time-zone-picker-${createUniqueId()}`;
    const listId = `${baseId}-list`;
    const tooltipId = `${baseId}-tooltip`;
    const optionId = (i: number) => `${baseId}-option-${i}`;

    // `open` is controlled when the prop is given. `onOpenChange` is called once for each change the
    // component makes (the user's, or `disabled` closing it); mounting open is not a change.
    const [openInner, setOpenInner] = createSignal(untrack(() => props.defaultOpen ?? false));
    const openRaw = () => props.open ?? openInner();
    const open = () => openRaw() && !props.disabled;
    function setOpen(next: boolean): void {
        if (next === untrack(open)) return;
        if (props.open === undefined) setOpenInner(next);
        props.onOpenChange?.(next);
    }
    createEffect(
        () => [props.disabled, openRaw()] as const,
        ([disabled, raw]) => {
            if (disabled && raw) {
                if (props.open === undefined) setOpenInner(false);
                props.onOpenChange?.(false);
            }
        },
    );
    const [activeIndex, setActiveIndex] = createSignal(-1);

    let root: HTMLDivElement | undefined;
    let button: HTMLButtonElement | undefined;
    let list: HTMLElement | undefined;

    // Set when a close should hand focus back to the button.
    let refocus = false;

    // The zones as the listbox shows them, ordered by offset. The date is read once when none is given: a picker
    // that re-sorted itself while open would move the option under the pointer.
    const firstDate = new Date();
    const when = () => props.date ?? firstDate;
    const infos = createMemo(() =>
        orderedZones(
            props.zones ?? DEFAULT_ZONES,
            props.locale,
            when(),
            props.labelFor,
            props.names,
        ),
    );
    const ids = () => infos().map((z) => z.id);
    const infoFor = (zone: string) =>
        zoneInfo(zone, props.locale, when(), props.labelFor, props.names);

    // The zone the DOM currently carries. Applying is idempotent: a controlled consumer's `onChange` writes the value
    // back, which re-runs the apply effect; without this guard every selection would fire `onChange` twice.
    let applied = "";

    function applyZone(slug: string): void {
        if (typeof document === "undefined" || !slug) return;
        if (slug === applied) return;
        applied = slug;
        (props.target ?? document.documentElement).setAttribute("data-time-zone", slug);
        if (props.storageKey) {
            try {
                localStorage.setItem(props.storageKey, slug);
            } catch {
                // ignore quota / privacy errors
            }
        }
        props.onChange?.(slug);
    }

    function setZone(slug: string): void {
        if (untrack(isControlled)) {
            // The consumer owns `value`; apply straight away so the DOM stays in step even if they never write it back.
            applyZone(slug);
        } else {
            // The value effect below applies it, exactly once per change.
            setInternalValue(slug);
        }
    }

    // ---------------------------------------------------------------
    // Open / close
    // ---------------------------------------------------------------

    function openList(startIndex?: number): void {
        const zoneIds = ids();
        const selected = zoneIds.indexOf(untrack(currentValue) ?? "");
        // An empty list has no option to activate; -1 keeps aria-activedescendant off rather than pointing at an id
        // that does not exist.
        setActiveIndex(zoneIds.length === 0 ? -1 : (startIndex ?? (selected >= 0 ? selected : 0)));
        setOpen(true);
    }

    function closeList(refocusButton = true): void {
        if (!untrack(open)) return;
        setActiveIndex(-1);
        // Focus moves in the effect below, once the list is hidden.
        if (refocusButton) refocus = true;
        setOpen(false);
    }

    function choose(index: number): void {
        const slug = ids()[index];
        if (slug) setZone(slug);
        closeList();
    }

    function scrollActiveIntoView(index: number): void {
        if (index < 0) return;
        const el = list?.children[index] as HTMLElement | undefined;
        // jsdom does not implement scrollIntoView.
        el?.scrollIntoView?.({ block: "nearest" });
    }

    function handleTabOut(): void {
        // Tab moves on, but focus goes to the button FIRST, without cancelling the key (Listbox's onTabOut never
        // prevents Tab): hiding the focused list drops focus to <body>, and the default Tab move would then start
        // from the top of the document. From the button, the default Tab lands where leaving the picker should.
        button?.focus?.({ preventScroll: true });
        closeList(false);
    }

    function onButtonKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case "ArrowDown":
            case "Enter":
            case " ":
                event.preventDefault();
                openList();
                break;
            case "ArrowUp":
                event.preventDefault();
                openList(ids().length - 1);
                break;
        }
    }

    /** focusout bubbles, so the root hears focus leaving any descendant. */
    function onRootFocusOut(event: FocusEvent): void {
        const next = event.relatedTarget as Node | null;
        if (next && root?.contains(next)) return;
        closeList(false);
    }

    // Move focus to the listbox on open, back to the button on close. preventScroll stops the browser scrolling the
    // page when a list positioned partly off-screen takes focus.
    createEffect(open, (isOpen) => {
        if (isOpen) {
            list?.focus({ preventScroll: true });
        } else if (refocus) {
            refocus = false;
            button?.focus({ preventScroll: true });
        }
    });

    // Keep the active option in view as it moves.
    createEffect(
        () => [open(), activeIndex()] as const,
        ([isOpen, index]) => {
            if (isOpen) scrollActiveIntoView(index);
        },
    );

    // Clicking outside the root closes the listbox.
    createEffect(open, (isOpen) => {
        if (!isOpen) return;
        function onDocumentClick(event: MouseEvent) {
            const t = event.target as Node | null;
            if (t && root && !root.contains(t)) closeList(false);
        }
        document.addEventListener("click", onDocumentClick);
        return () => document.removeEventListener("click", onDocumentClick);
    });

    // ---------------------------------------------------------------
    // Initial value resolution, after mount, then apply on every change
    // ---------------------------------------------------------------

    let initialised = false;
    onSettled(() => {
        untrack(() => {
            const initial = resolveInitialZone(
                currentValue() || undefined,
                props.storageKey,
                props.defaultValue,
                infos(),
                props.locale,
                when(),
                props.names,
            );
            initialised = true;
            if (!initial) return;
            if (isControlled() || initial === internalValue()) applyZone(initial);
            else setInternalValue(initial);
        });
    });

    // Re-apply whenever the value changes (a controlled prop from outside, or internal state after mount).
    createEffect(currentValue, (slug) => {
        if (!initialised || !slug) return;
        applyZone(slug);
    });

    const tip = createPickerTooltip(() => button, open);

    return (
        <div
            ref={(el) => (root = el)}
            class={`time-zone-picker ${props.class ?? ""}`.trim()}
            onFocusOut={onRootFocusOut}
            {...rest}
        >
            <input
                type="hidden"
                name={props.name ?? "time-zone"}
                value={currentValue() ?? ""}
            />

            <IconButton
                disabled={props.disabled ?? false}
                ref={(el: HTMLButtonElement) => (button = el)}
                {...tip.buttonProps}
                baseClass="time-zone-picker-button"
                label={props.label}
                aria-haspopup="listbox"
                aria-expanded={open() ? "true" : "false"}
                aria-controls={listId}
                onClick={() => {
                    tip.onButtonClick();
                    if (untrack(open)) closeList();
                    else openList();
                }}
                onKeyDown={(event: KeyboardEvent) => {
                    tip.onButtonKeyDown(event);
                    onButtonKeyDown(event);
                }}
            >
                {props.children ? (
                    props.children({
                        get value() {
                            return currentValue() ?? "";
                        },
                        get open() {
                            return open();
                        },
                        infoFor,
                    })
                ) : (
                    <svg
                        class="time-zone-picker-icon"
                        viewBox="0 0 16 16"
                        width="1.05rem"
                        height="1.05rem"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.6"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M8 2.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM8 5v3l2 1.5" />
                    </svg>
                )}
            </IconButton>
            {/* Purely visual: the same text is already the button's aria-label,
                so it is not wired with aria-describedby. */}
            <div
                class="time-zone-picker-tooltip"
                role="tooltip"
                id={tooltipId}
                hidden={!tip.visible()}
                {...tip.tooltipProps}
            >
                {props.label}
            </div>

            <Listbox
                ref={(el: HTMLElement) => (list = el)}
                as="ul"
                baseClass="time-zone-picker-list"
                id={listId}
                label={props.label}
                navigation="active-descendant"
                clamp
                typeahead
                pageSize={10}
                activeIndex={activeIndex()}
                onActiveIndexChange={setActiveIndex}
                hidden={!open()}
                onActivate={choose}
                onEscape={() => closeList()}
                onTabOut={handleTabOut}
            >
                <For
                    each={infos()}
                    keyed={(zone) => zone.id}
                >
                    {(zone, i) => (
                        <li
                            class="time-zone-picker-option"
                            id={optionId(i())}
                            role="option"
                            aria-selected={zone().id === currentValue() ? "true" : "false"}
                            data-active={i() === activeIndex() ? "" : undefined}
                            data-offset={zone().offset}
                            onClick={() => choose(i())}
                        >
                            {zone().label}
                        </li>
                    )}
                </For>
            </Listbox>
        </div>
    );
}

export default TimeZonePicker;
