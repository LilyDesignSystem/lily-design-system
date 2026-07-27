/*
    Combobox with native <datalist> type-ahead.

    For long locale lists (50+) where the helper's own listbox is
    impractical to scroll. The helper ships a listbox, not a combobox:
    its only text-driven affordance is the APG prefix typeahead, which
    does not filter. So here we hide the helper's UI entirely and drive
    its [(value)] from an `<input list>` + `<datalist>` instead.

    Outcome: type "Fr" — the combobox shows "Français", "Français
    (Canada)", "Frisian", etc. Pick one and the select applies.

    Note on `className="locale-chooser-hidden"`: the helper still owns
    lang/dir/storage/localeChange, but its button and listbox must be
    hidden COMPLETELY here — `display: none`, not an `.sr-only`
    clip-path recipe. The datalist input below is the real control; a
    visually-hidden-but-AT-exposed globe button would give screen-reader
    and keyboard users a second, duplicate language control that does
    the same job.

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
    LocaleChooser,
    bcp47LocaleTag,
} from "../locale-chooser.component";
import { defaultLocaleLabels } from "../locales";

@Component({
    selector: "example-combobox",
    standalone: true,
    imports: [LocaleChooser],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <lily-locale-chooser
            label="Language"
            [locales]="locales()"
            [(value)]="locale"
            storageKey="combobox-locale"
            className="locale-chooser-hidden"
        />

        <label class="locale-chooser-combobox-label">
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
