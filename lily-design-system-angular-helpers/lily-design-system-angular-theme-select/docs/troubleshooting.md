# Troubleshooting

Symptoms, root causes, and fixes for the most common problems.

## "CSS does not switch when I pick a new theme"

**Likely cause.** Your theme CSS files declare rules under `:root`
without scoping them to a `[data-theme="<slug>"]` selector. The
first-loaded theme then sets values that the next-loaded theme
cannot unset.

**Fix.** Scope every rule in every theme to
`:where(:root, :root[data-theme="<slug>"])`. The Lily themes
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

**Likely cause.** The select rendered on the server with no
selected option (because `value` was empty), but on the client the
lifecycle resolved a non-empty initial value from `localStorage`
or `defaultValue`. Angular logs a hydration warning when the
resulting DOM differs.

**Fix.** Resolve the theme on the server (cookie, header, or
session store) and pass it to the select via `value`. See
[ssr.md](./ssr.md).

## "Theme does not persist across reloads"

Checklist:

- `storageKey` is set.
- `localStorage` is available (not blocked by private mode or
  browser extensions).
- No other component is overwriting the same key on mount.

## "The word 'default' appears in my select"

It does not come from this component. The select only emits the
slug (title-cased) or the value from `themeLabels`. Check the
consumer markup wrapping the select for hardcoded "(default)"
annotations.

## "Multiple selects fight over `<html data-theme>`"

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
inside method calls. Use `$any($event.target).value`:

```html
(change)="onChange($any($event.target).value)"
```

This is the canonical template-cast pattern across angular-headless
and angular-helpers.

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
const fixture = TestBed.createComponent(ThemeSelect);
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
import { ThemeSelect } from "./theme-select.component";

const meta: Meta<ThemeSelect> = {
    title: "Helpers/ThemeSelect",
    component: ThemeSelect,
};
export default meta;

export const Default: StoryObj<ThemeSelect> = {
    args: {
        label: "Theme",
        themesUrl: "/assets/themes/",
        themes: ["light", "dark"],
    },
};
```

## "`effect()` runs forever / infinite loop"

The effect inside `ThemeSelect` reads `value()` and writes
`value.set(initial)` on first run only (guarded by
`this.initialised`). If you see a loop:

- Check that you haven't bypassed the guard by writing to `value`
  inside `applyTheme`.
- Check that no parent component's effect is writing back to the
  same signal in response to a `(themeChange)` emit.

The two-way `[(value)]` plus `(themeChange)` combination is safe
because `(themeChange)` is a notification, not a re-write.
