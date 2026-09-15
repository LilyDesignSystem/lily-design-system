// Local-only ambient module declarations for the four sibling picker
// packages this package composes.
//
// Each sibling's own build (vite.lib.config.ts + vue-tsc) generates a
// `dist/{Pascal}.vue.d.ts` shim that declares its own file-scoped
// `declare global { const __VLS_intrinsicElements: …; … }` block (part
// of how vue-tsc types a compiled SFC). That block is meant to be
// scoped per file, but loading MORE THAN ONE such generated shim into
// one TypeScript program — which is exactly what PickerBar.vue's
// template does, rendering all four siblings at once — produces
// `TS6200: Definitions of the following identifiers conflict with
// those in another file` for the duplicate `const __VLS_*` globals.
// Real, reproduced: `node build.mjs` fails on this package specifically
// until this file exists (and is included by the throwaway tsconfig
// `build.mjs` generates — see its `shims.d.ts` inclusion).
//
// The fix: don't let vue-tsc resolve the real generated `.vue.d.ts`
// shims for this package's own type-checking pass. These loose
// declarations replace them — permissive component/prop typing, but
// real at the one boundary that matters (the module actually exists
// and has a default export), and the runtime import is completely
// unaffected: `dist/index.js`/`dist/index.d.ts` for THIS package still
// carry the real bare `lily-design-system-vue-*-picker` imports
// untouched (see vite.lib.config.ts's `external` list), which a real
// install resolves via `node_modules` exactly as intended.
//
// Deliberately untyped as `any`, not `import type { Component } from
// "vue"`: reproduced that adding ANY top-level import to this file —
// including a type-only import of Vue's own `Component` — makes
// vue-tsc silently fail to resolve the `declare module` blocks below at
// all (back to `TS2307: Cannot find module`, the exact error this file
// exists to avoid). Keep this file import-free.

declare module "lily-design-system-vue-theme-picker" {
    const ThemePicker: any;
    export default ThemePicker;
    export type Props = Record<string, unknown>;
}

declare module "lily-design-system-vue-locale-picker" {
    const LocalePicker: any;
    export default LocalePicker;
    export type Props = Record<string, unknown>;
}

declare module "lily-design-system-vue-text-size-picker" {
    const TextSizePicker: any;
    export default TextSizePicker;
    export type Props = Record<string, unknown>;
}

declare module "lily-design-system-vue-share-picker" {
    const SharePicker: any;
    export default SharePicker;
    export type Props = Record<string, unknown>;
    export type ShareTarget = {
        id: string;
        label: string;
        href: (url: string, title: string, text: string) => string;
        newTab?: boolean;
    };
}
