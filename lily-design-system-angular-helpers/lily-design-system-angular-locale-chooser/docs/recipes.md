# Recipes

Short solutions to common adjacent problems. Each recipe is the
smallest code that solves the problem; production code may want
more error handling.

For the mental model behind these, see
[concepts.md](./concepts.md); for the full input table, see
[props-reference.md](./props-reference.md).

## Minimal setup with a fixed locale list

```ts
import { Component, signal } from "@angular/core";
import { LocaleChooser } from "../locale-chooser.component";

@Component({
    standalone: true,
    imports: [LocaleChooser],
    template: `
        <lily-locale-chooser
            label="Language"
            [locales]="locales"
            [(value)]="locale"
        />
    `,
})
export class Settings {
    locales = ["en", "cy", "fr", "ar"];
    locale = signal("");
}
```

`label` and `locales` are the only required inputs. With `value`
left empty the select resolves an initial locale itself: `"en"` if
your list contains it, otherwise `locales[0]`. See
[`../examples/basic.component.ts`](../examples/basic.component.ts)
for the same thing with the status region attached.

## Remember the choice across visits

```html
<lily-locale-chooser
    label="Language"
    [locales]="['en', 'fr', 'ar']"
    [(value)]="locale"
    storageKey="my-app:locale"
/>
```

Every applied locale is written to `localStorage[storageKey]`, and a
stored value is read back on mount. Quota and privacy-mode errors are
swallowed, so a blocked `localStorage` degrades to no persistence
rather than throwing.

## Guess the locale on the first visit

```html
<lily-locale-chooser
    label="Language"
    [locales]="['en', 'fr', 'ar']"
    [(value)]="locale"
    storageKey="my-app:locale"
    [detectFromNavigator]="true"
/>
```

`detectFromNavigator` matches `navigator.languages` against your
`locales` list — exact match first, then language-only (so a browser
asking for `fr-BE` gets your `fr`). Precedence matters: a bound
`value` wins over storage, storage wins over navigator detection, and
`defaultValue` is the last resort before the built-in `"en"` /
`locales[0]` fallback. So detection only ever fires for a user who has
not chosen yet.

## React to a change imperatively

```ts
import { Component, signal } from "@angular/core";
import { LocaleChooser } from "../locale-chooser.component";

@Component({
    standalone: true,
    imports: [LocaleChooser],
    template: `
        <lily-locale-chooser
            label="Language"
            [locales]="['en', 'fr', 'ar']"
            [(value)]="locale"
            (localeChange)="onLocaleChange($event)"
        />
    `,
})
export class Settings {
    locale = signal("");

    onLocaleChange(code: string) {
        document.cookie = `locale=${encodeURIComponent(code)}; path=/; max-age=31536000; samesite=lax`;
        analytics.track("locale_changed", { locale: code });
    }
}
```

`(localeChange)` fires *after* the select has written `lang` / `dir`
and persisted, and carries the code in your original form (`en_US`
stays `en_US`). Use it for one-shot side effects; use `[(value)]` when
you want state.

## Show each locale in its own language

```html
<lily-locale-chooser
    label="Language"
    [locales]="['en', 'fr', 'de', 'ar', 'cy']"
    [localeLabels]="endonyms"
    [(value)]="locale"
/>
```

```ts
endonyms: Record<string, string> = {
    en: "English",
    fr: "Français",
    de: "Deutsch",
    ar: "العربية",
    cy: "Cymraeg",
};
```

Endonyms are the accessible default for a language picker: a user who
cannot read the current interface language can still find their own.
Each option already carries its own `lang`, so a screen reader
pronounces the endonym correctly. `localeLabels` overrides per code;
anything you omit falls back to the built-in English name, then
`Intl.DisplayNames`, then the raw code.
[`../examples/nhs-style.component.ts`](../examples/nhs-style.component.ts)
shows this in a language banner; the reasoning is in
[accessibility.md](./accessibility.md).

## Scope the locale to one panel

```ts
@Component({
    standalone: true,
    imports: [LocaleChooser],
    template: `
        <section #panel>
            <lily-locale-chooser
                label="Panel language"
                [locales]="['en', 'fr', 'ar']"
                [target]="panel"
                [(value)]="panelLocale"
            />
        </section>
    `,
})
export class Panel {
    panelLocale = signal("fr");
}
```

`target` redirects the `lang` / `dir` writes from
`document.documentElement` to any element you hand it — the template
reference variable on a plain `<section>` *is* the `HTMLElement`, so
no `viewChild` is needed. Give each select a distinct `name` if more
than one appears in the same form. See
[`../examples/scoped-target.component.ts`](../examples/scoped-target.component.ts).

## Keep control of `dir` yourself

```html
<lily-locale-chooser
    label="Language"
    [locales]="['en', 'ar']"
    [(value)]="locale"
    [applyDir]="false"
/>
```

With `applyDir="false"` the select writes `lang` and leaves `dir`
alone. Correct when a server framework, a CMS, or an outer shell
already owns `dir`, or when you deliberately keep an LTR chrome around
RTL content. Do not set it merely to avoid RTL layout work — an
untranslated `dir` is a genuine bug for Arabic, Hebrew, Persian, and
Urdu readers. What `dir="rtl"` actually changes:
[rtl.md](./rtl.md).

## Reload the page on a locale switch

```ts
import { Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { LocaleChooser } from "../locale-chooser.component";

@Component({
    standalone: true,
    imports: [LocaleChooser],
    template: `
        <lily-locale-chooser
            label="Language"
            [locales]="['en', 'fr', 'ar']"
            [value]="current()"
            (localeChange)="navigate($event)"
        />
    `,
})
export class LanguageMenu {
    private router = inject(Router);
    current = signal("en");

    navigate(next: string) {
        const path = this.router.url.replace(/^\/(en|fr|ar)/, `/${next}`);
        this.router.navigateByUrl(path);
    }
}
```

Bind `[value]` one-way (not `[(value)]`) when the route is the real
source of truth — otherwise the signal and the URL can disagree while
navigation is in flight. The route-prefix scheme in full, including
the server middleware that sets `lang` on the first byte:
[ssr.md § Strategy 3](./ssr.md).

## Submit the locale with a form

```html
<form method="post" action="/preferences">
    <lily-locale-chooser
        label="Language"
        [locales]="['en', 'fr', 'ar']"
        [(value)]="locale"
        name="preferred_locale"
    />
    <button type="submit">Save</button>
</form>
```

The control renders a hidden `<input>` mirroring `value`, so it
participates in a plain form POST with no extra wiring. `name`
defaults to `"locale"`; set it to whatever your endpoint expects, and
make it unique if several selects share one form.

## Read the value back out programmatically

```ts
export class Settings {
    locale = signal("");

    save() {
        void fetch("/api/preferences", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ locale: this.locale() }),
        });
    }
}
```

`value` is a `model` signal, so `[(value)]="locale"` gives you a
`WritableSignal<string>` you can read anywhere — and write to, which
switches the locale from a sibling component without touching the
select. Hoist the signal into a root-provided service when the writer
is far away in the tree.

## Pick the initial locale on the server

```ts
import { matchNavigatorLanguage, isRtlLocale, bcp47LocaleTag }
    from "../locale-chooser.component";

const SUPPORTED = ["en", "fr", "ar"];

export function resolveLocale(acceptLanguage: string): {
    lang: string;
    dir: "ltr" | "rtl";
} {
    const requested = acceptLanguage
        .split(",")
        .map((part) => part.split(";")[0].trim())
        .filter(Boolean);
    const code = matchNavigatorLanguage(requested, SUPPORTED) || "en";
    return { lang: bcp47LocaleTag(code), dir: isRtlLocale(code) ? "rtl" : "ltr" };
}
```

`matchNavigatorLanguage`, `isRtlLocale`, `bcp47LocaleTag`, and
`localeName` are pure functions with no Angular or DOM dependency, so
they run fine in a Nitro handler or a Node script. Seeding `value`
from this on the server is what removes the flash of the default
locale — [ssr.md](./ssr.md) has the full Analog wiring, and
[`../examples/analog-cookie.component.ts`](../examples/analog-cookie.component.ts)
the cookie variant.

## Drive an i18n library

```ts
onLocaleChange(code: string) {
    this.transloco.setActiveLang(code);
}
```

The select never translates strings; it changes the document language
and tells you it did. One `(localeChange)` handler is usually the
whole integration. Per-library recipes — `@angular/localize`,
Transloco, ngx-translate, raw `Intl.*` — are in
[i18n-integration.md](./i18n-integration.md), with runnable versions
at [`../examples/with-transloco.component.ts`](../examples/with-transloco.component.ts)
and [`../examples/with-ngx-translate.component.ts`](../examples/with-ngx-translate.component.ts).

## Offer a different control for a long locale list

A listbox of 436 locales is a poor experience. Bind a sibling control
to the same signal and hide the select's own button, or replace the
trigger glyph entirely:

- [`../examples/sibling-select.component.ts`](../examples/sibling-select.component.ts) — a native `<select>` sharing `[(value)]`.
- [`../examples/sibling-buttons.component.ts`](../examples/sibling-buttons.component.ts) — a short toggle-button row.
- [`../examples/combobox.component.ts`](../examples/combobox.component.ts) — `<datalist>` type-ahead over the full table.

Projecting your own trigger content is covered in
[custom-rendering.md](./custom-rendering.md); the class hooks you need
to style any of these are in [styling.md](./styling.md).

## Preview RTL without shipping a translation

```html
<lily-locale-chooser
    label="Language"
    [locales]="['en', 'ar', 'he', 'fa', 'ur', 'ps']"
    [(value)]="locale"
/>
```

Switching to any of these flips `dir="rtl"` on `<html>` immediately,
which is enough to find every hard-coded `left` / `margin-left` in
your stylesheet before a single string is translated. See
[`../examples/rtl-demo.component.ts`](../examples/rtl-demo.component.ts)
and [rtl.md](./rtl.md).

---

If a recipe misbehaves, check [troubleshooting.md](./troubleshooting.md)
first; the binding contract behind all of these is
[../spec/index.md](../spec/index.md), and the user guide is
[../index.md](../index.md).

---

Lily™ and Lily Design System™ are trademarks.
