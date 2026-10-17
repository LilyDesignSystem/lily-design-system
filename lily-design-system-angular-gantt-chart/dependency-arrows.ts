/**
 * Geometry for the dependency-arrow overlay: pure, so it is unit-tested without a browser.
 * A box is a task bar's span in the chart's own coordinates (the cells that hold it).
 */
export type ArrowBox = { left: number; right: number; top: number; bottom: number };
export type DependencyKind = "e2s" | "s2s" | "s2e" | "e2e";

/** How far an arrow runs clear of a bar before turning, in px. */
export const ARROW_GAP = 8;

const midY = (box: ArrowBox) => (box.top + box.bottom) / 2;

/**
 * An orthogonal path from the predecessor's bar to the successor's. The kind names the edges joined:
 * `e2s` the predecessor's end to the successor's start, `s2s` start to start, `s2e` start to end,
 * `e2e` end to end. The arrow always arrives horizontally, so the arrowhead points into the bar.
 */
export function dependencyPath(kind: DependencyKind, from: ArrowBox, to: ArrowBox, gap: number = ARROW_GAP): string {
    const fromEnd = kind === "e2s" || kind === "e2e";
    const toStart = kind === "e2s" || kind === "s2s";
    const sx = fromEnd ? from.right : from.left;
    const tx = toStart ? to.left : to.right;
    const sy = midY(from);
    const ty = midY(to);
    const x1 = fromEnd ? sx + gap : sx - gap;
    const x2 = toStart ? tx - gap : tx + gap;
    const direct = fromEnd === toStart ? (fromEnd ? x1 <= x2 : x1 >= x2) : false;
    if (direct) return `M${sx} ${sy}H${x1}V${ty}H${tx}`;
    if (sy === ty) return `M${sx} ${sy}H${tx}`;
    const ym = ty > sy ? to.top - 1 : to.bottom + 1;
    return `M${sx} ${sy}H${x1}V${ym}H${x2}V${ty}H${tx}`;
}

/** The weekday (0 = Sunday … 6 = Saturday) of an ISO date, from its epoch day. */
export function weekdayOfEpochDay(epochDay: number): number {
    return (((epochDay + 4) % 7) + 7) % 7;
}
