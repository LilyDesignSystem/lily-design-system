# Custom rendering

`LocaleChooser` exposes exactly one rendering escape hatch: a projected
`<ng-template>` that **replaces the glyph inside the trigger button**.

That is the whole surface, and the narrowness is deliberate. The
listbox — its `role`, its options, their per-option `lang`, the
`aria-selected` flags, the `aria-activedescendant` wiring, the
typeahead and arrow-key contract — is a custom APG widget the
component implements and tests. Letting consumers re-render it would
hand the accessibility contract back to them on every use, which is
precisely what this helper exists to prevent.

So: the glyph is yours, the listbox is the component's.

## The basic form

Project an `<ng-template>` as the component's content. It replaces the
default `<span class="locale-chooser-icon" aria-hidden="true">🌎︎</span>`
inside the button.

```html
<lily-locale-chooser label="Language" [locales]="locales" [(value)]="locale">
    <ng-template let-args>{{ args.labelFor(args.value) }}</ng-template>
</lily-locale-chooser>
```

The component queries the template with `contentChild(TemplateRef)` and
renders it through `NgTemplateOutlet`, so *any* projected
`<ng-template>` matches — no structural directive or template
reference name is required.

## The template context

The context is the exported `ChildArgs` type:

```ts
export type ChildArgs = {
    /** Currently selected locale code (consumer form, not BCP 47-normalised). */
    value: string;
    /** Is the listbox open? */
    open: boolean;
    /** Resolve a locale code to its display label. */
    labelFor: (locale: string) => string;
};
```

It is passed as `$implicit` **and** as named properties, so both
binding styles work:

```html
<!-- Whole object via $implicit -->
<ng-template let-args>{{ args.labelFor(args.value) }}</ng-template>

<!-- Individual named properties -->
<ng-template let-value="value" let-open="open" let-labelFor="labelFor">
    {{ labelFor(value) }}{{ open ? " ▴" : " ▾" }}
</ng-template>
```

Note that `value` is the **consumer-form** code, exactly as it appears
in the `locales` array — `pt_BR` stays `pt_BR`. Only the DOM write and
the per-option `lang` attribute go through `bcp47LocaleTag()`. If your
glyph displays a raw code rather than a label, decide deliberately
which form you want; see [bcp47.md](./bcp47.md#underscore-vs-hyphen).

Note also what is *not* in the context: no `locales`, no `setLocale`,
no `dir`. The template renders the button's inside, not a list of
choices, so it has nothing to iterate and nothing to select. To read or
write the selection from outside, use `[(value)]` and `(localeChange)`.

## Typed `let-` variables with `LocaleChooserIcon`

By default `let-args` is implicitly `any`. Add the exported
`LocaleChooserIcon` marker directive to get `ChildArgs` typed under
`strictTemplates`:

```ts
import {
    LocaleChooser,
    LocaleChooserIcon,
} from "./lily-design-system-angular-locale-chooser";

@Component({
    selector: "app-language",
    standalone: true,
    imports: [LocaleChooser, LocaleChooserIcon],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <lily-locale-chooser
            label="Language"
            [locales]="locales"
            [(value)]="locale"
        >
            <ng-template lilyLocaleChooserIcon let-args>
                {{ args.labelFor(args.value) }}
            </ng-template>
        </lily-locale-chooser>
    `,
})
export class LanguagePicker {
    readonly locales = ["en", "fr", "ar", "he"];
    locale = signal("");
}
```

The directive's selector is `ng-template[lilyLocaleChooserIcon]` and its
only member is an `ngTemplateContextGuard`. It exists for type-checking
and readability — the component's `contentChild(TemplateRef)` query
does not look for it, so a plain `<ng-template>` behaves identically at
runtime.

## Recipe: showing the active locale's label

The default globe says "this is a language control" but never says
*which* language is active — see
[accessibility.md](./accessibility.md#the-status-region-is-part-of-the-pattern).
One way to address that is to put the label in the button itself:

```html
<lily-locale-chooser label="Language" [locales]="locales" [(value)]="locale">
    <ng-template let-args>{{ args.labelFor(args.value) }}</ng-template>
</lily-locale-chooser>
```

Two things follow, and both matter:

1. The button is no longer icon-only, so it will be as wide as the
   longest label it displays. "English (United States)" and
   "Português (Brasil)" are not narrow. Budget layout space, or use the
   short-code recipe below.
2. The button now has visible text *and* an `aria-label`. In the
   accessibility tree `aria-label` wins, so a voice-control user
   speaking the visible words may fail to activate it. WCAG 2.5.3
   (Label in Name) wants the accessible name to contain the visible
   text. Either make `label` contain what is displayed, or keep the
   glyph and use the separate status-region pattern instead.

The status region remains the recommended approach precisely because it
sidesteps both problems.

## Recipe: a short code instead of the globe

A two-letter code is the common compromise — narrower than a label,
more informative than a globe:

```html
<lily-locale-chooser label="Language" [locales]="locales" [(value)]="locale">
    <ng-template let-value="value">
        <span class="locale-chooser-code">{{ value.slice(0, 2).toUpperCase() }}</span>
    </ng-template>
</lily-locale-chooser>
```

Two cautions. First, an uppercased base subtag is a *mnemonic*, not a
language name: "EN" does not distinguish `en-GB` from `en-US`, and for
some locales the code is opaque to the very users who need it (`he` for
Hebrew readers, `fa` for Persian readers). Endonyms — `עברית`, `فارسی` —
communicate better where width allows. Second, if the code is visible
text it is subject to the same WCAG 2.5.3 tension described above.

If you show a script that differs from the surrounding page, set `lang`
on your own span so assistive technology pronounces it correctly. The
component sets `lang` on each `<li role="option">`, but it sets nothing
on the button — projected content is yours to annotate.

## Recipe: reflecting open state

`open` lets the glyph respond to the listbox:

```html
<lily-locale-chooser label="Language" [locales]="locales" [(value)]="locale">
    <ng-template let-args>
        <span class="locale-chooser-caret" [class.is-open]="args.open" aria-hidden="true">
            {{ args.open ? "▴" : "▾" }}
        </span>
    </ng-template>
</lily-locale-chooser>
```

For CSS-only cases you don't need the template at all — the button
already carries `aria-expanded`, so
`.locale-chooser-button[aria-expanded="true"]` is available as a
selector, and a rotation reads better than a glyph swap:

```css
.locale-chooser-button[aria-expanded="true"] .locale-chooser-caret {
    transform: rotate(180deg);
}
```

Prefer `rotate()` over `scaleY(-1)` and keep any transition inside a
`prefers-reduced-motion: no-preference` query. Note that a caret is
direction-neutral, so unlike a horizontal chevron it needs no
`dir`-aware flip — see [rtl.md](./rtl.md#authoring-css-that-survives-both-directions).

## Recipe: respecting `localeLabels` with `labelFor`

Always resolve display text through `labelFor`, never through your own
lookup. `labelFor` walks the full resolution chain the component
documents — the consumer's `localeLabels` override first, then the
built-in `defaultLocaleLabels` table, then an opportunistic
`Intl.DisplayNames` lookup, then the raw code as a last resort:

```html
<lily-locale-chooser
    label="Language"
    [locales]="locales"
    [localeLabels]="{ en: 'English', cy: 'Cymraeg', ar: 'العربية' }"
    [(value)]="locale"
>
    <ng-template let-args>{{ args.labelFor(args.value) }}</ng-template>
</lily-locale-chooser>
```

Reaching past `labelFor` to `localeName()` or a private map is the
common way to get a button that disagrees with the option the user just
picked. `labelFor` is the same function the `<li>` elements use, so the
two can never drift.

## Accessibility rules for a custom glyph

The button is named **entirely** by `aria-label`, which comes from the
required `label` input. Nothing inside the button contributes to that
name when the content is hidden, and the component hides its own glyph
with `aria-hidden="true"`. Your projected content is not hidden
automatically.

- **Decorative content must stay effectively hidden.** Put
  `aria-hidden="true"` on the wrapping element; on inline SVG add
  `focusable="false"` too, so legacy engines don't put it in the tab
  order.
- **Text content will be announced in addition to the label**, and in
  some screen-reader/browser pairs the `aria-label` suppresses it
  entirely. Either outcome is a mismatch between what is seen and what
  is heard, so if you display text, make `label` contain it.
- **Never put interactive content inside the template.** The trigger is
  already a `<button>`; a nested button or link is invalid HTML and
  breaks both the click target and the keyboard contract.
- **`.locale-chooser-icon` is not rendered when a template is
  projected.** Any CSS written against that hook stops applying. Style
  your own element, or add the class yourself.

The wider naming discussion, the status-region pattern, and the
screen-reader behaviour matrix live in
[accessibility.md](./accessibility.md).

## What the template cannot do

- **Render options.** The listbox and its `<li role="option">` children
  are component-owned. There is no per-option template.
- **Change the ARIA contract.** `aria-haspopup`, `aria-expanded`,
  `aria-controls`, `role="listbox"`, `aria-activedescendant`,
  `aria-selected`, and the per-option `lang` are all emitted by the
  component regardless of what is projected.
- **Alter the keyboard contract.** Key handling lives on the button and
  the `<ul>`, not on projected content.
- **Opt out of the lifecycle.** Initial-value resolution, the
  `lang` / `dir` writes, persistence, navigator detection, and
  `localeChange` emission all run unchanged.

## The sibling-widget contract

If the icon-button-plus-listbox shape is wrong for your design — you
want a native `<select>`, a toggle-button group of flags or endonyms, a
filtering combobox over hundreds of locales — do not fight the
template. Keep `LocaleChooser` mounted so it owns the behaviour, hide
it, and bind your own widget to the same `[(value)]` signal.

The division of labour:

| The helper still owns | The sibling widget owns |
| --- | --- |
| `lang` / `dir` writes to `target` | The custom markup |
| `localStorage` persistence (`storageKey`) | The click / change → `signal.set(...)` plumbing |
| `navigator.languages` detection (`detectFromNavigator`) | Its own accessible name and keyboard behaviour |
| Initial-value resolution and `localeChange` emission | Its own labels, ordering, and filtering |

```ts
@Component({
    selector: "app-language-buttons",
    standalone: true,
    imports: [LocaleChooser],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <lily-locale-chooser
            label="Language"
            [locales]="locales"
            [(value)]="locale"
            storageKey="lily-locale"
            className="locale-chooser-hidden"
        />

        <div class="locale-button-group" role="group" [attr.aria-label]="groupLabel">
            @for (code of locales; track code) {
                <button
                    type="button"
                    [attr.lang]="code"
                    [attr.aria-pressed]="locale() === code"
                    (click)="locale.set(code)"
                >{{ code.toUpperCase() }}</button>
            }
        </div>
    `,
})
export class LanguageButtons {
    readonly locales = ["en", "cy", "ar"];
    readonly groupLabel = "Language";
    locale = signal("");
}
```

**The hiding rule is the part people get wrong.** `locale-chooser-hidden`
must resolve to `display: none`:

```css
.locale-chooser-hidden {
    display: none;
}
```

It must **not** be an `.sr-only` clip-path recipe. `.sr-only` keeps the
element in the accessibility tree and in the tab order by design — that
is its entire purpose. Apply it here and screen-reader and keyboard
users get *two* language controls: your visible one, plus the helper's
globe button announced as a second listbox that changes the same
setting. `display: none` removes the helper's UI from both trees while
its `effect()` keeps running, which is exactly the split this contract
wants.

`aria-hidden="true"` alone is not sufficient either: it hides the
control from assistive technology but leaves the button tabbable, which
strands keyboard users on a control they cannot perceive.

For the case where a native `<select>` is simply the better control —
long lists, mobile, form participation — read
[accessibility.md](./accessibility.md#when-a-native-select-is-the-better-choice)
before writing a sibling. It may be the right answer rather than a
fallback.

Runnable versions of every shape above live in the examples directory:
[`sibling-select.component.ts`](../examples/sibling-select.component.ts) (native `<select>`),
[`sibling-buttons.component.ts`](../examples/sibling-buttons.component.ts) (toggle-button group),
[`combobox.component.ts`](../examples/combobox.component.ts) (`<datalist>` typeahead over the full built-in
table), and [`nhs-style.component.ts`](../examples/nhs-style.component.ts) (an NHS UK-style language banner
with endonyms). See also [`basic.component.ts`](../examples/basic.component.ts) for the default
rendering, [`rtl-demo.component.ts`](../examples/rtl-demo.component.ts), [`scoped-target.component.ts`](../examples/scoped-target.component.ts),
[`analog-cookie.component.ts`](../examples/analog-cookie.component.ts), [`with-transloco.component.ts`](../examples/with-transloco.component.ts), and
[`with-ngx-translate.component.ts`](../examples/with-ngx-translate.component.ts).

## Sharing the selection across components

To react to locale changes from elsewhere, hoist the signal into a
service:

```ts
@Injectable({ providedIn: "root" })
export class LocaleStore {
    readonly current = signal<string>("");
}
```

```ts
@Component({
    standalone: true,
    imports: [LocaleChooser],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <lily-locale-chooser
            label="Language"
            [locales]="locales"
            [(value)]="store.current"
        />
    `,
})
export class Header {
    readonly locales = ["en", "fr", "ar"];
    constructor(public store: LocaleStore) {}
}
```

Sibling components write to `store.current` from anywhere; the select's
`effect()` applies the locale in response. Because `[(value)]` binds a
`model()` signal, the field must be a `WritableSignal<string>` — a
plain string property will not compile.

For wiring the selection into a translation library rather than just
the DOM, see [i18n-integration.md](./i18n-integration.md).

## Related

- [concepts.md](./concepts.md) — the mental model and lifecycle.
- [accessibility.md](./accessibility.md) — naming, the status region,
  keyboard contract.
- [rtl.md](./rtl.md) — what `dir="rtl"` changes, and direction-safe CSS.
- [bcp47.md](./bcp47.md) — tag normalisation and subtags.
- [ssr.md](./ssr.md) — server rendering and avoiding a locale flash.
- [i18n-integration.md](./i18n-integration.md) — Transloco,
  ngx-translate, `@angular/localize`, raw `Intl.*`.
- [spec/index.md §4.2](../spec/index.md#42-content-projection) — the
  canonical content-projection contract.
- [index.md](../index.md) — the user guide.

---

Lily™ and Lily Design System™ are trademarks.
