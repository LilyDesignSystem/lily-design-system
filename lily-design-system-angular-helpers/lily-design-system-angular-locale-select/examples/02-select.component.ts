/*
    02. Native <select> rendered as a sibling widget bound to the same
    [(value)] signal.

    The select still owns the lifecycle (lang/dir/storage/change) but
    we visually hide its UI and present a <select> instead. Best for
    >~12 locales or when the design system uses dropdowns for setting
    controls.

    A future ThemeSelect / LocaleSelect revision will expose
    <ng-content> projection so the slot can replace the default UI
    in-place; today, the sibling-widget pattern is the canonical
    workaround.
*/
import {
    ChangeDetectionStrategy,
    Component,
    signal,
} from "@angular/core";
import {
    LocaleSelect,
    bcp47LocaleTag,
    localeName,
} from "../locale-select.component";
import { defaultLocaleLabels } from "../locales";

@Component({
    selector: "example-select",
    standalone: true,
    imports: [LocaleSelect],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <!-- The hidden select owns the lifecycle. -->
        <lily-locale-select
            label="Language"
            [locales]="locales"
            [(value)]="locale"
            storageKey="app-locale"
            [detectFromNavigator]="true"
            className="sr-only"
        />

        <!-- Sibling <select> bound to the same signal. -->
        <label class="locale-select-select-label">
            Language
            <select
                class="locale-select-select"
                aria-label="Language"
                [value]="locale()"
                (change)="locale.set($any($event.target).value)"
            >
                @for (l of locales; track l) {
                    <option
                        [value]="l"
                        [attr.lang]="tagFor(l)"
                    >{{ labelFor(l) }}</option>
                }
            </select>
        </label>

        <p>Selected locale: <code>{{ locale() }}</code></p>
    `,
})
export class SelectExample {
    readonly locales = [
        "en", "en_US", "en_GB",
        "fr", "fr_CA",
        "es", "es_419",
        "de",
        "zh_Hans", "zh_Hant",
        "ja", "ko",
        "ar", "he", "fa", "ur",
        "hi", "bn",
        "pt", "pt_BR",
        "ru", "tr", "vi",
    ];

    locale = signal("en");

    tagFor(l: string): string {
        return bcp47LocaleTag(l);
    }

    labelFor(l: string): string {
        return defaultLocaleLabels[l] ?? localeName(l);
    }
}
