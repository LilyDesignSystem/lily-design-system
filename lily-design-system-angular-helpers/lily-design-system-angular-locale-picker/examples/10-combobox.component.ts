/*
    10. Combobox with native <datalist> type-ahead.

    For long locale lists (50+) where a radio group is impractical
    and a <select> is too tedious to scroll. Uses an `<input list>` +
    `<datalist>` for native, accessible type-ahead. The picker
    validates the typed value against the supported set before
    applying.

    Outcome: type "Fr" — the combobox shows "Français", "Français
    (Canada)", "Frisian", etc. Pick one and the picker applies.

    Browser support note: native <datalist> is widely supported but
    iOS Safari's UX is limited. For a fully APG-compliant combobox,
    swap in Lily's headless Combobox primitive.
*/
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    signal,
} from "@angular/core";
import {
    LocalePicker,
    bcp47LocaleTag,
} from "../locale-picker.component";
import { defaultLocaleLabels } from "../locales";

@Component({
    selector: "example-combobox",
    standalone: true,
    imports: [LocalePicker],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <lily-locale-picker
            label="Language"
            [locales]="locales()"
            [(value)]="locale"
            storageKey="combobox-locale"
            className="sr-only"
        />

        <label class="locale-picker-combobox-label">
            Language
            <input
                type="text"
                list="locale-options"
                placeholder="Start typing a language…"
                aria-label="Language"
                [value]="inputValue() || labelFor(locale())"
                (input)="inputValue.set($any($event.target).value)"
                (change)="onTyped($any($event.target).value)"
            />
        </label>
        <datalist id="locale-options">
            @for (l of locales(); track l) {
                <option
                    [value]="labelFor(l)"
                    [attr.lang]="tagFor(l)"
                >{{ l }}</option>
            }
        </datalist>

        <p>
            Selected locale: <code>{{ locale() }}</code>
            ({{ labelFor(locale()) }})
        </p>
    `,
})
export class ComboboxExample {
    // All 436 locale codes from the built-in table.
    readonly locales = signal<string[]>(Object.keys(defaultLocaleLabels));

    locale = signal("en");
    inputValue = signal("");

    tagFor(l: string): string {
        return bcp47LocaleTag(l);
    }

    labelFor(l: string): string {
        return defaultLocaleLabels[l] ?? l;
    }

    onTyped(typed: string): void {
        const match = this.locales().find(
            (l) => this.labelFor(l).toLowerCase() === typed.toLowerCase(),
        );
        if (match) {
            this.locale.set(match);
            this.inputValue.set("");
        }
    }
}
