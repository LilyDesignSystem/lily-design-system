import { IconButton, Listbox } from "@lilydesignsystem/solid-headless";
import type { JSX } from "@solidjs/web";
import {
    createEffect,
    createSignal,
    createUniqueId,
    For,
    omit,
    onSettled,
    untrack,
} from "solid-js";
import { defaultLocaleLabels, RTL_LANGUAGE_TAGS, RTL_SCRIPT_SUBTAGS } from "./locales.js";

/**
 * Default button icon: a bundled SVG (globe outline), not a Unicode
 * character. Reversed 2026-09-16 from the font-dependent-glyph
 * convention (was U+1F310 GLOBE WITH MERIDIANS + U+FE0E, exported as
 * `GLOBE_WITH_MERIDIANS` — removed, not renamed). The old glyph needed
 * VS15 to force text presentation and still risked the colour-emoji
 * font on stacks that ignore the selector; a bundled outline SVG has
 * no such risk and renders identically everywhere, matching the other
 * four picker icons as one monochrome family. Override via `children`,
 * same as before.
 */

/** Arguments passed to a custom `children` render prop (the button glyph). */
export type ChildArgs = {
    /** Currently selected locale code (consumer form, not BCP 47-normalised). */
    value: string;
    /** Is the listbox open? */
    open: boolean;
    /** Resolve a locale code to its display label. */
    labelFor: (locale: string) => string;
};

/** Public props for LocalePicker. See `spec/index.md` §4 for the contract. */
export type Props = Omit<
    JSX.HTMLAttributes<HTMLDivElement>,
    "onChange" | "children" | "defaultValue"
> & {
    /** Accessible name for the button and the listbox. */
    label: string;
    /** Available locale codes. */
    locales: string[];
    /** Currently selected locale code. When supplied, the component is controlled. */
    value?: string;
    /** Initial locale when nothing else is supplied. */
    defaultValue?: string;
    /** If set, persist the selection to localStorage under this key. */
    storageKey?: string;
    /** Resolve `navigator.languages` to a supported locale on first visit. */
    detectFromNavigator?: boolean;
    /** `name` of the hidden input that carries the value in a form. */
    name?: string;
    /** Element that receives `lang` and `dir`. Defaults to document.documentElement. */
    target?: HTMLElement | null;
    /** If false, the control only writes `lang` and never touches `dir`. */
    applyDir?: boolean;
    /** Optional pretty labels per locale code. */
    localeLabels?: Record<string, string>;
    /** Replaces the default globe icon inside the button. */
    children?: (args: ChildArgs) => JSX.Element;
    /** Called after the control applies a new locale. */
    onChange?: (locale: string) => void;
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

/** Convert a locale code to its BCP 47 hyphen form. */
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

export function bcp47LocaleTag(locale: string): string {
    return locale.replace(/_/g, "-");
}

/** Detect whether a locale is right-to-left. See spec/index.md §5.6. */
export function isRtlLocale(locale: string): boolean {
    if (!locale) return false;
    const parts = locale.split(/[-_]/);
    for (const part of parts) {
        if (RTL_SCRIPT_SUBTAGS.has(part.toLowerCase())) return true;
    }
    const base = parts[0]?.toLowerCase() ?? "";
    return RTL_LANGUAGE_TAGS.has(base);
}

/** Resolve a locale code to its English name via the built-in table. */
export function localeName(locale: string): string {
    return defaultLocaleLabels[locale] ?? locale;
}

/**
 * Self-names the runtime's `Intl.DisplayNames` data gets wrong: for these it answers
 * with a fallback-language name ("Wu Chinese", "Naijíriá Píjin") rather than the one speakers use.
 */
const ENDONYM_OVERRIDES: Record<string, string> = { wuu: "吴语", pcm: "Naijá" };

/**
 * The language's own name for itself — "de" → "Deutsch", "cy" →
 * "Cymraeg" — from `Intl.DisplayNames` asked *in that language*.
 *
 * Endonyms are the right default for a language menu: the user who
 * needs it most is the one lost in a UI that is not in their
 * language, and they recognise "Cymraeg" where "Welsh" means
 * nothing to them. Deterministic (no `navigator` dependency), so
 * the server and the client render the same label. Returns "" when
 * the runtime has no data — some runtimes echo the tag back instead
 * of failing, and an echo is not a name.
 */
export function localeEndonym(locale: string): string {
    try {
        const tag = bcp47LocaleTag(locale);
        const override = ENDONYM_OVERRIDES[tag.split("-")[0].toLowerCase()];
        if (override) return override;
        const dn = new Intl.DisplayNames([tag], { type: "language" });
        const found = dn.of(tag) ?? "";
        return found && found.toLowerCase() !== tag.toLowerCase() ? found : "";
    } catch {
        return "";
    }
}

/** Re-export the built-in label table and RTL sets for convenience. */
export { defaultLocaleLabels, RTL_LANGUAGE_TAGS, RTL_SCRIPT_SUBTAGS };

/** Opportunistic Intl.DisplayNames lookup; never throws. */
function intlDisplayName(locale: string): string {
    try {
        // Where there is no navigator (server rendering), name the language in itself (its endonym), not in English
        // (tasks.md P17-T12: no single-region default).
        const env =
            typeof navigator !== "undefined" && navigator.language
                ? navigator.language
                : bcp47LocaleTag(locale);
        const dn = new Intl.DisplayNames([env], { type: "language" });
        return dn.of(bcp47LocaleTag(locale)) ?? "";
    } catch {
        return "";
    }
}

/** Match a navigator preference against a supported-locales list. */
export function matchNavigatorLanguage(
    navLangs: readonly string[],
    locales: readonly string[],
): string | "" {
    const lc = (s: string) => s.toLowerCase().replace(/_/g, "-");
    const localesLc = locales.map(lc);
    for (const raw of navLangs) {
        const nav = lc(raw);

        // 1. Exact match (treating - and _ as equivalent).
        const exactIndex = localesLc.indexOf(nav);
        if (exactIndex !== -1) return locales[exactIndex];

        // 2. Language-only match: pick the first locale whose
        //    base language matches the navigator's base language.
        const navBase = nav.split("-")[0];
        for (let i = 0; i < locales.length; i++) {
            const base = localesLc[i].split("-")[0];
            if (base === navBase) return locales[i];
        }
    }
    return "";
}

function resolveInitialLocale(
    value: string | undefined,
    storageKey: string | undefined,
    detectFromNavigator: boolean,
    defaultValue: string | undefined,
    locales: string[],
): string {
    if (value) return value;
    if (storageKey) {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored && locales.includes(stored)) return stored;
        } catch {
            // ignore privacy errors
        }
    }
    if (detectFromNavigator && typeof navigator !== "undefined") {
        const navLangs =
            navigator.languages && navigator.languages.length > 0
                ? Array.from(navigator.languages)
                : navigator.language
                  ? [navigator.language]
                  : [];
        const match = matchNavigatorLanguage(navLangs, locales);
        if (match) return match;
    }
    if (defaultValue) return defaultValue;
    if (locales.includes("en")) return "en";
    return locales[0] ?? "";
}

export function LocalePicker(props: Props): JSX.Element {
    const rest = omit(
        props,
        "label",
        "locales",
        "value",
        "defaultValue",
        "storageKey",
        "detectFromNavigator",
        "name",
        "target",
        "applyDir",
        "localeLabels",
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
    const baseId = `locale-picker-${createUniqueId()}`;
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

    function labelFor(locale: string): string {
        const labels = props.localeLabels ?? {};
        if (locale in labels) return labels[locale];
        // Endonym first: a language menu names each language in itself, because the user who needs the menu is the
        // one who cannot read the page's language. The English table and the environment lookup are fallbacks for
        // runtimes without DisplayNames data.
        const endonym = localeEndonym(locale);
        if (endonym) return endonym;
        if (locale in defaultLocaleLabels) return defaultLocaleLabels[locale];
        const intl = intlDisplayName(locale);
        if (intl) return intl;
        return locale;
    }

    /**
     * The `lang` attribute for one option: a claim about the language of the option's TEXT, made only when the text
     * is the endonym we derived ourselves. A consumer label or the English fallback is in the consumer's UI language,
     * and claiming otherwise sends a screen reader's speech engine to the wrong voice.
     */
    function optionLang(locale: string): string | undefined {
        if (locale in (props.localeLabels ?? {})) return undefined;
        return localeEndonym(locale) ? bcp47LocaleTag(locale) : undefined;
    }

    // The locale the DOM currently carries. Applying is idempotent: a controlled consumer's `onChange` writes the
    // value back, which re-runs the apply effect; without this guard every selection would fire `onChange` (and
    // rewrite storage) twice.
    let applied = "";

    function applyLocale(code: string): void {
        if (typeof document === "undefined" || !code) return;
        if (code === applied) return;
        applied = code;
        const target = props.target ?? document.documentElement;
        target.setAttribute("lang", bcp47LocaleTag(code));
        if (props.applyDir ?? true) {
            target.setAttribute("dir", isRtlLocale(code) ? "rtl" : "ltr");
        }
        if (props.storageKey) {
            try {
                localStorage.setItem(props.storageKey, code);
            } catch {
                // ignore quota / privacy errors
            }
        }
        props.onChange?.(code);
    }

    function setLocale(code: string): void {
        if (untrack(isControlled)) {
            // The consumer owns `value`; apply straight away so the DOM stays in step even if they never write it back.
            applyLocale(code);
        } else {
            // The value effect below applies it, exactly once per change.
            setInternalValue(code);
        }
    }

    // ---------------------------------------------------------------
    // Open / close
    // ---------------------------------------------------------------

    function openList(startIndex?: number): void {
        const locales = props.locales;
        const selected = locales.indexOf(untrack(currentValue) ?? "");
        // An empty list has no option to activate; -1 keeps aria-activedescendant off rather than pointing at an id
        // that does not exist.
        setActiveIndex(locales.length === 0 ? -1 : (startIndex ?? (selected >= 0 ? selected : 0)));
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
        const code = props.locales[index];
        if (code) setLocale(code);
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
                openList(props.locales.length - 1);
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
            const initial = resolveInitialLocale(
                currentValue() || undefined,
                props.storageKey,
                props.detectFromNavigator ?? false,
                props.defaultValue,
                props.locales,
            );
            initialised = true;
            if (!initial) return;
            if (isControlled() || initial === internalValue()) applyLocale(initial);
            else setInternalValue(initial);
        });
    });

    // Re-apply whenever the value changes (a controlled prop from outside, or internal state after mount).
    createEffect(currentValue, (code) => {
        if (!initialised || !code) return;
        applyLocale(code);
    });

    const tip = createPickerTooltip(() => button, open);

    return (
        <div
            ref={(el) => (root = el)}
            class={`locale-picker ${props.class ?? ""}`.trim()}
            onFocusOut={onRootFocusOut}
            {...rest}
        >
            <input
                type="hidden"
                name={props.name ?? "locale"}
                value={currentValue() ?? ""}
            />

            <IconButton
                disabled={props.disabled ?? false}
                ref={(el: HTMLButtonElement) => (button = el)}
                {...tip.buttonProps}
                baseClass="locale-picker-button"
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
                        labelFor,
                    })
                ) : (
                    <svg
                        class="locale-picker-icon"
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
                        <circle
                            cx="8"
                            cy="8"
                            r="6"
                        />
                        <path
                            stroke-width="1.1"
                            d="M2 8h12M8 2v12M3.35 4.3a8 8 0 0 0 9.3 0M12.65 11.7a8 8 0 0 0-9.3 0M7.54 2.15a7.7 7.7 0 0 0 0 11.7M8.46 13.85a7.7 7.7 0 0 0 0-11.7"
                        />
                    </svg>
                )}
            </IconButton>
            {/* Purely visual: the same text is already the button's aria-label,
                so it is not wired with aria-describedby. */}
            <div
                class="locale-picker-tooltip"
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
                baseClass="locale-picker-list"
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
                    each={props.locales}
                    keyed={false}
                >
                    {(locale, i) => (
                        <li
                            class="locale-picker-option"
                            id={optionId(i)}
                            role="option"
                            aria-selected={locale() === currentValue() ? "true" : "false"}
                            data-active={i === activeIndex() ? "" : undefined}
                            lang={optionLang(locale())}
                            onClick={() => choose(i)}
                        >
                            {labelFor(locale())}
                        </li>
                    )}
                </For>
            </Listbox>
        </div>
    );
}

export default LocalePicker;
