import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  input,
  model,
  viewChild,
} from "@angular/core";

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

/**
 * ContentsNav — a navigation landmark for a table of contents.
 *
 * With `spy` it also marks the link of the section currently in view
 * (`aria-current` and `data-active`): the links are the consumer's own
 * `<a href="#id">` elements projected into the nav. See the component's
 * `index.md` for the rules (activation line, bottom of page, click lock).
 */
@Component({
  selector: "lily-contents-nav",
  standalone: true,
  template: `<nav #navEl class="contents-nav {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></nav>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentsNav {
  readonly label = input<string>("");
  readonly className = input<string>("");
  /** Scrollspy: mark the link of the section currently in view. */
  readonly spy = input<boolean>(false);
  /** Activation line, px below the top of `root`; set to a fixed header's height. */
  readonly offset = input<number>(0);
  /** A scrolling element other than the viewport. */
  readonly root = input<HTMLElement | null>(null);
  /** The aria-current token set on the active link. */
  readonly current = input<string>("true");
  /** The id of the section currently in view (spy only). Two-way bindable: `[(active)]`. */
  readonly active = model<string>("");

  private readonly navEl = viewChild<ElementRef<HTMLElement>>("navEl");

  constructor() {
    effect((onCleanup) => {
      const nav = this.navEl()?.nativeElement;
      if (!this.spy() || !nav) return;
      const stop = startScrollspy(nav, {
        offset: this.offset(),
        root: this.root(),
        current: this.current(),
        onChange: (id) => this.active.set(id),
      });
      onCleanup(stop);
    });
  }
}
