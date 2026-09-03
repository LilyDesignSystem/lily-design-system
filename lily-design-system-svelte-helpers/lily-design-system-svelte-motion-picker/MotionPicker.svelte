<script lang="ts" module>
    import type { Snippet } from "svelte";

    /**
     * Default button glyph: U+23F8 PAUSE SIGN, paired with U+FE0E
     * (VARIATION SELECTOR-15) to force text presentation — the same
     * treatment locale-picker gives its globe.
     *
     * A pause glyph reads as "stop the moving parts" more directly than an
     * abstract symbol, has a real monochrome glyph in ordinary system
     * fonts (media-transport symbols default to text presentation, unlike
     * most pictographs), and doesn't collide with any sibling picker's
     * glyph (theme's CIRCLE WITH RIGHT HALF BLACK, locale's GLOBE WITH
     * MERIDIANS, text-size's plain "A", share's BLACK RIGHTWARDS
     * ARROWHEAD, date-time's CALENDAR).
     */
    export const PAUSE_SIGN = "\u23F8\uFE0E";

    /** Arguments passed to a custom `children` snippet (the button glyph). */
    export type ChildArgs = {
        /** Currently selected motion slug. */
        value: string;
        /** Is the listbox open? */
        open: boolean;
        /** Resolve a slug to its display label. */
        labelFor: (motion: string) => string;
    };

    /** Public props for MotionPicker. See `spec/index.md` §4 for the contract. */
    export type Props = {
        /** Accessible name for the button and the listbox. */
        label: string;
        /** Available motion slugs, e.g. ["no-preference","reduce"]. */
        motions: string[];
        /** Currently selected motion slug. Two-way bindable. */
        value?: string;
        /** Initial motion when nothing else is supplied. */
        defaultValue?: string;
        /** If set, persist the selection to localStorage under this key. */
        storageKey?: string;
        /** `name` of the hidden input that carries the value in a form. */
        name?: string;
        /** Element that receives `data-motion`. Defaults to document.documentElement. */
        target?: HTMLElement | null;
        /** Optional pretty labels per slug. */
        motionLabels?: Record<string, string>;
        /** Replaces the default pause-sign glyph inside the button. */
        children?: Snippet<[ChildArgs]>;
        /** Called after the control applies a new motion preference. */
        onChange?: (motion: string) => void;
        /** Extra CSS class on the root. */
        class?: string;
        /** Spread props onto the root element. */
        [key: string]: unknown;
    };

    /**
     * Resolve a motion slug to its display label: each hyphen-separated
     * word title-cased, so "no-preference" renders as "No Preference".
     * Mirrors `sizeName` in text-size-picker and `themeName` in
     * theme-picker.
     */
    export function motionName(motion: string): string {
        return motion
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    /**
     * True when the platform reports a preference for reduced motion.
     * SSR-safe: `window`/`matchMedia` are absent on the server, so this
     * resolves to `false` there and the client re-derives it on mount.
     */
    export function prefersReducedMotion(): boolean {
        if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
            return false;
        }
        try {
            return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        } catch {
            return false;
        }
    }

    let uid = 0;
    /** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
    export function nextMotionPickerId(): string {
        uid += 1;
        return `motion-picker-${uid}`;
    }
</script>

<script lang="ts">
    let {
        class: className = "",
        label,
        motions,
        value = $bindable(""),
        defaultValue,
        storageKey,
        name = "motion",
        target,
        motionLabels = {},
        children,
        onChange,
        ...restProps
    }: Props = $props();

    const baseId = nextMotionPickerId();
    const listId = `${baseId}-list`;
    const optionId = (i: number) => `${baseId}-option-${i}`;

    let open = $state(false);
    let activeIndex = $state(-1);
    let buttonEl: HTMLButtonElement | undefined = $state();
    let listEl: HTMLUListElement | undefined = $state();
    let rootEl: HTMLDivElement | undefined = $state();

    // Typeahead buffer: APG listbox behaviour. Reset after a pause.
    let typeahead = "";
    let typeaheadTimer: ReturnType<typeof setTimeout> | undefined;

    function labelFor(motion: string): string {
        if (motion in motionLabels) return motionLabels[motion];
        return motionName(motion);
    }

    // The motion the DOM currently carries. Applying is idempotent: the
    // effect below can run for reasons other than a motion change, and
    // re-applying would re-fire `onChange`. A consumer whose onChange
    // writes reactive state then re-enters this effect, and Svelte stops
    // updating the component altogether (effect_update_depth_exceeded) —
    // the listbox freezes mid-open with a stale aria-expanded. Guarding
    // here also matches the spec: other prop changes are not retroactive.
    let appliedValue = "";

    function applyMotion(slug: string): void {
        if (typeof document === "undefined" || !slug) return;
        if (slug === appliedValue) return;
        appliedValue = slug;
        (target ?? document.documentElement).setAttribute("data-motion", slug);
        if (storageKey) {
            try {
                localStorage.setItem(storageKey, slug);
            } catch {
                // ignore quota / privacy errors
            }
        }
        onChange?.(slug);
    }

    function setMotion(slug: string): void {
        value = slug;
    }

    // ---------------------------------------------------------------
    // Open / close
    // ---------------------------------------------------------------

    function openList(startIndex?: number): void {
        const selected = motions.indexOf(value);
        // An empty list has no option to activate; -1 keeps
        // aria-activedescendant off rather than pointing at an id that
        // does not exist.
        activeIndex =
            motions.length === 0
                ? -1
                : (startIndex ?? (selected >= 0 ? selected : 0));
        open = true;
        // Focus moves to the listbox; the active option is conveyed via
        // aria-activedescendant, per the APG listbox pattern.
        queueMicrotask(() => {
            listEl?.focus();
            scrollActiveIntoView();
        });
    }

    function closeList(refocus = true): void {
        if (!open) return;
        open = false;
        activeIndex = -1;
        if (refocus) queueMicrotask(() => buttonEl?.focus());
    }

    function choose(index: number): void {
        const slug = motions[index];
        if (slug) setMotion(slug);
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

    function moveActive(delta: number): void {
        if (motions.length === 0) return;
        const next = Math.min(Math.max(activeIndex + delta, 0), motions.length - 1);
        activeIndex = next;
        scrollActiveIntoView();
    }

    function runTypeahead(char: string): void {
        const lower = char.toLowerCase();
        // APG listbox typeahead: a single character moves to the NEXT
        // option starting with it, and repeating that character keeps
        // cycling. Only a buffer of differing characters refines the
        // match, and that buffer stays anchored on the active option.
        const sameCharRun =
            typeahead === "" || [...typeahead].every((c) => c === lower);
        typeahead += lower;
        clearTimeout(typeaheadTimer);
        typeaheadTimer = setTimeout(() => (typeahead = ""), 500);
        const query = sameCharRun ? lower : typeahead;
        const anchor = activeIndex < 0 ? 0 : activeIndex;
        const start = sameCharRun ? anchor + 1 : anchor;
        // Search forward, wrapping once — typeahead wraps even though the
        // arrows clamp, or options above the cursor would be untypable.
        for (let n = 0; n < motions.length; n++) {
            const i = (start + n) % motions.length;
            if (labelFor(motions[i]).toLowerCase().startsWith(query)) {
                activeIndex = i;
                scrollActiveIntoView();
                return;
            }
        }
    }

    function onButtonKeydown(event: KeyboardEvent): void {
        switch (event.key) {
            case "ArrowDown":
            case "Enter":
            case " ":
                event.preventDefault();
                openList();
                break;
            case "ArrowUp":
                event.preventDefault();
                openList(motions.length - 1);
                break;
        }
    }

    function onListKeydown(event: KeyboardEvent): void {
        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                moveActive(1);
                break;
            case "ArrowUp":
                event.preventDefault();
                moveActive(-1);
                break;
            case "Home":
                event.preventDefault();
                activeIndex = 0;
                scrollActiveIntoView();
                break;
            case "End":
                event.preventDefault();
                activeIndex = motions.length - 1;
                scrollActiveIntoView();
                break;
            case "Enter":
            case " ":
                event.preventDefault();
                if (activeIndex >= 0) choose(activeIndex);
                break;
            case "Escape":
                event.preventDefault();
                closeList();
                break;
            case "PageUp":
                event.preventDefault();
                moveActive(-10);
                break;
            case "PageDown":
                // ±10, clamped: an APG-optional key, matching the
                // sibling pickers.
                event.preventDefault();
                moveActive(10);
                break;
            case "Tab":
                // Tab moves on — but focus goes to the button FIRST,
                // without cancelling the key. Hiding the focused list
                // drops focus to <body>, and the browser then computes
                // the default Tab move from the top of the document, so
                // tabbing out of an open picker teleported the user to
                // the page's first tab stop. From the button, the default
                // Tab lands exactly where leaving the picker should.
                buttonEl?.focus?.();
                closeList(false);
                break;
            default:
                if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
                    runTypeahead(event.key);
                }
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
            if (!initial && storageKey) {
                try {
                    initial = localStorage.getItem(storageKey) ?? "";
                } catch {
                    // ignore privacy errors
                }
            }
            if (!initial) {
                // Unlike text-size-picker's "medium" default, motion has a
                // real external signal to defer to: the platform's own
                // (prefers-reduced-motion: reduce) media query. A consumer
                // who ships ["no-preference","reduce"] gets an app that
                // already respects the OS setting before anyone touches
                // the control.
                const osPreferred = prefersReducedMotion() ? "reduce" : "no-preference";
                initial =
                    defaultValue ??
                    (motions.includes(osPreferred) ? osPreferred : undefined) ??
                    motions[0] ??
                    "";
            }
            if (initial && initial !== current) {
                value = initial;
                return;
            }
        }

        if (current) applyMotion(current);
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
    class={`motion-picker ${className}`.trim()}
    onfocusout={onRootFocusOut}
    {...restProps}
>
    <input type="hidden" {name} {value} />

    <button
        bind:this={buttonEl}
        type="button"
        class="motion-picker-button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onclick={() => (open ? closeList() : openList())}
        onkeydown={onButtonKeydown}
    >
        {#if children}
            {@render children({ value: value ?? "", open, labelFor })}
        {:else}
            <span class="motion-picker-icon" aria-hidden="true">{PAUSE_SIGN}</span>
        {/if}
    </button>

    <ul
        bind:this={listEl}
        class="motion-picker-list"
        id={listId}
        role="listbox"
        aria-label={label}
        aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
        tabindex="-1"
        hidden={!open}
        onkeydown={onListKeydown}
    >
        {#each motions as motion, i (motion)}
            <!-- The option's keyboard interaction lives on the listbox
                 (aria-activedescendant pattern): the list is the focused
                 element and its keydown handler operates the options, so a
                 per-option key handler would be wrong, not missing. -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <li
                class="motion-picker-option"
                id={optionId(i)}
                role="option"
                aria-selected={motion === value}
                data-active={i === activeIndex ? "" : undefined}
                onclick={() => choose(i)}
            >
                {labelFor(motion)}
            </li>
        {/each}
    </ul>
</div>
