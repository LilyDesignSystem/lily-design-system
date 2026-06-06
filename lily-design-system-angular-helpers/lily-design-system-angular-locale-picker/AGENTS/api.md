# API — LocalePicker (Angular)

Authoritative API surface lives in [`../spec.md`](../spec.md) §4.
This file documents the Angular-flavoured shape of the contract.

## Exports

The barrel (`index.ts`) re-exports:

```ts
export {
    LocalePicker,
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
} from "./locale-picker.component";
export {
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
    RTL_SCRIPT_SUBTAGS,
} from "./locales";
```

A consumer can import either the component or the pure helpers:

```ts
import {
    LocalePicker,
    bcp47LocaleTag,
    isRtlLocale,
    matchNavigatorLanguage,
} from "./lily-design-system-angular-locale-picker";
```

The component's TypeScript types (the public field shapes) are
inferred from the `input<T>()` / `model<T>()` / `output<T>()`
factories — there's no separate `Props` interface to import.

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

`value` is two-way bindable via `[(value)]="locale"` in the
consumer's template. Other attributes (`id`, `data-*`, event
handlers) live on the host element (`<lily-locale-picker>`), not on
the inner `<fieldset>`.

## Outputs

```ts
readonly localeChange = output<string>();
```

Plus the implicit `valueChange` output from `model<string>()`.

`valueChange` flows from the component back to the parent. It
fires:

- after a radio-input change (via `onInputChange`),
- once on first `effect()` run if the resolved initial value
  differs from the supplied `value` input.

`localeChange` fires every time the picker successfully applies a
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

Plus the constants:

```ts
export const defaultLocaleLabels: Record<string, string>;
export const RTL_LANGUAGE_TAGS: ReadonlySet<string>;
export const RTL_SCRIPT_SUBTAGS: ReadonlySet<string>;
```

All pure functions are side-effect-free; consumers can call them
from tests, server code, or other components without instantiating
the picker.

## DOM contract

Root element:

```html
<fieldset class="locale-picker {className}" role="radiogroup" aria-label="{label}">
    @for (locale of locales(); track locale) {
        <label class="locale-picker-option" [attr.lang]="tagFor(locale)">
            <input
                type="radio"
                [name]="name()"
                [value]="locale"
                [checked]="value() === locale"
                (change)="onInputChange($any($event.target).value)"
            />
            <span class="locale-picker-option-label">{{ labelFor(locale) }}</span>
        </label>
    }
</fieldset>
```

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
    selector: "lily-locale-picker",
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `…`,
})
export class LocalePicker {
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
    // …
}
```

`readonly` denotes that the *reference* (the signal itself) is
constant; the signal's underlying value still changes reactively.

## Versioning

The API surface above is the v0.1.0 contract. Any breaking change
(rename, removal, type narrowing of an existing input) bumps the
minor version while v0.x; once v1.0 ships, breaking changes bump
the major.
