# API — ThemeSelect (Angular)

Authoritative API surface lives in [`../spec/index.md`](../spec/index.md) §4.
This file documents the Angular-flavoured shape of the contract.

## Exports

The barrel (`index.ts`) re-exports:

```ts
export {
    ThemeSelect,
    ThemeSelectIcon,
    CIRCLE_WITH_RIGHT_HALF_BLACK,
    nextThemeSelectId,
    normaliseThemesUrl,
    themeHref,
    themeName,
    matchSystemTheme,
} from "./theme-select.component";
export type { ChildArgs } from "./theme-select.component";
```

A consumer can import the component, the marker directive, the
constants, or the helpers:

```ts
import {
    ThemeSelect,
    ThemeSelectIcon,
    CIRCLE_WITH_RIGHT_HALF_BLACK,
    normaliseThemesUrl,
    themeHref,
    themeName,
    matchSystemTheme,
    type ChildArgs,
} from "./lily-design-system-angular-theme-select";
```

The component's input/output types are inferred from the
`input<T>()` / `model<T>()` / `output<T>()` factories — there's no
separate `Props` interface to import. `ChildArgs` is the one exported
type, and it describes the custom-glyph template context.

## Inputs

| Input          | Type                          | Required | Default                                              |
| -------------- | ----------------------------- | -------- | ---------------------------------------------------- |
| `label`        | `string`                      | yes      | —                                                    |
| `themesUrl`    | `string`                      | yes      | —                                                    |
| `themes`       | `string[]`                    | yes      | —                                                    |
| `value`        | `string` (model)              | no       | `""`                                                 |
| `defaultValue` | `string`                      | no       | `""`                                                 |
| `storageKey`   | `string`                      | no       | `""`                                                 |
| `detectFromSystem` | `boolean`                 | no       | `false`                                              |
| `name`         | `string`                      | no       | `"theme"`                                            |
| `extension`    | `string`                      | no       | `".css"`                                             |
| `target`       | `HTMLElement \| null`         | no       | `null` (resolves to `document.documentElement`)      |
| `themeLabels`  | `Record<string, string>`      | no       | `{}`                                                 |
| `className`    | `string`                      | no       | `""`                                                 |

`value` is two-way bindable via `[(value)]="theme"` in the
consumer's template. Other attributes (`id`, `data-*`, event
handlers) live on the host element (`<lily-theme-select>`), not on
the inner root `<div>` — Angular has no implicit attribute
fall-through. `className` is the explicit escape hatch for putting a
class on the root `<div>`.

## Content projection

An optional `<ng-template>` projected into `<lily-theme-select>`
replaces the default glyph inside the button:

```html
<lily-theme-select label="Theme" [themesUrl]="url" [themes]="themes">
    <ng-template let-args>{{ args.labelFor(args.value) }}</ng-template>
</lily-theme-select>
```

The component queries it with `contentChild(TemplateRef)`, so any
projected `<ng-template>` matches. The exported `ThemeSelectIcon`
marker directive (`ng-template[lilyThemeSelectIcon]`) is optional;
adding it gives typed `let-` variables via `ngTemplateContextGuard`:

```html
<ng-template lilyThemeSelectIcon let-args>…</ng-template>
```

The context type is:

```ts
export type ChildArgs = {
    value: string;                        // selected theme slug
    open: boolean;                        // is the listbox open?
    labelFor: (theme: string) => string;  // slug → display label
};
```

It is passed as both `$implicit` and named properties, so
`let-args`, `let-value="value"`, `let-open="open"`, and
`let-labelFor="labelFor"` all work.

**The template does not render options.** It replaces the button
glyph only; the listbox stays component-owned.

## Outputs

```ts
readonly themeChange = output<string>();
```

Plus the implicit `valueChange` output from `model<string>()`.

`valueChange` is the half of `[(value)]` that flows from the
component back to the parent. It fires:

- when the user chooses an option (click, or `Enter` / `Space` on the
  active option), via `choose(index)` calling `this.value.set(slug)`,
- once on first `effect()` run if the resolved initial value
  differs from the supplied `value` input.

`themeChange` fires every time the select successfully applies a
theme. Use it for analytics, server sync, or cookie writes.

## Pure helpers

Two pure helpers are exported alongside the component:

```ts
export function normaliseThemesUrl(themesUrl: string): string;
export function themeHref(themesUrl: string, slug: string, extension: string): string;
export function themeName(theme: string): string;
export function matchSystemTheme(themes: readonly string[]): string;
```

`themeName(slug)` title-cases each hyphen-separated word — it is the
mirror of locale-select's `localeName`, and the one implementation the
component's own `labelFor` delegates to, so consumers building a
sibling affordance never re-derive the rule.

`matchSystemTheme(themes)` reads
`matchMedia("(prefers-color-scheme: dark)")`, maps it to `"dark"` /
`"light"`, and returns `""` when that slug is not in `themes` **or when
`matchMedia` is unavailable** — SSR, and jsdom, which does not
implement it. It is the mirror of locale-select's
`matchNavigatorLanguage`.

`normaliseThemesUrl(s)` ensures `s` ends with exactly one `/`.
`themeHref(url, slug, ext)` concatenates the three to build the
final stylesheet href.

Both are pure and side-effect-free; consumers can call them from
tests, server code, or other components without instantiating the
select.

## Id generation

```ts
export function nextThemeSelectId(): string;  // "theme-select-1", "theme-select-2", …
```

An incrementing module-level counter — **not** `Math.random()` or
`Date.now()`. That is what makes the ids stable across the server and
client renders, so `aria-controls` / `aria-activedescendant` /
`id` triples survive hydration. Each component instance calls it once
in a field initialiser and derives `{base}-list` and
`{base}-option-{i}` from the result.

## Constants

```ts
export const CIRCLE_WITH_RIGHT_HALF_BLACK = "◑";  // U+25D1, &#9681;
```

The default button glyph. Exported so consumers can reuse the same
glyph elsewhere (a status line, a menu entry) without hardcoding the
code point.

## DOM contract

```html
<div class="theme-select {{ className() }}" (focusout)="onRootFocusOut($event)">
    <input type="hidden" [name]="name()" [value]="value()" />

    <button
        type="button"
        class="theme-select-button"
        [attr.aria-label]="label() || null"
        aria-haspopup="listbox"
        [attr.aria-expanded]="open()"
        [attr.aria-controls]="listId"
        (click)="toggle()"
        (keydown)="onButtonKeydown($event)"
    >
        <span class="theme-select-icon" aria-hidden="true">◑</span>
    </button>

    <ul
        class="theme-select-list"
        [id]="listId"
        role="listbox"
        [attr.aria-label]="label() || null"
        [attr.aria-activedescendant]="activeDescendant()"
        tabindex="-1"
        [attr.hidden]="open() ? null : ''"
        (keydown)="onListKeydown($event)"
    >
        @for (theme of themes(); track theme; let i = $index) {
            <li
                class="theme-select-option"
                [id]="optionId(i)"
                role="option"
                [attr.aria-selected]="theme === value()"
                [attr.data-active]="i === activeIndex() ? '' : null"
                (click)="choose(i)"
            >{{ labelFor(theme) }}</li>
        }
    </ul>
</div>
```

Outside-click dismissal is a host binding rather than a manual
listener:

```ts
host: { "(document:click)": "onDocumentClick($event)" }
```

`aria-activedescendant` is computed and returns `null` while the
listbox is closed, so the attribute is absent rather than stale.

Document mutations (only inside the `effect()` callback, guarded
by `typeof document !== "undefined"`):

```html
<link rel="stylesheet" data-lily-theme-select="{name}" href="{themesUrl}{slug}{extension}" />
```

And on the resolved target:

```html
<html data-theme="{slug}">
```

## Internal helpers

`labelFor(theme: string): string` is exposed on the component
instance for test purposes:

```ts
labelFor(theme: string): string {
    const labels = this.themeLabels();
    if (theme in labels) return labels[theme];
    return themeName(theme);
}
```

The word "default" is never emitted. Each hyphen-separated word is
title-cased and the hyphens become spaces — `"abyss"` becomes
`"Abyss"`, `"high-contrast"` becomes `"High Contrast"`. This is also
the string the typeahead matches against.

Two more members are public for the same reason (`#ref`-driven
consumer templates and tests): `openList(startIndex?)` and
`closeList(refocus?)`.

## Component class shape

```ts
@Component({
    selector: "lily-theme-select",
    standalone: true,
    imports: [NgTemplateOutlet],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { "(document:click)": "onDocumentClick($event)" },
    template: `…`,
})
export class ThemeSelect {
    readonly label = input.required<string>();
    readonly themesUrl = input.required<string>();
    readonly themes = input.required<string[]>();
    readonly value = model<string>("");
    readonly defaultValue = input<string>("");
    readonly storageKey = input<string>("");
    readonly name = input<string>("theme");
    readonly extension = input<string>(".css");
    readonly target = input<HTMLElement | null>(null);
    readonly themeLabels = input<Record<string, string>>({});
    readonly className = input<string>("");
    readonly themeChange = output<string>();

    protected readonly iconTemplate = contentChild(TemplateRef);
    // …
}
```

`readonly` on each field denotes that the *reference* (the signal
itself) is constant; the signal's underlying value still changes
reactively.

## Versioning

Any breaking change (rename, removal, type narrowing of an existing
input) bumps the minor version while v0.x; once v1.0 ships, breaking
changes bump the major. The move from a native `<select>` to the icon
button + listbox, and the removal of the `placeholder` input, are
breaking; see [`../CHANGELOG.md`](../CHANGELOG.md).
