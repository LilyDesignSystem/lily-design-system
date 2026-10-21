/**
 * Cursor movement for grid-like helpers (data grid, kanban board, Gantt chart): the arrows, Home / End (with Ctrl or Cmd for the
 * corners), PageUp / PageDown, and the right-to-left swap of ArrowLeft and ArrowRight. Pure, so it is unit-tested without a browser
 * and one place fixes it for every helper. What a helper does on its own keys (Enter, F2, Alt+Arrow, a shortcut letter) stays in the
 * helper: this returns the new position for a movement key and `null` for any other key.
 */
import { logicalKey } from "./direction";

export type GridPosition = { row: number; col: number };

export type GridNavigation = {
    /** The first row the cursor may stand on: -1 where the header row is part of the grid, else 0. */
    firstRow: number;
    /** The last row index (`rowCount - 1`). */
    lastRow: number;
    /** The last column index. */
    lastCol: number;
    /** How many rows PageUp and PageDown move. */
    pageStep: number;
    /** What plain Home and End do: `"row"` (default) goes to the first or last column of the row; `"column"` to the first or last row of the column. */
    homeEnd?: "row" | "column";
    /** Right-to-left layout: ArrowLeft goes forward, ArrowRight back. */
    rtl?: boolean;
};

/** How many rows a page key moves: the rows that fit a virtualized viewport, else `fallback` (10 by default). */
export function pageStepFor(virtualize: { height: number; rowHeight: number } | undefined, fallback = 10): number {
    return virtualize ? Math.max(1, Math.floor(virtualize.height / virtualize.rowHeight)) : fallback;
}

const clamp = (value: number, low: number, high: number): number => Math.min(Math.max(value, low), high);

/** The position the key moves to, kept inside the grid, or `null` when the key is not a movement key. */
export function gridMove(
    event: { key: string; ctrlKey?: boolean; metaKey?: boolean },
    at: GridPosition,
    nav: GridNavigation,
): GridPosition | null {
    const key = logicalKey(event.key, nav.rtl ?? false);
    const corner = !!(event.ctrlKey || event.metaKey);
    let row = at.row;
    let col = at.col;
    switch (key) {
        case "ArrowRight":
            col += 1;
            break;
        case "ArrowLeft":
            col -= 1;
            break;
        case "ArrowDown":
            row += 1;
            break;
        case "ArrowUp":
            row -= 1;
            break;
        case "PageDown":
            row += nav.pageStep;
            break;
        case "PageUp":
            row -= nav.pageStep;
            break;
        case "Home":
            if (corner) [row, col] = [nav.firstRow, 0];
            else if (nav.homeEnd === "column") row = nav.firstRow;
            else col = 0;
            break;
        case "End":
            if (corner) [row, col] = [nav.lastRow, nav.lastCol];
            else if (nav.homeEnd === "column") row = nav.lastRow;
            else col = nav.lastCol;
            break;
        default:
            return null;
    }
    return { row: clamp(row, nav.firstRow, nav.lastRow), col: clamp(col, 0, nav.lastCol) };
}
