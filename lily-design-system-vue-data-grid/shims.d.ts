// Local-only ambient module declaration for the one sibling package this
// one composes: @lilydesignsystem/vue-headless (the DataTable family).
// See lily-design-system-vue-picker-bar/shims.d.ts for the full story:
// loading more than one generated `.vue.d.ts` shim into one vue-tsc
// program produces TS6200 duplicate-global conflicts, so these loose
// declarations replace the real generated shims for this package's own
// type-checking pass. The runtime import is unaffected.
//
// Deliberately import-free: any top-level import, even type-only, breaks
// vue-tsc's resolution of the `declare module` block below.

declare module "@lilydesignsystem/vue-headless" {
    export const DataTable: any;
    export const DataTableBody: any;
    export const DataTableFoot: any;
    export const DataTableHead: any;
    export const DataTableRow: any;
    export const DataTableTD: any;
    export const DataTableTH: any;
    export const PaginationNav: any;
    export const SearchInput: any;
}
