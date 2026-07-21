# API — LocaleChooser (Angular)

Authoritative API surface lives in [`../spec/index.md`](../spec/index.md) §4.
This file documents the Angular-flavoured shape of the contract.

## Exports

The barrel (`index.ts`) re-exports:

```ts
export {
    LocaleChooser,
    LocaleChooserIcon,
    GLOBE_WITH_MERIDIANS,
    nextLocaleChooserId,
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
} from "./locale-chooser.component";
export type { ChildArgs } from "./locale-chooser.component";
export {
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
    RTL_SCRIPT_SUBTAGS,
} from "./locales";
```

A consumer can import either the component or the pure helpers:

```ts
import {
    LocaleChooser,
    LocaleChooserIcon,
    bcp47LocaleTag,
    isRtlLocale,
    matchNavigatorLanguage,
} from "./lily-design-system-angular-locale-chooser";
```

The component's TypeScript types (the public field shapes) are
inferred from the `input<T>()` / `model<T>()` / `output<T>()`
factories — there's no separate `Props` interface to import. The one
exported type is `ChildArgs`, the context of the projected icon
template.

## Inputs

| Input                  | Type                          | Required | Default                                              |
| ---------------------- | ----------------------------- | -------- | ---------------------------------------------------- |
| `label`                | `string`                      | yes      | —                                                    |
| `locales`              | `string[]`                    | yes      | —                                                    |
| `value`                | `string` (model)              | no       | `""`                                                 |
| `defaultValue`         | `string`                      | no       | `""`                                                 |
| `storageKey`           | `string`                      | no       | `""`                                                 |
| `detectFromNavigator`  | `boolean`                     | no       | `false`                                              |
| `name`                 | `string`                      | no       | `"locale"`                                           |
| `target`               | `HTMLElement \| null`         | no       | `null` (resolves to `document.documentElement`)      |
| `applyDir`             | `boolean`                     | no       | `true`                                               |
| `localeLabels`         | `Record<string, string>`      | no       | `{}`                                                 |
| `className`            | `string`                      | no       | `""`                                                 |

`label` names both the button and the listbox; because the button is
icon-only it is the entire accessible name. `name` lands on the
hidden input, not on any native control. `className` is appended to
the root `<div>`.

`value` is two-way bindable via `[(value)]="locale"` in the
consumer's template. Other attributes (`id`, `data-*`, event
handlers) live on the host element (`<lily-locale-chooser>`), not on
the inner root `<div>`.

## Content projection

A projected `<ng-template>` replaces the default globe glyph inside
the button. It does **not** render options.

```html
<lily-locale-chooser label="Language" [locales]="locales">
    <ng-template let-args>{{ args.labelFor(args.value) }}</ng-template>
</lily-locale-chooser>
```

The context type:

```ts
export type ChildArgs = {
    value: string;
    open: boolean;
    labelFor: (locale: string) => string;
};
```

It is passed both as `$implicit` (so `let-args` works) and spread as
named properties (so `let-value`, `let-open`, `let-labelFor` work).

`LocaleChooserIcon` is an optional marker directive
(`ng-template[lilyLocaleChooserIcon]`) whose only job is the
`ngTemplateContextGuard` that types the `let-` variables. The
component queries with `contentChild(TemplateRef)`, so the marker is
never required for matching:

```html
<lily-locale-chooser label="Language" [locales]="locales">
    <ng-template lilyLocaleChooserIcon let-args>
        {{ args.labelFor(args.value) }}
    </ng-template>
</lily-locale-chooser>
```

## Outputs

```ts
readonly localeChange = output<string>();
```

Plus the implicit `valueChange` output from `model<string>()`.

`valueChange` flows from the component back to the parent. It
fires:

- after an option is chosen (by click, or by `Enter` / `Space` on
  the active option),
- once on first `effect()` run if the resolved initial value
  differs from the supplied `value` input.

`localeChange` fires every time the select successfully applies a
locale. The payload is the consumer-form code (e.g. `"en_US"`),
not the BCP 47-normalised tag (`"en-US"`).

## Pure helpers

```ts
export function bcp47LocaleTag(locale: string): string;
export function isRtlLocale(locale: string): boolean;
export function localeName(locale: string): string;
export function matchNavigatorLanguage(
    navLangs: readonly string[],
    locales: readonly string[],
): string;
```

`nextLocaleChooserId()` is exported too, but it is *not* pure — it
increments a module-scoped counter:

```ts
export function nextLocaleChooserId(): string; // "locale-chooser-1", "locale-chooser-2", …
```

It exists so ids are stable and collision-free without
`Math.random()` or `Date.now()`, which would differ between the
server and client renders and trip hydration.

Plus the constants:

```ts
export const GLOBE_WITH_MERIDIANS: string; // "\u{1F310}"
export const defaultLocaleLabels: Record<string, string>;
export const RTL_LANGUAGE_TAGS: ReadonlySet<string>;
export const RTL_SCRIPT_SUBTAGS: ReadonlySet<string>;
```

All the pure functions are side-effect-free; consumers can call them
from tests, server code, or other components without instantiating
the select.

## DOM contract

```html
<div class="locale-chooser {className}">
    <input type="hidden" [name]="name()" [value]="value()" />

    <button
        type="button"
        class="locale-chooser-button"
        [attr.aria-label]="label() || null"
        aria-haspopup="listbox"
        [attr.aria-expanded]="open()"
        [attr.aria-controls]="listId"
    >
        <span class="locale-chooser-icon" aria-hidden="true">&#127760;</span>
    </button>

    <ul
        class="locale-chooser-list"
        [id]="listId"
        role="listbox"
        [attr.aria-label]="label() || null"
        [attr.aria-activedescendant]="activeDescendant()"
        tabindex="-1"
        [attr.hidden]="open() ? null : ''"
    >
        @for (locale of locales(); track locale; let i = $index) {
            <li
                class="locale-chooser-option"
                [id]="optionId(i)"
                role="option"
                [attr.aria-selected]="locale === value()"
                [attr.data-active]="i === activeIndex() ? '' : null"
                [attr.lang]="tagFor(locale)"
            >{{ labelFor(locale) }}</li>
        }
    </ul>
</div>
```

`aria-activedescendant` is a `computed()` that returns `null` unless
the list is open and `activeIndex() >= 0`, so the attribute is absent
while closed.

Document mutations (only inside the `effect()` callback, guarded
by `typeof document !== "undefined"`):

```html
<html lang="{tagFor(locale)}" dir="rtl|ltr">
```

`dir` is only written when `applyDir` is `true` (the default).

## Internal helpers exposed on the instance

`labelFor(locale: string): string` and `tagFor(locale: string):
string` are exposed on the component instance for test purposes:

```ts
labelFor(locale: string): string {
    const labels = this.localeLabels();
    if (locale in labels) return labels[locale];
    if (locale in defaultLocaleLabels) return defaultLocaleLabels[locale];
    const intl = intlDisplayName(locale);
    if (intl) return intl;
    return locale;
}

tagFor(locale: string): string {
    return bcp47LocaleTag(locale);
}
```

## Component class shape

```ts
@Component({
    selector: "lily-locale-chooser",
    standalone: true,
    imports: [NgTemplateOutlet],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        "(document:click)": "onDocumentClick($event)",
    },
    template: `…`,
})
export class LocaleChooser {
    readonly label = input.required<string>();
    readonly locales = input.required<string[]>();
    readonly value = model<string>("");
    readonly defaultValue = input<string>("");
    readonly storageKey = input<string>("");
    readonly detectFromNavigator = input<boolean>(false);
    readonly name = input<string>("locale");
    readonly target = input<HTMLElement | null>(null);
    readonly applyDir = input<boolean>(true);
    readonly localeLabels = input<Record<string, string>>({});
    readonly className = input<string>("");
    readonly localeChange = output<string>();

    /** Projected icon template; replaces the default glyph when supplied. */
    protected readonly iconTemplate = contentChild(TemplateRef);
    // …
}
```

Outside-click closing rides on the `host` binding above rather than
a manual `addEventListener`, and focus-out closing rides on a
`(focusout)` binding on the root `<div>`. Both are torn down by
Angular when the component is destroyed; the only manual cleanup is
the typeahead timer, cleared via `inject(DestroyRef).onDestroy(…)`.

`readonly` denotes that the *reference* (the signal itself) is
constant; the signal's underlying value still changes reactively.

## Versioning

The API surface above is the v0.1.0 contract. Any breaking change
(rename, removal, type narrowing of an existing input) bumps the
minor version while v0.x; once v1.0 ships, breaking changes bump
the major.
