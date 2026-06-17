/*
    01. Default select.

    The simplest possible mount. Each option renders with its locale's
    pretty name (from the built-in `locales.tsv` table), carrying a
    <option lang="…"> so screen readers pronounce each in the right
    language.

    Outcome: a select with three options. Picking one writes
    <html lang="…" dir="…"> and updates the bindable `value` signal.
*/
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { LocaleSelect } from "../locale-select.component";

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

        <p>Selected locale: <code>{{ locale() }}</code></p>
    `,
})
export class RadiosExample {
    locale = signal("en");
}
