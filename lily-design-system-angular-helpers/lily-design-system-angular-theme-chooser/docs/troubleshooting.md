# Troubleshooting

Symptoms, root causes, and fixes for the most common problems.

## "Opening the list shoves the rest of the page down"

**Cause.** The package ships zero CSS, and the `<ul>` is in normal
document flow until you position it.

**Fix.** `position: relative` on `.theme-chooser`, `position: absolute`
on `.theme-chooser-list`. Full recipe in
[styling.md](./styling.md#positioning-the-list).

## "The list never closes"

**Cause.** An unconditional `display` rule in your CSS —
`.theme-chooser-list { display: block }` — overrides the `hidden`
attribute the component toggles.

**Fix.** Scope it: `.theme-chooser-list:not([hidden]) { display: block }`.

## "The button renders an empty box, or a □"

**Cause.** The default glyph is `◑` (U+25D1 CIRCLE WITH RIGHT HALF
BLACK), a Geometric Shapes character. Whether it renders depends on
the fonts installed on the user's device.

**Fix.** Either set a font stack on `.theme-chooser-icon` that you know
covers the code point plus a `min-width` / `min-height` on the button
so it stays a visible target, or replace the glyph with your own
inline SVG via a projected `<ng-template>`. See
[custom-rendering.md](./custom-rendering.md#recipe-an-inline-svg-icon).

The accessible name is unaffected either way — the glyph is
`aria-hidden` and the button is named by `aria-label`.

## "Every option looks highlighted / the highlight doesn't move"

**Cause.** `[data-active]` and `[aria-selected="true"]` are styled the
same. They are different states: `data-active` is where the keyboard
is pointing, `aria-selected` is the theme in effect. Mid-navigation
they are on different options.

**Fix.** Give them distinct treatments — a background for
`[data-active]`, a weight change or checkmark for
`[aria-selected="true"]`.

## "Keyboard users can't tell where they are in the list"

**Cause.** No focus ring on `.theme-chooser-list`. The `<ul>` — not the
options — holds focus for the whole open interaction, so if it has no
visible indicator, nothing on screen ties the highlight to the user's
keystrokes.

**Fix.** Style `.theme-chooser-list:focus-visible` as well as
`.theme-chooser-button:focus-visible`. See
[accessibility.md](./accessibility.md#visible-focus).

## "Arrow keys stop at the ends instead of wrapping"

Working as specified. The APG listbox pattern clamps rather than
wraps; `Home` and `End` are the fast paths to the ends.

## "CSS does not switch when I pick a new theme"

**Likely cause.** Your theme CSS files declare rules under `:root`
without scoping them to a `[data-theme="<slug>"]` selector. The
first-loaded theme then sets values that the next-loaded theme
cannot unset.

**Fix.** Scope every rule in every theme to
`:where(:root, :root[data-theme="<slug>"])`. The Lily™ themes
follow this convention.

## "404 on the theme href"

**Likely cause.** `themesUrl + slug + extension` does not resolve
to a real file. Check that:

- The themes directory is actually served by your static asset
  pipeline (e.g. `src/assets/themes/` under Angular CLI; the
  `public/` directory for Analog).
- `extension` matches the file extension (`.css`, `.module.css`,
  etc).
- The slug case matches the file name (case-sensitive on most
  servers).

## "SSR hydration mismatch (NG0500)"

**Not the ids.** `nextThemeChooserId()` is a deterministic module
counter, not `Math.random()` / `Date.now()`, so `id`,
`aria-controls`, and the option ids are identical on both sides.

**Possibly the value-derived attributes.** The hidden input's `value`
and the `aria-selected` flags follow the resolved theme, so they
differ if the server rendered from an empty `value` while the client
resolved one from `localStorage` or `defaultValue`.

**Likely cause.** Something *else* in your template keys off the
resolved theme — a visible "active theme" label, a conditional class,
or a `data-*` attribute — with the same empty-vs-resolved split.

**Fix.** Resolve the theme on the server (cookie, header, or
session store) and pass it to the select via `value`, so both renders
agree. See [ssr.md](./ssr.md).

## "Theme does not persist across reloads"

Checklist:

- `storageKey` is set.
- `localStorage` is available (not blocked by private mode or
  browser extensions).
- No other component is overwriting the same key on mount.

## "The word 'default' appears in my select"

It does not come from this component. The select only emits the
title-cased slug or the value from `themeLabels`. Check the
consumer markup wrapping the select for hardcoded "(default)"
annotations.

## "Typeahead doesn't find the theme I'm typing"

The typeahead matches the **display label**, not the slug. With
`themeLabels: { light: "Clair" }`, typing `l` will not find it —
type `c`. The buffer also resets after a 500 ms pause, so typing
slowly starts a fresh search each time.

## "Multiple choosers fight over `<html data-theme>`"

When two selects share `document.documentElement` as the target,
the last apply wins. Either pass a per-select `target` element, or
designate one select as the "global" one and have the others apply
their themes to a wrapping element via `target`.

## "The select re-fetches the same CSS file on every render"

It shouldn't — the managed `<link>` is reused, and changing
`themesUrl` is not enough to re-trigger `applyTheme`. If you
observe re-fetches:

- Confirm the surrounding component isn't remounting the select
  every render (e.g. inside an `@if` whose condition toggles
  rapidly, or a `@defer` configuration that detaches /
  reattaches).
- Confirm the consumer isn't manually removing the managed
  `<link>` on each render.

## "`[(value)]` doesn't update"

**Likely cause 1.** The consumer field is a plain string, not a
`WritableSignal<string>`. `[(value)]` desugars to `[value]="x"` +
`(valueChange)="x = $event"`; the `=` assignment requires a
writable reference, which signals provide via their setter
semantics.

**Fix.** Declare the field as a signal:

```ts
theme = signal<string>("");
```

**Likely cause 2.** The model name is misspelled. The select
exposes its bindable on `value`, not `modelValue`. Use
`[(value)]="theme"`.

## "Compile error: `($event.target as HTMLInputElement).value`"

Angular's template parser rejects parenthesised TypeScript casts
inside method calls. Use `$any($event.target).value` instead — the
canonical template-cast pattern across angular-headless and
angular-helpers.

`ThemeChooser` itself no longer needs it: there is no native control to
read a value from, and its `(click)` / `(keydown)` bindings call typed
handler methods with the whole event. You may still hit this in your
own wrapper templates.

## "`let-args` is `any` in my icon template"

Add the exported `ThemeChooserIcon` marker directive to the
`<ng-template>` and to your component's `imports`:

```html
<ng-template lilyThemeChooserIcon let-args>{{ args.labelFor(args.value) }}</ng-template>
```

Its `ngTemplateContextGuard` types the context as `ChildArgs` under
`strictTemplates`. It changes nothing at runtime — the component
queries any projected `<ng-template>`.

## "Theme switch works locally but not in production"

Almost always a caching issue. Either:

- Add a cache-busting suffix via `extension` (e.g. `.css?v=1`), or
- Configure the static asset server to send `Cache-Control:
  must-revalidate` for theme CSS files.

## "Inside `@defer` the select shows the default for a frame"

`@defer` defers `effect()` execution until the deferred block
hydrates. The select still works but the FOUT window grows. Move
the select outside the `@defer` boundary, or pre-resolve the theme
on the server and pass it as `value`.

## "TypeScript complains: `setInput` is not a method on `instance`"

Use `componentRef.setInput(...)` instead of writing to the
instance directly:

```ts
const fixture = TestBed.createComponent(ThemeChooser);
fixture.componentRef.setInput("label", "Theme");
fixture.componentRef.setInput("themesUrl", "/t/");
fixture.componentRef.setInput("themes", ["light", "dark"]);
fixture.detectChanges();
```

Plain assignment (`fixture.componentInstance.label = "X"`) does not
work because signal inputs are read-only references.

## "`themesUrl` change doesn't reload the stylesheet"

By design. The effect only re-runs when `value()` changes. Other
inputs are read inside the apply function but don't trigger a
re-apply on their own. If you need this, write to `value`:

```ts
this.themesUrl.set(newUrl);
const current = this.theme();
this.theme.set("");      // forces the effect to fire
this.theme.set(current); // re-applies with the new url
```

## "OnPush + signal inputs miss a render after `setInput`"

`detectChanges()` flushes the change-detection cycle. Always call
it after `setInput()`:

```ts
fixture.componentRef.setInput("value", "dark");
fixture.detectChanges();  // required
```

## "Storybook doesn't show the select"

`@storybook/angular` uses the webpack-based Angular builder by
default. Make sure the select is in the `imports` array of the
story's `component` field:

```ts
import { Meta, StoryObj } from "@storybook/angular";
import { ThemeChooser } from "./theme-chooser.component";

const meta: Meta<ThemeChooser> = {
    title: "Helpers/ThemeChooser",
    component: ThemeChooser,
};
export default meta;

export const Default: StoryObj<ThemeChooser> = {
    args: {
        label: "Theme",
        themesUrl: "/assets/themes/",
        themes: ["light", "dark"],
    },
};
```

## "`effect()` runs forever / infinite loop"

The effect inside `ThemeChooser` reads `value()` and writes
`value.set(initial)` on first run only (guarded by
`this.initialised`). If you see a loop:

- Check that you haven't bypassed the guard by writing to `value`
  inside `applyTheme`.
- Check that no parent component's effect is writing back to the
  same signal in response to a `(themeChange)` emit.

The two-way `[(value)]` plus `(themeChange)` combination is safe
because `(themeChange)` is a notification, not a re-write.

---

Lily™ and Lily Design System™ are trademarks.
