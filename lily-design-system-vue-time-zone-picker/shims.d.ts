// Local-only ambient module declaration for @lilydesignsystem/vue-headless,
// the package this one composes (IconButton, Listbox) for its trigger
// button and listbox. See lily-design-system-vue-picker-bar/shims.d.ts
// for the full story: loading more than one generated `.vue.d.ts` shim
// into one vue-tsc program produces TS6200 duplicate-global conflicts,
// so this loose declaration replaces the real generated shim for this
// package's own type-checking pass — permissive typing, but real at the
// one boundary that matters (the module exists and has these exports).
// The runtime import is unaffected: dist/index.js/dist/index.d.ts still
// carry the real bare "@lilydesignsystem/vue-headless" import untouched
// (see vite.lib.config.ts's `external` list).
//
// Deliberately import-free (see the picker-bar shim for why: any
// top-level import, even type-only, breaks vue-tsc's resolution of the
// `declare module` block below).

declare module "@lilydesignsystem/vue-headless" {
    export const IconButton: any;
    export const Listbox: any;
}
