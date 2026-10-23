/**
 * Layout for a year-of-days heatmap (`HeatmapChartWithYearOfDays`): one cell per day of a year, in week columns and weekday rows.
 * Pure and framework-neutral. The component draws nothing; a consumer's drawing code calls this for each cell's position.
 *
 * row(d)    = (weekday(d) − weekStart + 7) mod 7, weekday 0 = Sunday … 6 = Saturday, so row 0 is the weekday `weekStart` names.
 * column(d) = floor((dayOfYear(d) − 1 + row(1 January)) / 7), so column 0 holds 1 January.
 * All dates are calendar dates in UTC, so a time zone or daylight-saving change cannot move a day.
 */

export interface YearOfDaysCell {
    /** ISO calendar date, `YYYY-MM-DD`. */
    date: string;
    /** Zero-based day of the year: 0 is 1 January. */
    dayOfYear: number;
    /** Zero-based week column. */
    column: number;
    /** Zero-based weekday row, 0 to 6. */
    row: number;
}

const DAY = 86_400_000;

function assertYear(year: number): void {
    if (!Number.isInteger(year) || year < 1 || year > 9999) throw new RangeError(`year must be an integer from 1 to 9999: ${year}`);
}

function assertWeekStart(weekStart: number): void {
    if (!Number.isInteger(weekStart) || weekStart < 0 || weekStart > 6) throw new RangeError(`weekStart must be an integer from 0 to 6: ${weekStart}`);
}

function startOfYear(year: number): Date {
    const d = new Date(Date.UTC(2000, 0, 1));
    d.setUTCFullYear(year); // Date.UTC treats years 0-99 as 1900-1999
    return d;
}

/** Days in `year`: 365, or 366 in a leap year. */
export function daysInYear(year: number): number {
    assertYear(year);
    return (startOfYear(year + 1).getTime() - startOfYear(year).getTime()) / DAY;
}

/** Number of week columns for `year` when weeks start on `weekStart`: 53 or 54. */
export function columnCount(year: number, weekStart: number): number {
    assertYear(year);
    assertWeekStart(weekStart);
    const firstRow = (startOfYear(year).getUTCDay() - weekStart + 7) % 7;
    return Math.floor((daysInYear(year) - 1 + firstRow) / 7) + 1;
}

/** Every day of `year` with its column and row, in date order. */
export function yearOfDaysCells(year: number, weekStart: number): YearOfDaysCell[] {
    assertYear(year);
    assertWeekStart(weekStart);
    const first = startOfYear(year);
    const firstRow = (first.getUTCDay() - weekStart + 7) % 7;
    const cells: YearOfDaysCell[] = [];
    for (let i = 0, n = daysInYear(year); i < n; i++) {
        const d = new Date(first.getTime() + i * DAY);
        cells.push({
            date: d.toISOString().slice(0, 10).padStart(10, "0"),
            dayOfYear: i,
            column: Math.floor((i + firstRow) / 7),
            row: (d.getUTCDay() - weekStart + 7) % 7,
        });
    }
    return cells;
}
