/*
    01. Default select.

    The simplest possible mount. Each option renders with its locale's
    pretty name (from the built-in `locales.tsv` table), carrying a
    <option lang="…"> so screen readers pronounce each in the right
    language.

    Outcome: a select with three options. Picking one writes
    <html lang="…" dir="…"> and updates the bindable `value` signal.

    The status line is part of the basic pattern, not an add-on.

    The closed control is placeholder-pinned: it always reads "Choose
    your language", never the active locale name. That keeps it narrow,
    but it means a screen-reader user focusing the control does not
    hear which locale is in effect, and no option in the open list is
    marked selected. The <p class="locale-select-status"> below
    compensates: it names the active locale in text, for everyone.

    Three deliberate choices:

    1. It is VISIBLE, not sr-only. Naming the current setting in plain
       text helps sighted and cognitively-impaired users too, and WCAG
       2.2 AAA favours it. If a design genuinely cannot spare the
       space, keep the element and the aria-live and hide it visually
       instead — see docs/accessibility.md. Do not simply drop it.

    2. aria-live="polite" announces MUTATIONS only, so this stays
       silent on first paint and speaks once on each subsequent
       change. That is exactly what we want: no greeting on load, a
       confirmation on every switch.

    3. The status line carries NO lang override. The built-in labels in
       locales.tsv are ENGLISH names ("French", "Arabic"), so the whole
       sentence is English; marking the name as fr/ar would tell a
       screen reader to pronounce an English word with a French or
       Arabic voice. If you supply endonyms via [localeLabels]
       ({ fr: 'Français' }), wrap just the name in
       <span [attr.lang]="tagFor(locale())"> so WCAG 3.1.2 (Language of
       Parts) is satisfied for that fragment — bcp47LocaleTag is
       exported for exactly that.

    localeName() is the package's own exported label resolver, so the
    status line shows the same human label as the option ("French",
    not "fr").
*/
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { LocaleSelect, localeName } from "../locale-select.component";

@Component({
    selector: "example-radios",
    standalone: true,
    imports: [LocaleSelect],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <lily-locale-select
            label="Choose your language"
            [locales]="['en', 'fr', 'ar']"
            [(value)]="locale"
        />

        <p class="locale-select-status" aria-live="polite">
            Active language: {{ nameFor(locale()) }}
        </p>
    `,
})
export class RadiosExample {
    locale = signal("en");

    nameFor = localeName;
}
