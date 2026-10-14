/**
 * contents-nav-spy — scrollspy for `contents-nav.html`.
 *
 * `contents-nav.html` is a static snippet; this plain ES module (no
 * dependencies, no bundler) adds the optional scrollspy behaviour to the
 * `<nav class="contents-nav">` once it is in the page:
 *
 *   import { startScrollspy } from "@lilydesignsystem/html-headless/components/contents-nav-spy.js";
 *   const stop = startScrollspy(document.querySelector(".contents-nav"), { offset: 64 });
 *
 * The links are the consumer's own `<a href="#id">` elements inside the nav.
 * The active section is the last one whose top has passed the activation line
 * (`offset` px below the top of `root`); at the bottom of the scroll range the
 * last section is active; before the first section, the first. The active link
 * gets `aria-current` (default "true") and `data-active`; its ancestor `<li>`s
 * get `data-descendant-active`. A click makes its link active at once and holds
 * it until the scroll settles. Nothing here animates scrolling, moves focus or
 * touches the URL. See `components/contents-nav/index.md`.
 */
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
export function activeSectionIndex(tops, offset, atBottom) {
    if (tops.length === 0)
        return -1;
    if (atBottom)
        return tops.length - 1;
    let index = 0;
    for (let i = 0; i < tops.length; i++) {
        if (tops[i] <= offset + 1)
            index = i;
    }
    return index;
}
/** The in-page `<a href="#id">` links inside `nav`. */
export function contentsLinks(nav) {
    return Array.from(nav.querySelectorAll('a[href^="#"]')).filter((a) => a.getAttribute("href").length > 1);
}
export function contentsLinkId(link) {
    return decodeURIComponent((link.getAttribute("href") ?? "").slice(1));
}
export function contentsTarget(link, doc) {
    return doc.getElementById(contentsLinkId(link));
}
/**
 * Mark the link of the section in view with `aria-current` and `data-active`
 * (and its enclosing `<li>`s with `data-descendant-active`). Returns a function
 * that stops listening.
 */
export function startScrollspy(nav, options = {}) {
    if (typeof window === "undefined")
        return () => { };
    const offset = options.offset ?? 0;
    const spyRoot = options.root ?? null;
    const token = options.current ?? "true";
    const scroller = spyRoot ?? window;
    let locked = false;
    let lockTimer;
    let frame = 0;
    let last = "";
    // Until the reader first scrolls, the URL hash decides (links may render after mount).
    let hashPending = false;
    function mark(link) {
        for (const a of contentsLinks(nav)) {
            if (a === link) {
                a.setAttribute("aria-current", token);
                a.setAttribute("data-active", "");
            }
            else {
                a.removeAttribute("aria-current");
                a.removeAttribute("data-active");
            }
        }
        for (const li of nav.querySelectorAll("li")) {
            if (link && li.contains(link) && li.querySelector(":scope > a") !== link) {
                li.setAttribute("data-descendant-active", "");
            }
            else {
                li.removeAttribute("data-descendant-active");
            }
        }
        const id = link ? contentsLinkId(link) : "";
        if (id !== last) {
            last = id;
            if (id)
                options.onChange?.(id);
        }
    }
    function update() {
        if (locked)
            return;
        if (hashPending) {
            const id = decodeURIComponent(window.location.hash.slice(1));
            const hashed = id ? contentsLinks(nav).find((a) => contentsLinkId(a) === id) : undefined;
            if (hashed) {
                mark(hashed);
                return;
            }
        }
        const pairs = contentsLinks(nav)
            .map((a) => ({ a, el: contentsTarget(a, nav.ownerDocument) }))
            .filter((p) => p.el !== null);
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
    function schedule() {
        if (frame)
            return;
        frame = requestAnimationFrame(() => {
            frame = 0;
            update();
        });
    }
    function onScroll() {
        hashPending = false;
        schedule();
    }
    function release() {
        locked = false;
        if (lockTimer)
            clearTimeout(lockTimer);
        update();
    }
    function onClick(event) {
        const link = event.target?.closest?.("a");
        if (!link || !nav.contains(link) || !contentsTarget(link, nav.ownerDocument))
            return;
        // The link is current at once; updates wait until the scroll settles.
        mark(link);
        locked = true;
        if (lockTimer)
            clearTimeout(lockTimer);
        lockTimer = setTimeout(release, 1000);
    }
    function onHashChange() {
        const id = decodeURIComponent(window.location.hash.slice(1));
        const link = contentsLinks(nav).find((a) => contentsLinkId(a) === id);
        if (link)
            mark(link);
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
    if (hashLink)
        mark(hashLink);
    else
        update();
    return () => {
        scroller.removeEventListener("scroll", onScroll);
        scroller.removeEventListener("scrollend", release);
        window.removeEventListener("resize", schedule);
        window.removeEventListener("hashchange", onHashChange);
        nav.removeEventListener("click", onClick);
        mutations?.disconnect();
        if (frame)
            cancelAnimationFrame(frame);
        if (lockTimer)
            clearTimeout(lockTimer);
    };
}
