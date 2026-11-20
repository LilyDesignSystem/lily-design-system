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
import { applyThemeColorWhenLoaded } from "./theme-color.js";
import { linkSettled, withViewTransition } from "./view-transition.js";
import {
    DEFAULT_SYSTEM_THEMES,
    SYSTEM_THEME,
    prefersDarkScheme,
    readDocumentThemeCookie,
    resolveTheme,
    themeChoices,
    watchColorScheme,
    writeDocumentThemeCookie,
    type SystemThemes,
} from "./theme-choice.js";

/**
 * Default button icon: a bundled SVG (contrast/half-circle), not a
 * Unicode character. Reversed 2026-09-16 from the font-dependent-glyph
 * convention (was U+25D1 CIRCLE WITH RIGHT HALF BLACK, exported as
 * `CIRCLE_WITH_RIGHT_HALF_BLACK` — removed, not renamed, since there is
 * no longer a single swappable character value). A bundled outline SVG
 * renders identically across every font stack and platform, where the
 * Unicode glyph depended on the consumer's fonts resolving U+25D1 to a
 * visually similar shape at all. `viewBox="0 0 16 16"`, stroke-based
 * (`stroke-width="1.6"`, round caps/joins) to match the other four
 * picker icons as one visual family. Override via `children`, same as
 * before.
 */

/** Arguments passed to a custom `children` render prop (the button glyph). */
export type ChildArgs = {
    /** Currently selected theme slug. */
    value: string;
    /** Is the listbox open? */
    open: boolean;
    /** Resolve a slug to its display label. */
    labelFor: (theme: string) => string;
};

/** Public props for ThemePicker. See `spec/index.md` §4 for the contract. */
export type Props = Omit<
    JSX.HTMLAttributes<HTMLDivElement>,
    "onChange" | "children" | "defaultValue"
> & {
    /** Accessible name for the button and the listbox. */
    label: string;
    /** Base URL of the themes directory, e.g. "/assets/themes/". */
    themesUrl: string;
    /** Available theme slugs. */
    themes: string[];
    /** Currently selected theme slug. When supplied, the component is controlled. */
    value?: string;
    /** Initial theme when nothing else is supplied. */
    defaultValue?: string;
    /**
     * The localStorage key that keeps the choice. Default `lily-{name}` (`lily-theme`); `""` keeps nothing there.
     * Written only when the choice changes, never on first load.
     */
    storageKey?: string;
    /** Resolve `prefers-color-scheme` to a supported theme on first visit. */
    detectFromSystem?: boolean;
    /**
     * The visible name of a first option, value `"system"` (`SYSTEM_THEME`), that follows the device: it applies
     * `systemThemes.light` or `systemThemes.dark` from `prefers-color-scheme`, and changes when the device does,
     * for example "Follow this device". Without it there is no such option. No English default.
     */
    systemLabel?: string;
    /** The themes the `"system"` option applies. Default `{ light: "light", dark: "dark" }`. */
    systemThemes?: SystemThemes;
    /**
     * The first-party cookie that keeps the choice (`Path=/`, `SameSite=Lax`, `Secure` on https, 400 days), so a server
     * can read it and send the page in the right theme (`readThemeCookie`). Default `lily-{name}` (`lily-theme`); `""`
     * sets no cookie. Written only when the choice changes, never on first load.
     */
    cookieName?: string;
    /**
     * Also set `<meta name="theme-color">` from the theme's `--lily-brand` once its stylesheet has loaded, so the
     * browser chrome follows the theme. Off by default; a theme without `--lily-brand` leaves the tag alone.
     */
    themeColor?: boolean;
    /**
     * Wrap each theme change in document.startViewTransition() when the browser has it and the user has not asked for
     * reduced motion, so the consumer's ::view-transition-* CSS can animate it. Off by default; the theme applies the same
     * either way.
     */
    viewTransition?: boolean;
    /** Discriminates the managed `<link>`; also the hidden input's `name`. */
    name?: string;
    /** File extension appended to each slug when constructing the URL. */
    extension?: string;
    /** Element that receives `data-theme`. Defaults to document.documentElement. */
    target?: HTMLElement | null;
    /** Optional pretty labels per slug. */
    themeLabels?: Record<string, string>;
    /** Replaces the default half-circle icon inside the button. */
    children?: (args: ChildArgs) => JSX.Element;
    /**
     * Called after the control applies a new theme, with the choice that applied it: the same slug, or `"system"`
     * when it follows the device. A controlled consumer stores `choice`, not `theme`.
     */
    onChange?: (theme: string, choice: string) => void;
    /** Is the popup open? Controlled when given; the popup starts as `defaultOpen` otherwise. */
    open?: boolean;
    /** Initial open state of an uncontrolled picker. */
    defaultOpen?: boolean;
    /** Called with the new open state whenever the user (or `disabled`) changes it. In controlled mode the parent applies it. */
    onOpenChange?: (open: boolean) => void;
    /** Disables the button; an open popup closes. */
    disabled?: boolean;
    /**
     * `"select"` renders a native `<select>` instead of the button and listbox (RFC 3 prototype; ported from the
     * Svelte reference 2026-10-30). Keyboard, typeahead and the mobile picker are the platform's; `open` and
     * `onOpenChange` do not apply. Default `"listbox"`.
     */
    variant?: "listbox" | "select";
    /** Extra CSS class on the root. */
    class?: string;
};

/**
 * Resolve a theme slug to its display label: each hyphen-separated
 * word title-cased, so a slug like
 * "united-kingdom-national-health-service-england-for-patients"
 * renders as "United Kingdom National Health Service England For
 * Patients". Mirrors `localeName` in locale-picker.
 */
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

function optionClass(theme: string): string {
    return theme === SYSTEM_THEME
        ? "theme-picker-option theme-picker-option-system"
        : "theme-picker-option";
}

export function themeName(theme: string): string {
    return theme
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

/**
 * Resolve the OS colour-scheme preference to a supported theme slug.
 * Mirrors `matchNavigatorLanguage` in locale-picker. Returns "" when
 * the preferred scheme is not in `themes`, or when matchMedia is
 * unavailable (SSR, and jsdom).
 */
export function matchSystemTheme(themes: readonly string[]): string {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return "";
    }
    const wanted = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    return themes.includes(wanted) ? wanted : "";
}

/** Normalize the themes directory URL to end with exactly one "/". */
export function normalizeThemesUrl(themesUrl: string): string {
    return themesUrl.endsWith("/") ? themesUrl : themesUrl + "/";
}

/** Construct the href for a given theme slug. */
export function themeHref(themesUrl: string, slug: string, extension: string): string {
    return normalizeThemesUrl(themesUrl) + slug + extension;
}

function resolveInitialTheme(
    value: string | undefined,
    storageKey: string | undefined,
    detectFromSystem: boolean,
    defaultValue: string | undefined,
    themes: string[],
    cookieName: string | undefined,
    systemLabel: string | undefined,
): string {
    if (value) return value;
    if (cookieName) {
        const kept = readDocumentThemeCookie(cookieName, themeChoices(themes, systemLabel));
        if (kept) return kept;
    }
    if (storageKey) {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored && themeChoices(themes, systemLabel).includes(stored)) return stored;
        } catch {
            // ignore privacy errors
        }
    }
    if (detectFromSystem) {
        const match = matchSystemTheme(themes);
        if (match) return match;
    }
    if (defaultValue) return defaultValue;
    // With a "system" option, following the device is the natural start.
    if (systemLabel) return SYSTEM_THEME;
    if (themes.includes("light")) return "light";
    return themes[0] ?? "";
}

export function ThemePicker(props: Props): JSX.Element {
    const rest = omit(
        props,
        "label",
        "themesUrl",
        "themes",
        "value",
        "defaultValue",
        "storageKey",
        "detectFromSystem",
        "systemLabel",
        "systemThemes",
        "cookieName",
        "themeColor",
        "viewTransition",
        "name",
        "extension",
        "target",
        "themeLabels",
        "children",
        "onChange",
        "class",
        "open",
        "defaultOpen",
        "onOpenChange",
        "disabled",
        "variant",
    );
    const name = () => props.name ?? "theme";
    const extension = () => props.extension ?? ".css";
    const systemThemes = () => props.systemThemes ?? DEFAULT_SYSTEM_THEMES;
    const isControlled = () => props.value !== undefined;

    // Both stores are on by default, under `lily-{name}`; an empty string turns one off.
    const storageKey = () => props.storageKey ?? `lily-${name()}`;
    const cookieName = () => props.cookieName ?? `lily-${name()}`;

    // Internal state for uncontrolled mode. Starts empty; resolved after mount (SSR-safe).
    const [internalValue, setInternalValue] = createSignal("");

    // One read path for both modes.
    const currentValue = () => (isControlled() ? (props.value as string) : internalValue());

    // `createUniqueId` is stable across server and client render, so the option ids survive hydration.
    const baseId = `theme-picker-${createUniqueId()}`;
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

    // The choices offered: "system" first when it has a label, then the themes.
    const options = () => themeChoices(props.themes, props.systemLabel);

    // The device's colour scheme, kept current while "system" is chosen so the page follows the device.
    const [prefersDark, setPrefersDark] = createSignal(false);
    createEffect(currentValue, (choice) => {
        if (choice !== SYSTEM_THEME) return;
        setPrefersDark(prefersDarkScheme());
        return watchColorScheme(setPrefersDark);
    });

    function labelFor(theme: string): string {
        if (theme === SYSTEM_THEME && props.systemLabel) return props.systemLabel;
        const labels = props.themeLabels ?? {};
        if (theme in labels) return labels[theme];
        return themeName(theme);
    }

    function getManagedLink(): HTMLLinkElement {
        const selector = `link[data-lily-theme-picker="${name()}"]`;
        let link = document.head.querySelector<HTMLLinkElement>(selector);
        if (!link) {
            link = document.createElement("link");
            link.rel = "stylesheet";
            link.setAttribute("data-lily-theme-picker", name());
            document.head.appendChild(link);
        }
        return link;
    }

    // The theme the DOM currently carries. Applying is idempotent: a controlled consumer's `onChange`
    // writes the value back, which re-runs the apply effect; without this guard every selection would fire
    // `onChange` (and rewrite storage) twice.
    let applied = "";

    function applyTheme(slug: string, choice: string): void {
        if (typeof document === "undefined" || !slug) return;
        if (slug === applied) return;
        const first = applied === "";
        applied = slug;
        const link = getManagedLink();
        const transition = props.viewTransition ?? false;
        withViewTransition(transition && !first, async () => {
            link.href = themeHref(props.themesUrl, slug, extension());
            if (props.themeColor) applyThemeColorWhenLoaded(link);
            (props.target ?? document.documentElement).setAttribute("data-theme", slug);
            if (transition) await linkSettled(link);
        });
        props.onChange?.(slug, choice);
    }

    // The choice is kept, not the theme it applies: "system" stays "system", so the next visit follows the device
    // again. Kept once per change of choice; the starting choice is not written (see the initial resolution).
    let kept = "";
    function keepChoice(choice: string): void {
        if (choice === kept) return;
        kept = choice;
        const key = storageKey();
        if (key) {
            try {
                localStorage.setItem(key, choice);
            } catch {
                // ignore quota / privacy errors
            }
        }
        const cookie = cookieName();
        if (cookie) writeDocumentThemeCookie(cookie, choice);
    }

    /** Apply a choice and keep it. */
    function applyChoice(choice: string, dark = untrack(prefersDark)): void {
        if (!choice) return;
        applyTheme(resolveTheme(choice, dark, systemThemes()), choice);
        keepChoice(choice);
    }

    function setTheme(slug: string): void {
        if (untrack(isControlled)) {
            // The consumer owns `value`; apply straight away so the DOM stays in step even if they never write it back.
            applyChoice(slug);
        } else {
            // The value effect below applies it, exactly once per change.
            setInternalValue(slug);
        }
    }

    // ---------------------------------------------------------------
    // Open / close
    // ---------------------------------------------------------------

    function openList(startIndex?: number): void {
        const opts = options();
        const selected = opts.indexOf(untrack(currentValue) ?? "");
        // An empty list has no option to activate; -1 keeps aria-activedescendant off rather than pointing at an id
        // that does not exist.
        setActiveIndex(opts.length === 0 ? -1 : (startIndex ?? (selected >= 0 ? selected : 0)));
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
        const slug = options()[index];
        if (slug) setTheme(slug);
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
                openList(options().length - 1);
                break;
        }
    }

    /** focusout bubbles, so the root hears focus leaving any descendant. */
    function onRootFocusOut(event: FocusEvent): void {
        const next = event.relatedTarget as Node | null;
        if (next && root?.contains(next)) return;
        closeList(false);
    }

    // Move focus to the listbox on open, back to the button on close.
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
            setPrefersDark(prefersDarkScheme());
            const initial = resolveInitialTheme(
                currentValue() || undefined,
                storageKey(),
                props.detectFromSystem ?? false,
                props.defaultValue,
                props.themes,
                cookieName(),
                props.systemLabel,
            );
            initialised = true;
            if (!initial) return;
            // The starting choice is not written: nothing is stored until the choice changes.
            kept = initial;
            if (isControlled() || initial === internalValue()) applyChoice(initial);
            else setInternalValue(initial);
        });
    });

    // Re-apply whenever the choice or the device's scheme changes.
    createEffect(
        () => [currentValue(), prefersDark()] as const,
        ([choice, dark]) => {
            if (!initialised || !choice) return;
            applyChoice(choice, dark);
        },
    );

    const tip = createPickerTooltip(() => button, open);

    if (untrack(() => props.variant) === "select") {
        // The platform's own select: keyboard, typeahead, the mobile picker and the announcement are the browser's;
        // the component only applies the chosen theme. Each option's `selected` marks the choice, which also holds in
        // server-rendered markup.
        return (
            <div
                class={`theme-picker ${props.class ?? ""}`.trim()}
                data-variant="select"
                {...rest}
            >
                <select
                    class="theme-picker-select"
                    name={name()}
                    aria-label={props.label}
                    disabled={props.disabled ?? false}
                    onChange={(event) => setTheme(event.currentTarget.value)}
                >
                    <For
                        each={options()}
                        keyed={false}
                    >
                        {(theme) => (
                            <>
                                <option
                                    class={optionClass(theme())}
                                    value={theme()}
                                    selected={theme() === currentValue()}
                                >
                                    {labelFor(theme())}
                                </option>
                                {theme() === SYSTEM_THEME && <hr class="theme-picker-separator" />}
                            </>
                        )}
                    </For>
                </select>
            </div>
        );
    }

    return (
        <div
            ref={(el) => (root = el)}
            class={`theme-picker ${props.class ?? ""}`.trim()}
            onFocusOut={onRootFocusOut}
            {...rest}
        >
            <input
                type="hidden"
                name={name()}
                value={currentValue() ?? ""}
            />

            <IconButton
                disabled={props.disabled ?? false}
                ref={(el: HTMLButtonElement) => (button = el)}
                {...tip.buttonProps}
                baseClass="theme-picker-button"
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
                        class="theme-picker-icon"
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
                            d="M8 2a6 6 0 0 1 0 12z"
                            fill="currentColor"
                            stroke="none"
                        />
                    </svg>
                )}
            </IconButton>
            {/* Purely visual: the same text is already the button's aria-label,
          so it is not wired with aria-describedby. */}
            <div
                class="theme-picker-tooltip"
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
                baseClass="theme-picker-list"
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
                {/* The "system" option carries its own class hook: a listbox may hold only options and groups, so
                    the line between it and the themes is the theme's CSS (a border on this option), not an element. */}
                <For
                    each={options()}
                    keyed={false}
                >
                    {(theme, i) => (
                        <li
                            class={optionClass(theme())}
                            id={optionId(i)}
                            role="option"
                            aria-selected={theme() === currentValue() ? "true" : "false"}
                            data-active={i === activeIndex() ? "" : undefined}
                            onClick={() => choose(i)}
                        >
                            {labelFor(theme())}
                        </li>
                    )}
                </For>
            </Listbox>
        </div>
    );
}

export default ThemePicker;
