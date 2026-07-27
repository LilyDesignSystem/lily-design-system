/*
    Wiring ngx-translate.

    `TranslateService.use(code)` is the imperative locale switcher.
    The select calls it from its `(localeChange)` handler. Templates
    use the `translate` pipe.

    Prerequisites:
        pnpm add @ngx-translate/core @ngx-translate/http-loader

        // src/app/app.config.ts
        // import { provideTranslateService, TranslateLoader } from "@ngx-translate/core";
        // export const appConfig: ApplicationConfig = {
        //   providers: [
        //     provideTranslateService({
        //       loader: { provide: TranslateLoader, useFactory: ... },
        //     }),
        //   ],
        // };

    Outcome: choosing a locale calls `translate.use(code)`, which
    fetches the message bundle if it isn't loaded yet, and notifies
    every `translate` pipe in the template.
*/
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal,
} from "@angular/core";
// In a real app these come from @ngx-translate/core.
// import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { LocaleChooser } from "../locale-chooser.component";

// Demo-only stand-ins so this file compiles without ngx-translate.
class TranslateService {
    currentLang = "en";
    use(lang: string) { this.currentLang = lang; }
}

@Component({
    selector: "example-with-ngx-translate",
    standalone: true,
    imports: [LocaleChooser],
    providers: [TranslateService],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <lily-locale-chooser
            label="Language"
            [locales]="['en', 'fr', 'ar']"
            [(value)]="current"
            storageKey="app-locale"
            (localeChange)="onLocaleChange($event)"
        />

        <h1>Hello, {{ current() }}</h1>
        <p>
            In a real ngx-translate app, replace this with
            <code>{{ '{{ "home.body" | translate }}' }}</code>.
        </p>
    `,
})
export class WithNgxTranslateExample {
    private translate = inject(TranslateService);
    current = signal<string>(this.translate.currentLang);

    onLocaleChange(code: string): void {
        this.translate.use(code);
    }
}
