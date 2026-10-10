// Local-only ambient module declarations for the two sibling packages
// this one composes: @lilydesignsystem/vue-headless (GanttTable
// family, structural) and @lilydesignsystem/vue-date-time-picker (the
// keyboard-accessible edit surface, composed twice per edit session —
// start date, end date). See lily-design-system-vue-picker-bar/shims.d.ts
// for the full story: loading more than one generated `.vue.d.ts` shim
// into one vue-tsc program produces TS6200 duplicate-global conflicts,
// so these loose declarations replace the real generated shims for
// this package's own type-checking pass — permissive typing, but real
// at the one boundary that matters (each module exists and has these
// exports). The runtime import is unaffected: dist/index.js/dist/index.d.ts
// still carry the real bare imports untouched (see vite.lib.config.ts's
// `external` list).
//
// Deliberately import-free (see the picker-bar shim for why: any
// top-level import, even type-only, breaks vue-tsc's resolution of the
// `declare module` blocks below).

declare module "@lilydesignsystem/vue-headless" {
    export const GanttTable: any;
    export const GanttTableTD: any;
    export const GanttTableTH: any;
    export const GanttTableTbody: any;
    export const GanttTableThead: any;
    export const GanttTableTr: any;
}

declare module "@lilydesignsystem/vue-date-time-picker" {
    const DateTimePicker: any;
    export default DateTimePicker;
    export type Props = Record<string, unknown>;
    export type DateTimePickerLabels = Record<string, unknown>;
    export const addDays: any;
    export const parseIsoDate: any;
    export const toEpochDay: any;
}
