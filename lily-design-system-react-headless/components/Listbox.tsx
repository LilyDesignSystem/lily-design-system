// Listbox component
//
// A headless listbox that presents a list of selectable options using the ARIA
// listbox role with full keyboard navigation. Two navigation models, chosen via
// `navigation`:
//
//   "roving-focus" (default, unchanged since this component's introduction) —
//   real DOM focus moves between child `[role="option"]` elements; arrows wrap
//   at the ends; no typeahead, paging, or activation callback.
//
//   "active-descendant" (added for consumers needing the full WAI-ARIA APG
//   listbox keyboard contract, e.g. an icon-button-triggered picker) — the
//   listbox root itself holds real focus and tracks a virtual cursor via
//   `aria-activedescendant`, mirrored by a controlled/uncontrolled `activeIndex`
//   so the consumer's own option rendering can apply `data-active`/`aria-selected`
//   at that index. Adds `clamp` (vs. wrap), typeahead, PageUp/PageDown paging,
//   and `onActivate`/`onEscape`/`onTabOut` callbacks so the consumer decides
//   what "select" / "cancel" / "leave" actually do.
//
// Props:
//   className — string, optional. CSS class name.
//   baseClass — string, default "listbox". The base class token itself
//     (replaces "listbox" outright, not appended).
//   as — React.ElementType, default "div". Root element tag. A consumer whose
//     spec requires e.g. a <ul> root sets as="ul".
//   label — string, required. Accessible name applied via aria-label.
//   children — ReactNode, required. Option elements (should have role="option" and tabindex="-1").
//   navigation — "roving-focus" | "active-descendant", default "roving-focus".
//   activeIndex — number, optional. Controlled virtual cursor position
//     (active-descendant mode only). -1 means no option is active.
//   defaultActiveIndex — number, default -1. Initial cursor when uncontrolled.
//   onActiveIndexChange — (index: number) => void, optional. Fires on every
//     cursor move (active-descendant mode only).
//   clamp — boolean, default false. Arrow keys clamp at the ends instead of
//     wrapping (active-descendant mode only; roving-focus always wraps).
//   typeahead — boolean, default false. Printable characters move the cursor
//     to the next option whose text starts with the typed buffer, cycling on a
//     repeated character (active-descendant mode only).
//   pageSize — number, default 10. PageUp/PageDown move the cursor by this
//     many options, clamped (active-descendant mode only).
//   onActivate — (index: number) => void, optional. Enter/Space on the active
//     option (active-descendant mode only).
//   onEscape — () => void, optional. Escape pressed (active-descendant mode only).
//   onTabOut — (event: React.KeyboardEvent) => void, optional. Tab pressed,
//     called BEFORE the browser processes the key (not prevented) so the
//     consumer can move focus first — e.g. to the trigger button — before
//     Tab's default action computes the next stop from wherever focus ends up
//     (active-descendant mode only).
//   ref — forwarded to the rendered root element.
//   ...restProps — additional HTML attributes spread onto the root.
//
// Syntax:
//   <Listbox label="Fruits">
//     <div role="option" tabindex="-1">Apple</div>
//   </Listbox>
//
// Examples:
//
//   <Listbox label="Fruits">
//     <div role="option" tabindex="-1">Apple</div>
//     <div role="option" tabindex="-1">Banana</div>
//   </Listbox>
//
//   <!-- active-descendant mode: consumer owns rendering each option's
//        id/aria-selected/data-active from the active index -->
//   <Listbox
//     label="Fruits"
//     navigation="active-descendant"
//     clamp
//     activeIndex={activeIndex}
//     onActiveIndexChange={setActiveIndex}
//     onActivate={(i) => choose(fruits[i])}
//   >
//     {fruits.map((fruit, i) => (
//       <div role="option" id={`fruit-${i}`} aria-selected={i === activeIndex}
//         data-active={i === activeIndex ? "" : undefined}>{fruit}</div>
//     ))}
//   </Listbox>
//
// Keyboard:
//   roving-focus: ArrowDown/ArrowUp move focus and wrap; Home/End jump.
//   active-descendant: ArrowDown/ArrowUp move the cursor (wrap unless `clamp`);
//     Home/End jump; PageUp/PageDown move by `pageSize` (clamped); typeahead
//     when `typeahead` is set; Enter/Space calls `onActivate`; Escape calls
//     `onEscape`; Tab calls `onTabOut` without being prevented.
//
// Accessibility:
//   - role="listbox" identifies the container as a listbox widget
//   - aria-label provides an accessible name describing the listbox purpose
//   - roving-focus: child elements should use role="option" and optionally aria-selected
//   - active-descendant: the root carries aria-activedescendant and tabindex="-1";
//     the consumer's option elements carry the matching id
//
// Internationalization:
//   - The label prop accepts any translated string
//   - All option content comes through the children prop
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - roving-focus (default): arrow keys wrap around at boundaries, consumer
//     handles selection state externally — unchanged from this component's
//     original behaviour, so existing consumers of the default mode see no
//     difference.
//   - active-descendant: opt-in via `navigation="active-descendant"`; every
//     new prop is inert unless that mode is selected.
//
// References:
//   - WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

import React, { useLayoutEffect, useRef, useState } from "react";

// Extends the real DOM attributes interface — rather than a `[key: string]:
// unknown` catch-all — so restProps keep their real types, and so
// React.forwardRef's `Omit<P, "ref">` machinery (which collapses named
// properties on an indexed type) doesn't choke during declaration-file
// generation.
export interface ListboxProps extends React.HTMLAttributes<HTMLElement> {
    /** Base class token, replacing "listbox" outright (not appended). */
    baseClass?: string;
    /** Root element tag. Default "div" (unchanged). */
    as?: React.ElementType;
    /** Accessible label. */
    label: string;
    /** Option elements. */
    children: React.ReactNode;
    /** Navigation/focus model. Default "roving-focus" (unchanged legacy behaviour). */
    navigation?: "roving-focus" | "active-descendant";
    /** Controlled virtual cursor position (active-descendant mode). */
    activeIndex?: number;
    /** Initial cursor when uncontrolled. Default -1. */
    defaultActiveIndex?: number;
    /** Fires on every cursor move (active-descendant mode). */
    onActiveIndexChange?: (index: number) => void;
    /** Arrow keys clamp instead of wrap (active-descendant mode). */
    clamp?: boolean;
    /** Printable-character typeahead (active-descendant mode). */
    typeahead?: boolean;
    /** PageUp/PageDown step size (active-descendant mode). */
    pageSize?: number;
    /** Enter/Space on the active option (active-descendant mode). */
    onActivate?: (index: number) => void;
    /** Escape pressed (active-descendant mode). */
    onEscape?: () => void;
    /** Tab pressed, called before the key is processed (active-descendant mode). */
    onTabOut?: (event: React.KeyboardEvent) => void;
}

const Listbox = React.forwardRef<HTMLElement, ListboxProps>(function Listbox(
    {
        className = "",
        baseClass = "listbox",
        as: Tag = "div",
        label,
        children,
        navigation = "roving-focus",
        activeIndex: controlledActiveIndex,
        defaultActiveIndex = -1,
        onActiveIndexChange,
        clamp = false,
        typeahead = false,
        pageSize = 10,
        onActivate,
        onEscape,
        onTabOut,
        ...restProps
    }: ListboxProps,
    forwardedRef: React.ForwardedRef<HTMLElement>,
) {
    const listRef = useRef<HTMLElement | null>(null);
    const [uncontrolledActiveIndex, setUncontrolledActiveIndex] = useState(defaultActiveIndex);
    const activeIndex = controlledActiveIndex ?? uncontrolledActiveIndex;

    const typeaheadBuffer = useRef("");
    const typeaheadTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    function setRef(node: HTMLElement | null) {
        listRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
    }

    function setActiveIndex(next: number) {
        if (controlledActiveIndex === undefined) setUncontrolledActiveIndex(next);
        onActiveIndexChange?.(next);
    }

    function options(): HTMLElement[] {
        return listRef.current
            ? Array.from(listRef.current.querySelectorAll<HTMLElement>("[role='option']"))
            : [];
    }

    // ---------------------------------------------------------------
    // roving-focus (default, unchanged): real DOM focus per option, wraps.
    // ---------------------------------------------------------------

    function handleRovingFocusKeyDown(event: React.KeyboardEvent) {
        const opts = options();
        const current = document.activeElement as HTMLElement;
        const index = opts.indexOf(current);
        switch (event.key) {
            case "ArrowDown": {
                event.preventDefault();
                const next = index < opts.length - 1 ? index + 1 : 0;
                opts[next]?.focus();
                break;
            }
            case "ArrowUp": {
                event.preventDefault();
                const prev = index > 0 ? index - 1 : opts.length - 1;
                opts[prev]?.focus();
                break;
            }
            case "Home": {
                event.preventDefault();
                opts[0]?.focus();
                break;
            }
            case "End": {
                event.preventDefault();
                opts[opts.length - 1]?.focus();
                break;
            }
        }
    }

    // ---------------------------------------------------------------
    // active-descendant (opt-in): virtual cursor, clamp/wrap, typeahead, paging.
    // ---------------------------------------------------------------

    function moveActive(delta: number) {
        const count = options().length;
        if (count === 0) return;
        const next = activeIndex + delta;
        setActiveIndex(clamp ? Math.min(Math.max(next, 0), count - 1) : ((next % count) + count) % count);
    }

    function runTypeahead(char: string) {
        const opts = options();
        if (opts.length === 0) return;
        const lower = char.toLowerCase();
        const buffer = typeaheadBuffer.current;
        const sameCharRun = buffer === "" || [...buffer].every((c) => c === lower);
        typeaheadBuffer.current += lower;
        clearTimeout(typeaheadTimer.current);
        typeaheadTimer.current = setTimeout(() => (typeaheadBuffer.current = ""), 500);
        const query = sameCharRun ? lower : typeaheadBuffer.current;
        const anchor = activeIndex < 0 ? 0 : activeIndex;
        const start = sameCharRun ? anchor + 1 : anchor;
        for (let n = 0; n < opts.length; n++) {
            const i = (start + n) % opts.length;
            if ((opts[i].textContent ?? "").trim().toLowerCase().startsWith(query)) {
                setActiveIndex(i);
                return;
            }
        }
    }

    function handleActiveDescendantKeyDown(event: React.KeyboardEvent) {
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
                setActiveIndex(options().length ? 0 : -1);
                break;
            case "End":
                event.preventDefault();
                setActiveIndex(options().length - 1);
                break;
            case "PageDown":
                event.preventDefault();
                moveActive(pageSize);
                break;
            case "PageUp":
                event.preventDefault();
                moveActive(-pageSize);
                break;
            case "Enter":
            case " ":
                event.preventDefault();
                if (activeIndex >= 0) onActivate?.(activeIndex);
                break;
            case "Escape":
                event.preventDefault();
                onEscape?.();
                break;
            case "Tab":
                // Not prevented: the consumer's onTabOut (e.g. moving focus to
                // a trigger button) runs first, so the browser's default Tab
                // proceeds from wherever focus ends up, not from this element.
                onTabOut?.(event);
                break;
            default:
                if (typeahead && event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
                    runTypeahead(event.key);
                }
        }
    }

    function handleKeyDown(event: React.KeyboardEvent) {
        if (navigation === "active-descendant") handleActiveDescendantKeyDown(event);
        else handleRovingFocusKeyDown(event);
    }

    // Computed via effect, not during render: on the very first render the
    // ref hasn't attached yet, so a DOM query for the option at activeIndex
    // would always miss when a caller opens the list with activeIndex
    // already non-negative (e.g. resuming on the previously selected item).
    const [activeId, setActiveId] = useState<string | undefined>(undefined);
    useLayoutEffect(() => {
        if (navigation !== "active-descendant" || activeIndex < 0) {
            setActiveId(undefined);
            return;
        }
        setActiveId(options()[activeIndex]?.id || undefined);
    });

    return (
        <Tag
        className={`${baseClass} ${className}`}
        role="listbox"
        aria-label={label}
        tabIndex={navigation === "active-descendant" ? -1 : undefined}
        aria-activedescendant={activeId}
        ref={setRef}
        onKeyDown={handleKeyDown}
        {...restProps}
        >
        {children}
        </Tag>
    );
});

export default Listbox;
