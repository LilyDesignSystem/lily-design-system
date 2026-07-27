/*
    Default rendering: globe icon button + APG listbox.

    The simplest possible mount. The button shows a globe glyph; press
    it (or ArrowDown / Enter / Space) to open a listbox of three
    options. Each option renders with its locale's pretty name (from
    the built-in `locales.tsv` table), carrying a <li lang="…"> so
    screen readers pronounce each in the right language.

    Outcome: picking an option writes <html lang="…" dir="…">, updates
    the bindable `value` signal, closes the list, and returns focus to
    the button.

    Note: this package ships zero CSS, so the <ul> sits in normal flow
    and pushes content down when open. Overlay it in your own stylesheet
    with `position: absolute` on .locale-chooser-list plus
    `position: relative` on .locale-chooser — see index.md.

    The status line is part of the basic pattern, not an add-on.

    The closed control shows only the globe glyph — never the active
    locale name. So neither a sighted user nor a screen-reader user
    can tell which locale is in effect without opening the list. The
    <p class="locale-chooser-status"> below compensates: it names the
    active locale in text, for everyone.

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
import { LocaleChooser, localeName } from "../locale-chooser.component";

@Component({
    selector: "example-basic",
    standalone: true,
    imports: [LocaleChooser],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <lily-locale-chooser
            label="Choose your language"
            [locales]="['en', 'fr', 'ar']"
            [(value)]="locale"
        />

        <p class="locale-chooser-status" aria-live="polite">
            Active language: {{ nameFor(locale()) }}
        </p>
    `,
})
export class BasicExample {
    locale = signal("en");

    nameFor = localeName;
}
