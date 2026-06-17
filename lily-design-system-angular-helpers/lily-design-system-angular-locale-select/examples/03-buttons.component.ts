/*
    03. Toggle-button group via a sibling widget.

    A button group renders the locales inline with `aria-pressed` to
    indicate the active locale. Use it when you want a more prominent,
    tap-friendly affordance than a radio group on small screens, or
    when you want to render flags / abbreviations.

    Outcome: a horizontal <ul> of <button>s bound to the select's
    `[(value)]` signal. The select still drives lang/dir/change.
*/
import {
    ChangeDetectionStrategy,
    Component,
    signal,
} from "@angular/core";
import {
    LocaleSelect,
    bcp47LocaleTag,
    isRtlLocale,
} from "../locale-select.component";
import { defaultLocaleLabels } from "../locales";

@Component({
    selector: "example-buttons",
    standalone: true,
    imports: [LocaleSelect],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <lily-locale-select
            label="Language"
            [locales]="locales"
            [(value)]="locale"
            className="sr-only"
        />

        <ul class="locale-select-list" role="list">
            @for (l of locales; track l) {
                <li>
                    <button
                        type="button"
                        [attr.aria-pressed]="locale() === l"
                        [attr.lang]="tagFor(l)"
                        [attr.dir]="isRtl(l) ? 'rtl' : 'ltr'"
                        [attr.title]="labelFor(l)"
                        (click)="locale.set(l)"
                    >{{ SHORT[l] ?? l.toUpperCase() }}</button>
                </li>
            }
        </ul>

        <p>Selected: <code>{{ locale() }}</code></p>
    `,
})
export class ButtonsExample {
    readonly locales = ["en", "fr", "es", "de", "ar", "he"];

    // Short two-letter codes for compact display.
    readonly SHORT: Record<string, string> = {
        en: "EN",
        fr: "FR",
        es: "ES",
        de: "DE",
        ar: "ع",
        he: "ע",
    };

    locale = signal("en");

    tagFor(l: string): string {
        return bcp47LocaleTag(l);
    }

    isRtl(l: string): boolean {
        return isRtlLocale(l);
    }

    labelFor(l: string): string {
        return defaultLocaleLabels[l] ?? l;
    }
}
