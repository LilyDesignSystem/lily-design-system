// ContentsNav component
//
// A headless navigation landmark for a table of contents. Renders a semantic
// <nav> element with an accessible label. Designed to wrap a ContentsList and
// ContentsListItem children. Commonly used at the top of documentation pages,
// articles, or forms with multiple sections.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the navigation landmark (e.g., "Contents").
//   children — ReactNode, required. Typically a ContentsList component.
//   spy — boolean, default false. Scrollspy: mark the link of the section currently in view.
//   offset — number, default 0. Activation line, px below the top of root (a fixed header's height).
//   root — HTMLElement | null, default null (the viewport). A scrolling element other than the viewport.
//   current — string, default "true". The aria-current token set on the active link.
//   onActiveChange — (id: string) => void, optional. Called once per change, with the section id.
//   ...restProps — additional HTML attributes spread onto the <nav>.
//
// Syntax:
//   <ContentsNav label="Contents">
//     <ContentsList>
//       <ContentsListItem><a href="#section">Section</a></ContentsListItem>
//     </ContentsList>
//   </ContentsNav>
//
// Examples:
//   
//   <ContentsNav label="On this page">
//     <ContentsList>
//       <ContentsListItem><a href="#introduction">Introduction</a></ContentsListItem>
//       <ContentsListItem><a href="#usage">Usage</a></ContentsListItem>
//       <ContentsListItem><a href="#examples">Examples</a></ContentsListItem>
//     </ContentsList>
//   </ContentsNav>
//
// Scrollspy (spy): the links are the consumer's own <a href="#id"> elements inside the nav. The active
//   section is the last one whose top has passed the activation line; at the bottom of the scroll range
//   the last section is active; before the first section, the first. The active link gets
//   aria-current={current} and data-active; its ancestor <li>s get data-descendant-active. A click makes
//   its link active at once and holds it until the scroll settles. Lily never animates or moves focus.
//
// Keyboard:
//   - None — passive navigation container; keyboard navigation handled by anchor links within items
//
// Accessibility:
//   - aria-label on <nav> provides an accessible name, distinguishing it from other nav regions
//
// Internationalization:
//   - The label prop provides the accessible name; no hardcoded strings
//   - All link text is provided by consumers through children
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Compound component: parent container for ContentsList and ContentsListItem children
//
// References:
//   - WAI-ARIA Navigation Landmark: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
//   - MDN nav element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav

import React from "react";

export interface ContentsNavProps {
    className?: string;
    /** Accessible label */
    label?: string;
    /** The component content */
    children?: React.ReactNode;
    /** Scrollspy: mark the link of the section currently in view. */
    spy?: boolean;
    /** Activation line, px below the top of `root`; set to a fixed header's height. */
    offset?: number;
    /** A scrolling element other than the viewport. */
    root?: HTMLElement | null;
    /** The aria-current token set on the active link. */
    current?: string;
    /** Called once per change, with the section id. */
    onActiveChange?: (id: string) => void;
    [key: string]: unknown;
}

// ---------------------------------------------------------------------
// Scrollspy (the `spy` option). Framework-free; the component calls
// `startScrollspy` in its mount lifecycle and the returned function on unmount.
// ---------------------------------------------------------------------

/**
 * Which section is current: the last whose top has passed the activation line
 * (`tops` are each section's top relative to the scroller; `offset` is the line).
 * At the bottom of the scroll range the last section wins (a short last section
 * never reaches the line); before the first section, the first.
 */
export function activeSectionIndex(tops: number[], offset: number, atBottom: boolean): number {
    if (tops.length === 0) return -1;
    if (atBottom) return tops.length - 1;
    let index = 0;
    for (let i = 0; i < tops.length; i++) {
        if (tops[i] <= offset + 1) index = i;
    }
    return index;
}

/** The in-page `<a href="#id">` links inside `nav`. */
export function contentsLinks(nav: Element): HTMLAnchorElement[] {
    return Array.from(nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')).filter(
        (a) => a.getAttribute("href")!.length > 1,
    );
}

export function contentsLinkId(link: Element): string {
    return decodeURIComponent((link.getAttribute("href") ?? "").slice(1));
}

export function contentsTarget(link: Element, doc: Document): HTMLElement | null {
    return doc.getElementById(contentsLinkId(link));
}

export type ScrollspyOptions = {
    /** Activation line, px below the top of `root`. */
    offset?: number;
    /** A scrolling element other than the viewport. */
    root?: HTMLElement | null;
    /** The `aria-current` token set on the active link. */
    current?: string;
    /** Called once per change, with the section id. */
    onChange?: (id: string) => void;
};

/**
 * Mark the link of the section in view with `aria-current` and `data-active`
 * (and its enclosing `<li>`s with `data-descendant-active`). Returns a function
 * that stops listening.
 */
export function startScrollspy(nav: HTMLElement, options: ScrollspyOptions = {}): () => void {
    if (typeof window === "undefined") return () => {};
    const offset = options.offset ?? 0;
    const spyRoot = options.root ?? null;
    const token = options.current ?? "true";
    const scroller: Window | HTMLElement = spyRoot ?? window;
    let locked = false;
    let lockTimer: ReturnType<typeof setTimeout> | undefined;
    let frame = 0;
    let last = "";
    // Until the reader first scrolls, the URL hash decides (links may render after mount).
    let hashPending = false;

    function mark(link: HTMLAnchorElement | undefined): void {
        for (const a of contentsLinks(nav)) {
            if (a === link) {
                a.setAttribute("aria-current", token);
                a.setAttribute("data-active", "");
            } else {
                a.removeAttribute("aria-current");
                a.removeAttribute("data-active");
            }
        }
        for (const li of nav.querySelectorAll("li")) {
            if (link && li.contains(link) && li.querySelector(":scope > a") !== link) {
                li.setAttribute("data-descendant-active", "");
            } else {
                li.removeAttribute("data-descendant-active");
            }
        }
        const id = link ? contentsLinkId(link) : "";
        if (id !== last) {
            last = id;
            if (id) options.onChange?.(id);
        }
    }

    function update(): void {
        if (locked) return;
        if (hashPending) {
            const id = decodeURIComponent(window.location.hash.slice(1));
            const hashed = id ? contentsLinks(nav!).find((a) => contentsLinkId(a) === id) : undefined;
            if (hashed) {
                mark(hashed);
                return;
            }
        }
        const pairs = contentsLinks(nav)
            .map((a) => ({ a, el: contentsTarget(a, nav.ownerDocument) }))
            .filter((p): p is { a: HTMLAnchorElement; el: HTMLElement } => p.el !== null);
        if (pairs.length === 0) {
            mark(undefined);
            return;
        }
        const base = spyRoot ? spyRoot.getBoundingClientRect().top : 0;
        const tops = pairs.map((p) => p.el.getBoundingClientRect().top - base);
        const atBottom = spyRoot
            ? spyRoot.scrollTop + spyRoot.clientHeight >= spyRoot.scrollHeight - 1
            : window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1;
        mark(pairs[activeSectionIndex(tops, offset, atBottom)].a);
    }

    function schedule(): void {
        if (frame) return;
        frame = requestAnimationFrame(() => {
            frame = 0;
            update();
        });
    }

    function onScroll(): void {
        hashPending = false;
        schedule();
    }

    function release(): void {
        locked = false;
        if (lockTimer) clearTimeout(lockTimer);
        update();
    }

    function onClick(event: Event): void {
        const link = (event.target as Element | null)?.closest?.("a");
        if (!link || !nav.contains(link) || !contentsTarget(link, nav.ownerDocument)) return;
        // The link is current at once; updates wait until the scroll settles.
        mark(link as HTMLAnchorElement);
        locked = true;
        if (lockTimer) clearTimeout(lockTimer);
        lockTimer = setTimeout(release, 1000);
    }

    function onHashChange(): void {
        const id = decodeURIComponent(window.location.hash.slice(1));
        const link = contentsLinks(nav).find((a) => contentsLinkId(a) === id);
        if (link) mark(link);
    }

    scroller.addEventListener("scroll", onScroll, { passive: true });
    scroller.addEventListener("scrollend", release);
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", onHashChange);
    nav.addEventListener("click", onClick);
    // Links rendered or re-pointed after mount (a list built from data) are picked up too.
    const mutations = typeof MutationObserver === "undefined" ? null : new MutationObserver(schedule);
    mutations?.observe(nav, { childList: true, subtree: true, attributes: true, attributeFilter: ["href"] });

    // The URL hash wins on load; otherwise the position decides.
    const initial = decodeURIComponent(window.location.hash.slice(1));
    hashPending = initial !== "";
    const hashLink = initial ? contentsLinks(nav).find((a) => contentsLinkId(a) === initial) : undefined;
    if (hashLink) mark(hashLink);
    else update();

    return () => {
        scroller.removeEventListener("scroll", onScroll);
        scroller.removeEventListener("scrollend", release);
        window.removeEventListener("resize", schedule);
        window.removeEventListener("hashchange", onHashChange);
        nav.removeEventListener("click", onClick);
        mutations?.disconnect();
        if (frame) cancelAnimationFrame(frame);
        if (lockTimer) clearTimeout(lockTimer);
    };
}

export default function ContentsNav({
    className = "",
    label,
    children,
    spy = false,
    offset = 0,
    root = null,
    current = "true",
    onActiveChange,
    ...restProps
}: ContentsNavProps) {
    const navRef = React.useRef<HTMLElement | null>(null);
    // The callback may change on every render; the spy must not restart for it.
    const onChangeRef = React.useRef(onActiveChange);
    onChangeRef.current = onActiveChange;

    React.useEffect(() => {
        if (!spy || !navRef.current) return;
        return startScrollspy(navRef.current, {
            offset,
            root,
            current,
            onChange: (id) => onChangeRef.current?.(id),
        });
    }, [spy, offset, root, current]);

    return (
        <nav
        ref={navRef}
        className={`contents-nav ${className}`}
        aria-label={label}
        {...restProps}
        >
        {children}
        </nav>
    );
}
