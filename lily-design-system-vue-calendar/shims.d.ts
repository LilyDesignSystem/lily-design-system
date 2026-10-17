// Local-only ambient module declarations for the two sibling packages this
// one composes: @lilydesignsystem/vue-headless (CalendarTable family) and
// @lilydesignsystem/vue-date-time-picker (civil-date arithmetic). See
// lily-design-system-vue-picker-bar/shims.d.ts for the full story: loading
// more than one generated `.vue.d.ts` shim into one vue-tsc program produces
// TS6200 duplicate-global conflicts, so these loose declarations replace the
// real generated shims for this package's own type-checking pass. The runtime
// import is unaffected: dist/index.js still carries the real bare imports
// (see vite.lib.config.ts's `external` list).
//
// Deliberately import-free: any top-level import, even type-only, breaks
// vue-tsc's resolution of the `declare module` blocks below.

declare module "@lilydesignsystem/vue-headless" {
    export const CalendarTable: any;
    export const CalendarTableBody: any;
    export const CalendarTableHead: any;
    export const CalendarTableRow: any;
    export const CalendarTableTD: any;
    export const CalendarTableTH: any;
    export const Mark: any;
    export const SearchInput: any;
}

declare module "@lilydesignsystem/vue-date-time-picker" {
    export type CivilDate = { year: number; month: number; day: number };
    export const addDays: (isoDate: string, days: number) => string;
    export const addMonths: (isoDate: string, months: number) => string;
    export const daysInMonth: (year: number, month: number) => number;
    export const firstDayOfWeekFor: (locale?: string) => number;
    export const formatIsoDate: (date: CivilDate) => string;
    export const isoWeek: (isoDate: string) => number;
    export const monthMatrix: (year: number, month: number, firstDayOfWeek: number) => string[][];
    export const parseIsoDate: (text: string) => CivilDate | null;
    export const weekdayOf: (isoDate: string) => number;
}
