<script lang="ts" module>
    import type { Snippet } from "svelte";
    import { IconButton, Listbox } from "@lilydesignsystem/svelte-headless";

    /**
     * Default button icon: a bundled SVG (two pause bars), not a Unicode
     * character. Reversed 2026-09-16 from the font-dependent-glyph
     * convention (was U+23F8 PAUSE SIGN + U+FE0E, exported as
     * `PAUSE_SIGN` — removed, not renamed). "Stop the moving parts" still
     * reads directly from two bars; a bundled outline SVG matches the
     * other four picker icons as one consistent visual family regardless
     * of the consumer's fonts, where the old glyph depended on the
     * platform's media-transport symbols defaulting to text presentation.
     */

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
        /** Replaces the default pause-bars icon inside the button. */
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
    let listEl: HTMLElement | undefined = $state();
    let rootEl: HTMLDivElement | undefined = $state();

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
    // Open / close. Arrow/Home/End/PageUp/PageDown/typeahead/Escape/Tab
    // keyboard handling inside the open list is owned by Listbox's
    // "active-descendant" mode (see @lilydesignsystem/svelte-headless);
    // this component only decides what open/close/choose/scroll mean.
    // ---------------------------------------------------------------

    function scrollActiveIntoView(): void {
        if (activeIndex < 0 || !listEl) return;
        const el = document.getElementById(optionId(activeIndex));
        el?.scrollIntoView?.({ block: "nearest" });
    }

    // Keep the highlighted option in view for every reason activeIndex
    // can change: opening, arrows, typeahead, Home/End, PageUp/PageDown.
    $effect(() => {
        activeIndex;
        scrollActiveIntoView();
    });

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
        // aria-activedescendant, per the APG listbox pattern. preventScroll
        // stops the browser's default scroll-into-view: the listbox is
        // positioned by CSS (see AGENTS/theme.md), and without a consumer
        // override for a right-edge header the box can render partly
        // off-screen, and focusing it then auto-scrolled the whole page --
        // which reads as the page jumping sideways the instant the picker
        // opens.
        queueMicrotask(() => {
            listEl?.focus({ preventScroll: true });
        });
    }

    function closeList(refocus = true): void {
        if (!open) return;
        open = false;
        activeIndex = -1;
        if (refocus) queueMicrotask(() => buttonEl?.focus({ preventScroll: true }));
    }

    function choose(index: number): void {
        const slug = motions[index];
        if (slug) setMotion(slug);
        closeList();
    }

    function handleTabOut(): void {
        // Tab moves on — but focus goes to the button FIRST, without
        // cancelling the key (Listbox's onTabOut never preventDefaults
        // Tab). Hiding the focused list drops focus to <body>, and the
        // browser then computes the default Tab move from the top of the
        // document, so tabbing out of an open picker teleported the user
        // to the page's first tab stop. From the button, the default Tab
        // lands exactly where leaving the picker should.
        buttonEl?.focus?.({ preventScroll: true });
        closeList(false);
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

    <IconButton
        bind:ref={buttonEl}
        baseClass="motion-picker-button"
        label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onclick={() => (open ? closeList() : openList())}
        onkeydown={onButtonKeydown}
    >
        {#if children}
            {@render children({ value: value ?? "", open, labelFor })}
        {:else}
            <svg
                class="motion-picker-icon"
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
                <path d="M5 3v10M11 3v10" />
            </svg>
        {/if}
    </IconButton>

    <Listbox
        bind:ref={listEl}
        as="ul"
        baseClass="motion-picker-list"
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
        {#each motions as motion, i (motion)}
            <!-- The option's keyboard interaction lives on the listbox
                 (aria-activedescendant pattern): the list is the focused
                 element and Listbox's own keydown handling operates the
                 options, so a per-option key handler would be wrong, not
                 missing. -->
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
    </Listbox>
</div>
