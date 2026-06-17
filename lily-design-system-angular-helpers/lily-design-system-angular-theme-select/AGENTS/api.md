# API — ThemeSelect (Angular)

Authoritative API surface lives in [`../spec.md`](../spec.md) §4.
This file documents the Angular-flavoured shape of the contract.

## Exports

The barrel (`index.ts`) re-exports:

```ts
export { ThemeSelect, normaliseThemesUrl, themeHref } from "./theme-select.component";
```

A consumer can import either the component or the helpers:

```ts
import {
    ThemeSelect,
    normaliseThemesUrl,
    themeHref,
} from "./lily-design-system-angular-theme-select";
```

The component's TypeScript types (the public field shapes) are
inferred from the `input<T>()` / `model<T>()` / `output<T>()`
factories — there's no separate `Props` interface to import.

## Inputs

| Input          | Type                          | Required | Default                                              |
| -------------- | ----------------------------- | -------- | ---------------------------------------------------- |
| `label`        | `string`                      | yes      | —                                                    |
| `themesUrl`    | `string`                      | yes      | —                                                    |
| `themes`       | `string[]`                    | yes      | —                                                    |
| `value`        | `string` (model)              | no       | `""`                                                 |
| `defaultValue` | `string`                      | no       | `""`                                                 |
| `storageKey`   | `string`                      | no       | `""`                                                 |
| `name`         | `string`                      | no       | `"theme"`                                            |
| `extension`    | `string`                      | no       | `".css"`                                             |
| `target`       | `HTMLElement \| null`         | no       | `null` (resolves to `document.documentElement`)      |
| `themeLabels`  | `Record<string, string>`      | no       | `{}`                                                 |
| `className`    | `string`                      | no       | `""`                                                 |

`value` is two-way bindable via `[(value)]="theme"` in the
consumer's template. Other attributes (`id`, `data-*`, event
handlers) live on the host element (`<lily-theme-select>`), not on
the inner `<select>` — Angular has no implicit attribute
fall-through.

## Outputs

```ts
readonly themeChange = output<string>();
```

Plus the implicit `valueChange` output from `model<string>()`.

`valueChange` is the half of `[(value)]` that flows from the
component back to the parent. It fires:

- after a `<select>` change (via the internal `onChange` handler
  that calls `this.value.set(next)`),
- once on first `effect()` run if the resolved initial value
  differs from the supplied `value` input.

`themeChange` fires every time the picker successfully applies a
theme. Use it for analytics, server sync, or cookie writes.

## Pure helpers

Two pure helpers are exported alongside the component:

```ts
export function normaliseThemesUrl(themesUrl: string): string;
export function themeHref(themesUrl: string, slug: string, extension: string): string;
```

`normaliseThemesUrl(s)` ensures `s` ends with exactly one `/`.
`themeHref(url, slug, ext)` concatenates the three to build the
final stylesheet href.

Both are pure and side-effect-free; consumers can call them from
tests, server code, or other components without instantiating the
picker.

## DOM contract

Root element:

```html
<select
    [class]="'theme-select ' + className()"
    [attr.aria-label]="label()"
    [name]="name()"
    (change)="onChange($any($event.target).value)"
>
    @for (theme of themes(); track theme) {
        <option class="theme-select-option" [value]="theme">{{ labelFor(theme) }}</option>
    }
</select>
```

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
    return theme.charAt(0).toUpperCase() + theme.slice(1);
}
```

The word "default" is never emitted. The picker uppercases only
the first character of a slug — `"abyss"` becomes `"Abyss"`,
`"high-contrast"` becomes `"High-contrast"` (hyphens preserved).

## Component class shape

```ts
@Component({
    selector: "lily-theme-select",
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
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
    // …
}
```

`readonly` on each field denotes that the *reference* (the signal
itself) is constant; the signal's underlying value still changes
reactively.

## Versioning

The API surface above is the v0.1.0 contract. Any breaking change
(rename, removal, type narrowing of an existing input) bumps the
minor version while v0.x; once v1.0 ships, breaking changes bump
the major.
