<script lang="ts" module>
    import type { Snippet } from "svelte";
    import { IconButton } from "@lilydesignsystem/svelte-headless";
    // Only the trigger button composes a headless primitive. The panel is a
    // disclosure of whatever the app puts in it — links, buttons, forms —
    // so it carries no ARIA menu roles (role="menu" would promise a
    // roving-focus menuitem widget that arbitrary content is not). See
    // spec/index.md §3.

    /** Arguments passed to the `children` (panel content) and `icon` snippets. */
    export type ChildArgs = {
        /** Is the panel open? */
        open: boolean;
        /** Close the panel and return focus to the button. */
        close: () => void;
    };

    /** Public props for SettingsPicker. See `spec/index.md` §4 for the contract. */
    export type Props = {
        /** Accessible name for the button, the panel and the tooltip. */
        label: string;
        /** Is the panel open? Bindable. */
        open?: boolean;
        /**
         * Close the panel when a link, button or `[role="menuitem"]` inside it
         * is activated. Add `data-settings-picker-keep-open` to an element to opt
         * it out. Default `true`.
         */
        closeOnSelect?: boolean;
        /** Fires whenever the open state changes. */
        onOpenChange?: (open: boolean) => void;
        /** The panel's content: whatever the app provides. */
        children?: Snippet<[ChildArgs]>;
        /** Replaces the default cog icon inside the button. */
        icon?: Snippet<[ChildArgs]>;
        /** Extra CSS class on the root. */
        class?: string;
        /** Spread props onto the root element. */
        [key: string]: unknown;
    };

    let uid = 0;
    /** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
    export function nextSettingsPickerId(): string {
        uid += 1;
        return `settings-picker-${uid}`;
    }

    /** The selector for focusable things inside the panel. */
    export const FOCUSABLE =
        'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
</script>

<script lang="ts">
    let {
        class: className = "",
        label,
        open = $bindable(false),
        closeOnSelect = true,
        onOpenChange,
        children,
        icon,
        ...restProps
    }: Props = $props();

    const baseId = nextSettingsPickerId();
    const panelId = `${baseId}-panel`;
    const tooltipId = `${baseId}-tooltip`;

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

    let buttonEl: HTMLButtonElement | undefined = $state();
    let panelEl: HTMLDivElement | undefined = $state();
    let rootEl: HTMLDivElement | undefined = $state();

    function setOpen(next: boolean): void {
        if (open === next) return;
        open = next;
        onOpenChange?.(next);
    }

    function onButtonFocus(): void {
        // Keyboard focus only: a mouse click also focuses the button in
        // Chromium, and the tooltip should not stick after a click.
        try {
            focusButton = buttonEl?.matches(":focus-visible") ?? false;
        } catch {
            focusButton = true; // engine without :focus-visible — err towards showing
        }
    }

    function focusables(): HTMLElement[] {
        return panelEl ? Array.from(panelEl.querySelectorAll<HTMLElement>(FOCUSABLE)) : [];
    }

    function openPanel(focus: "none" | "first" | "last" = "none"): void {
        setOpen(true);
        if (focus === "none") return;
        // preventScroll: the panel is positioned by CSS, and an automatic
        // scroll-into-view on focus would slide the page sideways.
        queueMicrotask(() => {
            const all = focusables();
            (focus === "last" ? all[all.length - 1] : all[0])?.focus({ preventScroll: true });
        });
    }

    function closePanel(refocus = true): void {
        if (!open) return;
        setOpen(false);
        if (refocus) queueMicrotask(() => buttonEl?.focus({ preventScroll: true }));
    }

    function onButtonClick(): void {
        hoverButton = false;
        if (open) closePanel();
        else openPanel();
    }

    // WCAG 1.4.13 "dismissable": a tooltip shown by pointer hover alone has
    // no focus on the button, so Escape must work wherever focus is. The
    // document listener exists only while the tooltip is visible.
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
        if (event.key === "Escape" && open) {
            event.preventDefault();
            closePanel();
        } else if (event.key === "ArrowDown") {
            // Enter and Space already toggle (they produce a click); the
            // arrows open and move into the panel.
            event.preventDefault();
            if (!open) openPanel("first");
            else focusables()[0]?.focus({ preventScroll: true });
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (!open) openPanel("last");
            else {
                const all = focusables();
                all[all.length - 1]?.focus({ preventScroll: true });
            }
        }
    }

    function onPanelKeydown(event: KeyboardEvent): void {
        if (event.key === "Escape") {
            event.preventDefault();
            closePanel();
        } else if (event.key === "Tab") {
            // Tab leaves the control — but focus goes to the button FIRST,
            // without cancelling the key, so the browser continues from the
            // picker's position rather than from <body>.
            buttonEl?.focus?.({ preventScroll: true });
            closePanel(false);
        }
    }

    function onRootFocusOut(event: FocusEvent): void {
        const next = event.relatedTarget as Node | null;
        if (next && rootEl?.contains(next)) return;
        closePanel(false);
    }

    function onPanelClick(event: MouseEvent): void {
        if (!closeOnSelect) return;
        const target = event.target as Element | null;
        const hit = target?.closest?.('a[href], button, [role="menuitem"]');
        if (!hit || !panelEl?.contains(hit)) return;
        if (hit.closest("[data-settings-picker-keep-open]")) return;
        closePanel();
    }

    const api: ChildArgs = $derived({ open, close: () => closePanel() });
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
    class={`settings-picker ${className}`.trim()}
    onfocusout={onRootFocusOut}
    {...restProps}
>
    <IconButton
        bind:ref={buttonEl}
        baseClass="settings-picker-button"
        label={label}
        aria-expanded={open}
        aria-controls={panelId}
        onclick={onButtonClick}
        onkeydown={onButtonKeydown}
        onmouseenter={() => { hoverButton = true; dismissed = false; }}
        onmouseleave={() => { hoverButton = false; }}
        onfocus={onButtonFocus}
        onblur={() => { focusButton = false; dismissed = false; }}
    >
        {#if icon}
            {@render icon(api)}
        {:else}
            <svg
                class="settings-picker-icon"
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
                <path d="M6.7 3.3L7.0 1.4L9.0 1.4L9.3 3.3L10.5 3.8L11.9 2.6L13.4 4.1L12.2 5.6L12.7 6.7L14.6 7.0L14.6 9.0L12.7 9.3L12.2 10.4L13.4 11.9L11.9 13.4L10.5 12.2L9.3 12.7L9.0 14.6L7.0 14.6L6.7 12.7L5.6 12.2L4.1 13.4L2.6 11.9L3.8 10.4L3.3 9.3L1.4 9.0L1.4 7.0L3.3 6.7L3.8 5.5L2.6 4.1L4.1 2.6L5.5 3.8Z" /><circle cx="8" cy="8" r="2.2" />
            </svg>
        {/if}
    </IconButton>

    <!-- Purely visual: the same text is already the button's aria-label,
         so it is not wired with aria-describedby (that would announce the
         name twice). -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="settings-picker-tooltip"
        role="tooltip"
        id={tooltipId}
        hidden={!tooltipVisible}
        onmouseenter={() => { hoverTooltip = true; }}
        onmouseleave={() => { hoverTooltip = false; }}
    >{label}</div>

    <!-- A named group, not a menu: the content is the app's. The handlers
         are pure delegation for whatever focusable content the app puts
         inside; the panel itself is not interactive and takes no focus. -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
        bind:this={panelEl}
        class="settings-picker-panel"
        id={panelId}
        role="group"
        aria-label={label}
        hidden={!open}
        onkeydown={onPanelKeydown}
        onclick={onPanelClick}
    >
        {#if children}
            {@render children(api)}
        {/if}
    </div>
</div>
