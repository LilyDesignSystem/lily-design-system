/**
 * Reading direction for keyboard navigation. A grid's left and right arrow keys are *visual*: in a right-to-left layout the next
 * cell is on the left, so ArrowLeft must move forward. Pure apart from reading the DOM, so it is unit-tested with a jsdom element.
 */

/** Whether the text around `element` runs right to left: the nearest `dir` attribute wins, then the computed `direction`. */
export function isRtl(element: Element | null | undefined): boolean {
    if (!element) return false;
    const attr = element.closest("[dir]")?.getAttribute("dir")?.toLowerCase();
    if (attr === "rtl") return true;
    if (attr === "ltr") return false;
    if (typeof getComputedStyle === "function") return getComputedStyle(element).direction === "rtl";
    return false;
}

/**
 * The key to act on after reading direction into account: in RTL, ArrowLeft and ArrowRight swap. Everything else is unchanged.
 * Callers pass the result to the same `switch` they always used.
 */
export function logicalKey(key: string, rtl: boolean): string {
    if (!rtl) return key;
    if (key === "ArrowLeft") return "ArrowRight";
    if (key === "ArrowRight") return "ArrowLeft";
    return key;
}
