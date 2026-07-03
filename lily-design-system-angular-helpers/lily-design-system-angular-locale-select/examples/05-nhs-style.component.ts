/*
    05. NHS UK-style language banner.

    Mirrors the NHS UK Design System's pattern of placing a language
    chooser in a top utility banner. The banner uses sibling-button
    markup but with the `locale-select` class hook (via `className`)
    so consumer CSS can target it without duplication.

    Outcome: a <header> banner with the select rendered as a horizontal
    button list. Each entry shows the language in its own script.
*/
import {
    ChangeDetectionStrategy,
    Component,
    signal,
} from "@angular/core";
import {
    LocaleSelect,
    bcp47LocaleTag,
} from "../locale-select.component";

@Component({
    selector: "example-nhs-style",
    standalone: true,
    imports: [LocaleSelect],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <header class="utility-banner" aria-label="Site utilities">
            <span>NHS</span>

            <lily-locale-select
                label="Language"
                [locales]="locales"
                [localeLabels]="NATIVE"
                [(value)]="locale"
                storageKey="nhs-locale"
                className="utility-banner-languages sr-only"
            />

            <ul class="locale-select-list" role="list">
                @for (l of locales; track l) {
                    <li>
                        <button
                            type="button"
                            [attr.aria-pressed]="locale() === l"
                            [attr.lang]="tagFor(l)"
                            (click)="locale.set(l)"
                        >{{ NATIVE[l] ?? l }}</button>
                    </li>
                }
            </ul>
        </header>

        <main [attr.lang]="tagFor(locale())">
            <h1>Welcome</h1>
            <p>Current locale: <code>{{ locale() }}</code></p>
        </main>
    `,
})
export class NhsStyleExample {
    readonly locales = [
        "en", "cy", "gd", "ga",
        "fr", "pl", "ur", "bn", "zh_Hant",
    ];

    // Endonyms — each language in its own script.
    readonly NATIVE: Record<string, string> = {
        en: "English",
        cy: "Cymraeg",
        gd: "Gàidhlig",
        ga: "Gaeilge",
        fr: "Français",
        pl: "Polski",
        ur: "اردو",
        bn: "বাংলা",
        zh_Hant: "繁體中文",
    };

    locale = signal("en");

    tagFor(l: string): string {
        return bcp47LocaleTag(l);
    }
}
