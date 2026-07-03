/*
    06. Wiring Transloco.

    The select's bindable `value` is mirrored into Transloco's
    `TranslocoService.setActiveLang()` via the `(localeChange)` output.
    Every `{{ key | transloco }}` call in your templates re-evaluates
    automatically when the user picks a different locale.

    Prerequisites:
        pnpm add @jsverse/transloco

        // src/app/app.config.ts
        // import { provideTransloco } from "@jsverse/transloco";
        // export const appConfig: ApplicationConfig = {
        //   providers: [
        //     provideTransloco({
        //       config: {
        //         availableLangs: ["en", "fr", "ar"],
        //         defaultLang: "en",
        //       },
        //       loader: TranslocoHttpLoader,
        //     }),
        //   ],
        // };

    Outcome: choosing a locale calls `setActiveLang` which flips the
    runtime locale and triggers every transloco-bound template to
    re-render.
*/
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal,
} from "@angular/core";
// In a real app these come from @jsverse/transloco.
// import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { LocaleSelect } from "../locale-select.component";

// Demo-only stand-ins so this file compiles without Transloco installed.
class TranslocoService {
    private current = "en";
    getActiveLang() { return this.current; }
    setActiveLang(lang: string) { this.current = lang; }
}

@Component({
    selector: "example-with-transloco",
    standalone: true,
    imports: [LocaleSelect],
    providers: [TranslocoService],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <lily-locale-select
            label="Language"
            [locales]="['en', 'fr', 'ar']"
            [localeLabels]="{
                en: 'English',
                fr: 'Français',
                ar: 'العربية'
            }"
            [(value)]="current"
            storageKey="app-locale"
            [detectFromNavigator]="true"
            (localeChange)="onLocaleChange($event)"
        />

        <h1>Hello, {{ current() }}</h1>
        <p>
            In a real Transloco app, replace this with
            <code>{{ '{{ "home.body" | transloco }}' }}</code>.
        </p>
    `,
})
export class WithTranslocoExample {
    private transloco = inject(TranslocoService);
    current = signal<string>(this.transloco.getActiveLang());

    onLocaleChange(code: string): void {
        this.transloco.setActiveLang(code);
    }
}
