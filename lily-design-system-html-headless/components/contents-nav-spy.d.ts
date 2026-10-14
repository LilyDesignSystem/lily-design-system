/**
 * Which section is current: the last whose top has passed the activation line
 * (`tops` are each section's top relative to the scroller; `offset` is the line).
 * At the bottom of the scroll range the last section wins (a short last section
 * never reaches the line); before the first section, the first.
 */
export declare function activeSectionIndex(tops: number[], offset: number, atBottom: boolean): number;
/** The in-page `<a href="#id">` links inside `nav`. */
export declare function contentsLinks(nav: Element): HTMLAnchorElement[];
export declare function contentsLinkId(link: Element): string;
export declare function contentsTarget(link: Element, doc: Document): HTMLElement | null;
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
export declare function startScrollspy(nav: HTMLElement, options?: ScrollspyOptions): () => void;
