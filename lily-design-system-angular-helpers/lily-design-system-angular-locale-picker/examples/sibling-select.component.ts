/*
    Native <select> rendered as a sibling widget bound to the same
    [(value)] signal.

    The helper still owns the lifecycle (lang/dir/storage/change) but
    we hide its UI and present a native <select> instead. Best for
    >~12 locales, when the design system uses dropdowns for setting
    controls, or when you specifically want the native control's
    platform behaviour back: OS pickers on mobile, reliable value
    announcement, and consistent screen-reader support that a custom
    listbox does not match. See docs/accessibility.md.

    The helper's projected <ng-template> replaces the button glyph
    only — it cannot replace the listbox — so swapping the whole
    affordance means this sibling-widget pattern.

    `className="locale-chooser-hidden"` must hide the helper COMPLETELY
    (`display: none`), not with an `.sr-only` clip-path recipe: the
    <select> below is the real control, and a visually-hidden-but-
    AT-exposed globe button would be a duplicate.
*/
import {
    ChangeDetectionStrategy,
    Component,
    signal,
} from "@angular/core";
import {
    LocaleChooser,
    bcp47LocaleTag,
    localeName,
} from "../locale-chooser.component";
import { defaultLocaleLabels } from "../locales";

@Component({
    selector: "example-sibling-select",
    standalone: true,
    imports: [LocaleChooser],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <!-- The hidden helper owns the lifecycle. -->
        <lily-locale-chooser
            label="Language"
            [locales]="locales"
            [(value)]="locale"
            storageKey="app-locale"
            [detectFromNavigator]="true"
            className="locale-chooser-hidden"
        />

        <!-- Sibling <select> bound to the same signal. -->
        <label class="locale-chooser-select-label">
            Language
            <select
                class="locale-chooser-select"
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
export class SiblingSelectExample {
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
