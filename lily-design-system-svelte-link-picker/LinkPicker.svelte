<script lang="ts" module>
    import type { Snippet } from "svelte";
    import { IconButton } from "@lilydesignsystem/svelte-headless";
    // Only the trigger button composes a headless primitive. The list is
    // real `<a>` navigation with a roving-focus pattern of its own — not an
    // ARIA listbox or menu: role="menuitem" would strip middle-click,
    // open-in-new-tab and copy-link-address from what are ordinary links.
    // A disclosure of real links, like share-picker's. See spec/index.md §3.

    /**
     * One destination in the list. The app defines them all: this package
     * ships no routes and no English — `label` is the consumer's text.
     */
    export type LinkItem = {
        /** Stable identifier, passed back to `onNavigate`. Defaults to `href`. */
        id?: string;
        /** Visible link text. Consumer-supplied, so it localises. */
        label: string;
        /** Where the link goes: a route ("/about/") or a full URL. */
        href: string;
        /** Marks this link as the current page (`aria-current="page"`). */
        current?: boolean;
        /** Open in a new tab (adds `target="_blank"` and `rel="noopener noreferrer"`). */
        newTab?: boolean;
    };

    /** Arguments passed to a custom `children` snippet (the button icon). */
    export type ChildArgs = {
        /** Is the list open? */
        open: boolean;
    };

    /** Public props for LinkPicker. See `spec/index.md` §4 for the contract. */
    export type Props = {
        /** Accessible name for the button and the list. */
        label: string;
        /** The page links to offer. Defined by the app. */
        links: LinkItem[];
        /**
         * Client-side navigation hook, e.g. SvelteKit's `goto`. When given,
         * a plain left click on a link calls `navigate(href)` instead of
         * letting the browser load the page; modified clicks (Ctrl/Cmd/
         * Shift/Alt, middle button) and `newTab` links stay native.
         */
        navigate?: (href: string) => void;
        /** Replaces the default home icon inside the button. */
        children?: Snippet<[ChildArgs]>;
        /** Fires after a link is chosen, with its id and href. */
        onNavigate?: (id: string, href: string) => void;
        /** Extra CSS class on the root. */
        class?: string;
        /** Spread props onto the root element. */
        [key: string]: unknown;
    };

    /** The id a link reports: its explicit `id`, else its `href`. */
    export function linkId(link: LinkItem): string {
        return link.id ?? link.href;
    }

    let uid = 0;
    /** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
    export function nextLinkPickerId(): string {
        uid += 1;
        return `link-picker-${uid}`;
    }
</script>

<script lang="ts">
    let {
        class: className = "",
        label,
        links,
        navigate,
        children,
        onNavigate,
        ...restProps
    }: Props = $props();

    const baseId = nextLinkPickerId();
    const listId = `${baseId}-list`;
    const tooltipId = `${baseId}-tooltip`;

    let open = $state(false);

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

    let buttonEl: HTMLButtonElement | undefined = $state();
    let listEl: HTMLUListElement | undefined = $state();
    let rootEl: HTMLDivElement | undefined = $state();

    function onButtonFocus(): void {
        // Keyboard focus only: a mouse click also focuses the button in
        // Chromium, and the tooltip should not stick after a click.
        try {
            focusButton = buttonEl?.matches(":focus-visible") ?? false;
        } catch {
            focusButton = true; // engine without :focus-visible — err towards showing
        }
    }

    /** Every focusable link in the list, in DOM order. */
    function items(): HTMLElement[] {
        if (!listEl) return [];
        return Array.from(listEl.querySelectorAll<HTMLElement>(".link-picker-link"));
    }

    function openList(focusLast = false): void {
        open = true;
        // preventScroll: the list is positioned by CSS, and an automatic
        // scroll-into-view on focus would slide the page sideways when the
        // button sits near an edge.
        queueMicrotask(() => {
            const all = items();
            (focusLast ? all[all.length - 1] : all[0])?.focus({ preventScroll: true });
        });
    }

    function closeList(refocus = true): void {
        if (!open) return;
        open = false;
        if (refocus) queueMicrotask(() => buttonEl?.focus({ preventScroll: true }));
    }

    function onButtonClick(): void {
        hoverButton = false;
        if (open) closeList();
        else openList();
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
        // Enter and Space are the button's own activation keys and already
        // produce a click; only the arrows need handling here.
        if (event.key === "ArrowDown") {
            event.preventDefault();
            if (!open) openList();
            else items()[0]?.focus({ preventScroll: true });
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (!open) openList(true);
            else items()[items().length - 1]?.focus({ preventScroll: true });
        }
    }

    function moveFocus(delta: number): void {
        const all = items();
        if (all.length === 0) return;
        const i = all.indexOf(document.activeElement as HTMLElement);
        const next = Math.min(Math.max((i < 0 ? 0 : i) + delta, 0), all.length - 1);
        all[next]?.focus({ preventScroll: true });
    }

    function onListKeydown(event: KeyboardEvent): void {
        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                moveFocus(1);
                break;
            case "ArrowUp":
                event.preventDefault();
                moveFocus(-1);
                break;
            case "Home":
                event.preventDefault();
                items()[0]?.focus({ preventScroll: true });
                break;
            case "End": {
                event.preventDefault();
                const all = items();
                all[all.length - 1]?.focus({ preventScroll: true });
                break;
            }
            case "Escape":
                event.preventDefault();
                closeList();
                break;
            case "Tab":
                // Tab leaves the control — but focus goes to the button
                // FIRST, without cancelling the key. Hiding the list while
                // one of its links has focus drops focus to <body>, and the
                // browser would then compute the default Tab move from the
                // top of the document.
                buttonEl?.focus?.({ preventScroll: true });
                closeList(false);
                break;
        }
    }

    function onRootFocusOut(event: FocusEvent): void {
        const next = event.relatedTarget as Node | null;
        if (next && rootEl?.contains(next)) return;
        closeList(false);
    }

    function onLinkClick(event: MouseEvent, link: LinkItem): void {
        onNavigate?.(linkId(link), link.href);
        const modified = event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0;
        if (navigate && !link.newTab && !modified && !event.defaultPrevented) {
            event.preventDefault();
            navigate(link.href);
        }
        closeList();
    }
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
    class={`link-picker ${className}`.trim()}
    onfocusout={onRootFocusOut}
    {...restProps}
>
    <IconButton
        bind:ref={buttonEl}
        baseClass="link-picker-button"
        label={label}
        aria-expanded={open}
        aria-controls={listId}
        onclick={onButtonClick}
        onkeydown={onButtonKeydown}
        onmouseenter={() => { hoverButton = true; dismissed = false; }}
        onmouseleave={() => { hoverButton = false; }}
        onfocus={onButtonFocus}
        onblur={() => { focusButton = false; dismissed = false; }}
    >
        {#if children}
            {@render children({ open })}
        {:else}
            <svg
                class="link-picker-icon"
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
                <path d="M1 8 8 1.5l7 6.5" />
                <path d="M2.5 7v7.5h11V7" />
                <path d="M6.5 14.5v-4h3v4" />
            </svg>
        {/if}
    </IconButton>

    <!-- Purely visual: the same text is already the button's aria-label,
         so it is not wired with aria-describedby (that would announce the
         name twice). -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="link-picker-tooltip"
        role="tooltip"
        id={tooltipId}
        hidden={!tooltipVisible}
        onmouseenter={() => { hoverTooltip = true; }}
        onmouseleave={() => { hoverTooltip = false; }}
    >{label}</div>

    <!-- Named like the sibling pickers' popups: a screen reader entering
         the list hears what it is for. The keydown handler is pure
         delegation for the focusable links inside; the list itself is not
         interactive and takes no focus. -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <ul
        bind:this={listEl}
        class="link-picker-list"
        id={listId}
        aria-label={label}
        hidden={!open}
        onkeydown={onListKeydown}
    >
        {#each links as link (linkId(link))}
            <li class="link-picker-list-item">
                <!-- A real link, not role="menuitem": these ARE navigation. -->
                <a
                    class="link-picker-link"
                    data-link-id={linkId(link)}
                    href={link.href}
                    aria-current={link.current ? "page" : undefined}
                    target={link.newTab ? "_blank" : undefined}
                    rel={link.newTab ? "noopener noreferrer" : undefined}
                    onclick={(event) => onLinkClick(event, link)}
                >
                    {link.label}
                </a>
            </li>
        {/each}
    </ul>
</div>
