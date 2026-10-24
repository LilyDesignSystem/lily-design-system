<script lang="ts" module>
    import type { Snippet } from "svelte";
    import { IconButton, Listbox } from "@lilydesignsystem/svelte-headless";
    import { DEFAULT_ZONES, type ZoneInfo } from "./zones.js";

    export { DEFAULT_ZONES };
    export type { ZoneInfo };

    /** Arguments passed to a custom `children` snippet (the button glyph). */
    export type ChildArgs = {
        /** The selected zone's IANA id. */
        value: string;
        /** Is the listbox open? */
        open: boolean;
        /** Offset, name and label of any listed zone. */
        infoFor: (zone: string) => ZoneInfo | undefined;
    };

    /** Public props for TimeZonePicker. See `spec/index.md` §4 for the contract. */
    export type Props = {
        /** Accessible name for the button and the listbox. */
        label: string;
        /**
         * BCP 47 tag the zone names are written in (`en`, `fr-FR`, `cy-GB`). Required: the picker never picks a
         * language for you.
         */
        locale: string;
        /** IANA zone ids to offer. Default: {@link DEFAULT_ZONES}. They are shown ordered by offset, not in this order. */
        zones?: readonly string[];
        /** The moment offsets and names are worked out for. Default: now. A zone with daylight saving time differs by date. */
        date?: Date;
        /** Selected zone, an IANA id. Two-way bindable. */
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
        children?: Snippet<[ChildArgs]>;
        /** Called after the control applies a new zone. */
        onChange?: (zone: string) => void;
        /** Is the popup open? Bindable. */
        open?: boolean;
        /** Fires whenever the open state changes, by the user or from outside. */
        onOpenChange?: (open: boolean) => void;
        /** Disables the button; an open popup closes. */
        disabled?: boolean;
        /** Extra CSS class on the root. */
        class?: string;
        /** Spread props onto the root element. */
        [key: string]: unknown;
    };

    let uid = 0;
    /** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
    export function nextTimeZonePickerId(): string {
        uid += 1;
        return `time-zone-picker-${uid}`;
    }
</script>

<script lang="ts">
    import { untrack } from "svelte";
    import { matchZone, orderedZones, systemZone, zoneInfo } from "./zones.js";
    let {
        class: className = "",
        label,
        locale,
        zones = DEFAULT_ZONES,
        date,
        value = $bindable(""),
        defaultValue,
        storageKey,
        name = "time-zone",
        target,
        labelFor,
        children,
        onChange,
        open = $bindable(false),
        onOpenChange,
        disabled = false,
        ...restProps
    }: Props = $props();

    const baseId = nextTimeZonePickerId();
    const listId = `${baseId}-list`;
    const tooltipId = `${baseId}-tooltip`;
    const optionId = (i: number) => `${baseId}-option-${i}`;

    // Every change reaches `onOpenChange` once, whether the user or the parent made it;
    // a disabled picker cannot stay open. `lastOpen` starts at the initial value, so mounting
    // open is not a change.
    let lastOpen = untrack(() => open);
    $effect(() => {
        if (disabled && open) open = false;
        if (open !== lastOpen) {
            lastOpen = open;
            onOpenChange?.(open);
        }
    });

    // Tooltip: shown while the pointer is over the button or the tooltip
    // itself (hoverable, WCAG 1.4.13) or while the button has keyboard
    // focus; Escape dismisses it without moving focus; never shown while
    // the popup is open, since the popup then explains the control.
    let hoverButton = $state(false);
    let hoverTooltip = $state(false);
    let focusButton = $state(false);
    let dismissed = $state(false);
    const tooltipVisible = $derived(
        !open && !dismissed && (hoverButton || hoverTooltip || focusButton),
    );

    function onButtonFocus(): void {
        // Keyboard focus only: a mouse click also focuses the button in
        // Chromium, and the tooltip should not stick after a click.
        try {
            focusButton = buttonEl?.matches(":focus-visible") ?? false;
        } catch {
            focusButton = true; // engine without :focus-visible — err towards showing
        }
    }
    let activeIndex = $state(-1);
    let buttonEl: HTMLButtonElement | undefined = $state();
    let listEl: HTMLElement | undefined = $state();
    let rootEl: HTMLDivElement | undefined = $state();

    // The zones as the listbox shows them, ordered by offset. The date is read once when none is given: a picker
    // that re-sorted itself while open would move the option under the pointer.
    const when = untrack(() => date ?? new Date());
    const infos = $derived(orderedZones(zones, locale, date ?? when, labelFor));
    const ids = $derived(infos.map((z) => z.id));
    const infoFor = (zone: string) => zoneInfo(zone, locale, date ?? when, labelFor);

    // The zone the DOM currently carries. Applying is idempotent: the
    // effect below can run for reasons other than a zone change, and
    // re-applying would re-fire `onChange`. A consumer whose onChange
    // writes reactive state then re-enters this effect, and Svelte stops
    // updating the component altogether (effect_update_depth_exceeded) —
    // the listbox freezes mid-open with a stale aria-expanded. Guarding
    // here also matches the spec: other prop changes are not retroactive.
    let appliedValue = "";

    function applyZone(slug: string): void {
        if (typeof document === "undefined" || !slug) return;
        if (slug === appliedValue) return;
        appliedValue = slug;
        (target ?? document.documentElement).setAttribute("data-time-zone", slug);
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
        value = slug;
    }

    // ---------------------------------------------------------------
    // Open / close
    // ---------------------------------------------------------------

    function openList(startIndex?: number): void {
        const selected = ids.indexOf(value);
        // An empty list has no option to activate; -1 keeps
        // aria-activedescendant off rather than pointing at an id that
        // does not exist.
        activeIndex =
            ids.length === 0
                ? -1
                : (startIndex ?? (selected >= 0 ? selected : 0));
        open = true;
        // Focus moves to the listbox; the active option is conveyed via
        // aria-activedescendant, per the APG listbox pattern. preventScroll
        // stops the browser's default scroll-into-view: the listbox is
        // positioned by CSS (see AGENTS/theme.md), and without a consumer
        // override for a right-edge header the box can render partly
        // off-screen, and focusing it then auto-scrolled the whole page --
        // which reads as the page jumping sideways the instant the picker
        // opens.
        queueMicrotask(() => {
            listEl?.focus({ preventScroll: true });
            scrollActiveIntoView();
        });
    }

    function closeList(refocus = true): void {
        if (!open) return;
        open = false;
        activeIndex = -1;
        if (refocus) queueMicrotask(() => buttonEl?.focus({ preventScroll: true }));
    }

    function choose(index: number): void {
        const slug = ids[index];
        if (slug) setZone(slug);
        closeList();
    }

    function scrollActiveIntoView(): void {
        if (activeIndex < 0 || !listEl) return;
        // getElementById, not a `#id` selector: ids here are generated and
        // contain nothing needing escaping, and `CSS` is absent entirely in
        // jsdom — `CSS.escape` there throws inside the keydown handler,
        // after activeIndex is already assigned, so the suite stays green
        // while this path never actually runs.
        const el = document.getElementById(optionId(activeIndex));
        el?.scrollIntoView?.({ block: "nearest" });
    }

    // Arrow/Home/End/PageUp/PageDown/typeahead/Escape/Tab keyboard handling
    // inside the open list is owned by Listbox's "active-descendant" mode
    // (see @lilydesignsystem/svelte-headless); this component only decides
    // what open/close/choose/scroll mean. Keep the highlighted option in
    // view for every reason activeIndex can change.
    $effect(() => {
        activeIndex;
        scrollActiveIntoView();
    });

    function handleTabOut(): void {
        // Tab moves on — but focus goes to the button FIRST, without
        // cancelling the key (Listbox's onTabOut never preventDefaults
        // Tab). Hiding the focused list drops focus to <body>, and the
        // browser then computes the default Tab move from the top of the
        // document, so tabbing out of an open picker teleported the user to
        // the page's first tab stop. From the button, the default Tab
        // lands exactly where leaving the picker should.
        buttonEl?.focus?.({ preventScroll: true });
        closeList(false);
    }

    // WCAG 1.4.13 "dismissable": a tooltip shown by pointer hover alone has
    // no focus on the button, so Escape must work wherever focus is. The
    // document listener exists only while the tooltip is visible and is
    // removed on hide/destroy ($effect cleanup). $effect never runs during
    // SSR. It neither prevents default, stops propagation, nor moves focus.
    $effect(() => {
        if (!tooltipVisible) return;
        const onDocumentKeydown = (event: KeyboardEvent): void => {
            if (event.key === "Escape") dismissed = true;
        };
        document.addEventListener("keydown", onDocumentKeydown);
        return () => document.removeEventListener("keydown", onDocumentKeydown);
    });

    function onButtonKeydown(event: KeyboardEvent): void {
        if (event.key === "Escape" && tooltipVisible) dismissed = true;
        switch (event.key) {
            case "ArrowDown":
            case "Enter":
            case " ":
                event.preventDefault();
                openList();
                break;
            case "ArrowUp":
                event.preventDefault();
                openList(ids.length - 1);
                break;
        }
    }

    function onRootFocusOut(event: FocusEvent): void {
        const next = event.relatedTarget as Node | null;
        if (next && rootEl?.contains(next)) return;
        closeList(false);
    }

    // ---------------------------------------------------------------
    // Initial value resolution + apply
    // ---------------------------------------------------------------

    let initialised = false;

    $effect(() => {
        const current = value;

        if (!initialised) {
            initialised = true;
            let initial = current;
            // A stored zone that is no longer offered is not restored.
            if (!initial && storageKey) {
                try {
                    const stored = localStorage.getItem(storageKey) ?? "";
                    if (ids.includes(stored)) initial = stored;
                } catch {
                    // ignore privacy errors
                }
            }
            if (!initial) {
                // The reader's own zone when it is listed (or has a listed twin), else the default, else UTC.
                initial =
                    defaultValue ??
                    matchZone(systemZone(), infos, locale, date ?? when) ??
                    (ids.includes("UTC") ? "UTC" : ids[0]) ??
                    "";
            }
            if (initial && initial !== current) {
                value = initial;
                return;
            }
        }

        if (current) applyZone(current);
    });
</script>

<svelte:document
    onclick={(event) => {
        if (!open) return;
        const t = event.target as Node | null;
        if (t && rootEl && !rootEl.contains(t)) closeList(false);
    }}
/>

<div
    bind:this={rootEl}
    class={`time-zone-picker ${className}`.trim()}
    onfocusout={onRootFocusOut}
    {...restProps}
>
    <input type="hidden" {name} {value} />

    <IconButton
        {disabled}
        bind:ref={buttonEl}
        baseClass="time-zone-picker-button"
        label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onclick={() => { hoverButton = false; if (open) closeList(); else openList(); }}
        onkeydown={onButtonKeydown}
        onmouseenter={() => { hoverButton = true; dismissed = false; }}
        onmouseleave={() => { hoverButton = false; }}
        onfocus={onButtonFocus}
        onblur={() => { focusButton = false; dismissed = false; }}
    >
        {#if children}
            {@render children({ value: value ?? "", open, infoFor })}
        {:else}
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
        {/if}
    </IconButton>

    <!-- Purely visual: the same text is already the button's aria-label,
         so it is not wired with aria-describedby (that would announce the
         name twice). -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="time-zone-picker-tooltip"
        role="tooltip"
        id={tooltipId}
        hidden={!tooltipVisible}
        onmouseenter={() => { hoverTooltip = true; }}
        onmouseleave={() => { hoverTooltip = false; }}
    >{label}</div>

    <Listbox
        bind:ref={listEl}
        as="ul"
        baseClass="time-zone-picker-list"
        id={listId}
        label={label}
        navigation="active-descendant"
        clamp
        typeahead
        pageSize={10}
        bind:activeIndex
        hidden={!open}
        onActivate={choose}
        onEscape={() => closeList()}
        onTabOut={handleTabOut}
    >
        {#each infos as zone, i (zone.id)}
            <!-- The option's keyboard interaction lives on the listbox
                 (aria-activedescendant pattern): the list is the focused
                 element and its keydown handler operates the options, so a
                 per-option key handler would be wrong, not missing. -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <li
                class="time-zone-picker-option"
                id={optionId(i)}
                role="option"
                aria-selected={zone.id === value}
                data-active={i === activeIndex ? "" : undefined}
                data-offset={zone.offset}
                onclick={() => choose(i)}
            >
                {zone.label}
            </li>
        {/each}
    </Listbox>
</div>
