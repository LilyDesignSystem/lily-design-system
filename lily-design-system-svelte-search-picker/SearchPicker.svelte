<script lang="ts" module>
    import type { Snippet } from "svelte";
    import { IconButton } from "@lilydesignsystem/svelte-headless";
    // Only the trigger button composes a headless primitive. The panel is
    // a real <form role="search"> with a real search field and a real
    // submit button — a disclosure, not a listbox or a menu — so headless
    // `Listbox` is the wrong widget for it, not merely an unmigrated one.

    /**
     * The submit button's visible content: U+23CE RETURN SYMBOL, a bare
     * literal character (never an escape — see `bin/test`'s glyph check).
     * It is the button's visible label only; the accessible name comes
     * from the required `submitLabel` prop, so assistive technology never
     * has to announce a symbol.
     */
    export const RETURN_SYMBOL = "⏎";

    /** Arguments passed to a custom `children` snippet (the button icon). */
    export type ChildArgs = {
        /** Is the search panel open? */
        open: boolean;
        /** The current text in the search field. */
        query: string;
    };

    /** Public props for SearchPicker. See `spec/index.md` §4 for the contract. */
    export type Props = {
        /** Accessible name for the icon button and the search landmark. */
        label: string;
        /** Accessible name for the search text field. */
        inputLabel: string;
        /** Accessible name for the ⏎ submit button. */
        submitLabel: string;
        /** Placeholder text for the search field. No default. */
        placeholder?: string;
        /** The search text. Bindable. */
        value?: string;
        /**
         * Path the query is appended to. The search for `foo` navigates to
         * `${action}?foo`; the default `"/"` gives `/?foo`.
         */
        action?: string;
        /**
         * Performs the navigation. Defaults to `location.assign(href)` — a
         * real GET request. Pass a client-side router's navigate function
         * (e.g. SvelteKit's `goto`) to keep the navigation in-app.
         */
        navigate?: (href: string) => void;
        /** Fires with the trimmed query and the destination, before navigating. */
        onSearch?: (query: string, href: string) => void;
        /** Replaces the default magnifying-glass icon inside the button. */
        children?: Snippet<[ChildArgs]>;
        /** Extra CSS class on the root. */
        class?: string;
        /** Spread props onto the root element. */
        [key: string]: unknown;
    };

    /**
     * The destination for a query: `action` + `?` + the URI-encoded,
     * trimmed query. `searchHref("foo")` is `"/?foo"`;
     * `searchHref("foo bar")` is `"/?foo%20bar"`.
     */
    export function searchHref(query: string, action = "/"): string {
        return `${action}?${encodeURIComponent(query.trim())}`;
    }

    let uid = 0;
    /** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
    export function nextSearchPickerId(): string {
        uid += 1;
        return `search-picker-${uid}`;
    }
</script>

<script lang="ts">
    let {
        class: className = "",
        label,
        inputLabel,
        submitLabel,
        placeholder,
        value = $bindable(""),
        action = "/",
        navigate,
        onSearch,
        children,
        ...restProps
    }: Props = $props();

    const baseId = nextSearchPickerId();
    const panelId = `${baseId}-panel`;
    const tooltipId = `${baseId}-tooltip`;

    let open = $state(false);
    let buttonEl: HTMLButtonElement | undefined = $state();
    let inputEl: HTMLInputElement | undefined = $state();
    let rootEl: HTMLDivElement | undefined = $state();

    // Tooltip: shown while the pointer is over the button or the tooltip
    // itself (hoverable, WCAG 1.4.13) or while the button has keyboard
    // focus; Escape dismisses it without moving focus; never shown while
    // the panel is open, since the panel then explains the control.
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
    }

    function openPanel(): void {
        open = true;
        // preventScroll: the panel is positioned by consumer CSS, and
        // focusing a field rendered partly off-screen would otherwise
        // scroll the whole page — the same fix the sibling pickers carry.
        queueMicrotask(() => inputEl?.focus({ preventScroll: true }));
    }

    function closePanel(refocus = true): void {
        if (!open) return;
        open = false;
        if (refocus) queueMicrotask(() => buttonEl?.focus({ preventScroll: true }));
    }

    function onButtonClick(): void {
        hoverButton = false;
        if (open) closePanel();
        else openPanel();
    }

    function onPanelKeydown(event: KeyboardEvent): void {
        if (event.key === "Escape") {
            event.preventDefault();
            closePanel();
        }
    }

    function onRootFocusOut(event: FocusEvent): void {
        // Close only when focus moves to a known element outside the
        // picker. A focusout with no relatedTarget is not "focus left":
        // Safari does not focus a <button> on click, so pressing ⏎ (or the
        // icon button) blurs the field with relatedTarget = null. Closing
        // there hid the panel before the click landed, so ⏎ never searched
        // and the icon button re-opened instead of closing. Clicks outside
        // the picker are handled by the document click listener below.
        const next = event.relatedTarget as Node | null;
        if (!next || rootEl?.contains(next)) return;
        closePanel(false);
    }

    function onSubmit(event: SubmitEvent): void {
        // The form's native GET would send `/?name=value`; the contract is
        // the bare query (`/?foo`), so navigation is done here instead.
        event.preventDefault();
        const query = value.trim();
        if (!query) return;
        const href = searchHref(query, action);
        onSearch?.(query, href);
        closePanel(false);
        if (navigate) navigate(href);
        else if (typeof location !== "undefined") location.assign(href);
    }
</script>

<svelte:document
    onclick={(event) => {
        if (!open) return;
        const t = event.target as Node | null;
        if (t && rootEl && !rootEl.contains(t)) closePanel(false);
    }}
/>

<div
    bind:this={rootEl}
    class={`search-picker ${className}`.trim()}
    onfocusout={onRootFocusOut}
    {...restProps}
>
    <IconButton
        bind:ref={buttonEl}
        baseClass="search-picker-button"
        label={label}
        aria-expanded={open}
        aria-controls={panelId}
        onclick={onButtonClick}
        onmouseenter={() => { hoverButton = true; dismissed = false; }}
        onmouseleave={() => { hoverButton = false; }}
        onfocus={onButtonFocus}
        onblur={() => { focusButton = false; dismissed = false; }}
        onkeydown={onButtonKeydown}
    >
        {#if children}
            {@render children({ open, query: value })}
        {:else}
            <svg
                class="search-picker-icon"
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
                <circle cx="7" cy="7" r="4.5" />
                <path d="M10.5 10.5 14 14" />
            </svg>
        {/if}
    </IconButton>

    <!-- Purely visual: the same text is already the button's aria-label,
         so it is not wired with aria-describedby (that would announce the
         name twice). -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="search-picker-tooltip"
        role="tooltip"
        id={tooltipId}
        hidden={!tooltipVisible}
        onmouseenter={() => { hoverTooltip = true; }}
        onmouseleave={() => { hoverTooltip = false; }}
    >{label}</div>

    <!-- The keydown handler only listens for Escape bubbling up from the
         field and the submit button inside; the panel itself takes no
         focus. -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="search-picker-panel" id={panelId} hidden={!open} onkeydown={onPanelKeydown}>
        <form class="search-picker-form" role="search" aria-label={label} action={action} method="get" onsubmit={onSubmit}>
            <input
                bind:this={inputEl}
                bind:value
                class="search-picker-input"
                type="search"
                aria-label={inputLabel}
                {placeholder}
                enterkeyhint="search"
            />
            <button type="submit" class="search-picker-submit" aria-label={submitLabel}>
                <span class="search-picker-submit-symbol" aria-hidden="true">{RETURN_SYMBOL}</span>
            </button>
        </form>
    </div>
</div>
