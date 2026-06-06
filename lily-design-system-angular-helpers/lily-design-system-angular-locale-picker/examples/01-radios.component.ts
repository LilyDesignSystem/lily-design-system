/*
    01. Default radio group.

    The simplest possible mount. Each radio renders with its locale's
    pretty name (from the built-in `locales.tsv` table), wrapped in a
    <label lang="…"> so screen readers pronounce each in the right
    language.

    Outcome: a fieldset with three radios. Picking one writes
    <html lang="…" dir="…"> and updates the bindable `value` signal.
*/
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { LocalePicker } from "../locale-picker.component";

@Component({
    selector: "example-radios",
    standalone: true,
    imports: [LocalePicker],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <lily-locale-picker
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
