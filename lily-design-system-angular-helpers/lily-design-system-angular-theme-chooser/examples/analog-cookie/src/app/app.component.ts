// src/app/app.component.ts
//
// Root component that reads the server-resolved initial theme via the
// INITIAL_THEME injection token, binds it to the select via
// [(value)], and POSTs to /api/theme on (themeChange) so the next
// SSR request sees the new cookie.

import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal,
} from "@angular/core";
import { ThemeChooser } from "../../../theme-chooser.component";
import { INITIAL_THEME } from "./tokens/initial-theme";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [ThemeChooser],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <header>
            <lily-theme-chooser
                label="Theme"
                themesUrl="/assets/themes/"
                [themes]="themes"
                [(value)]="theme"
                (themeChange)="persistThemeCookie($event)"
            />
        </header>

        <main>
            <router-outlet />
        </main>
    `,
})
export class App {
    readonly themes = ["light", "dark", "abyss"];
    theme = signal(inject(INITIAL_THEME));

    async persistThemeCookie(slug: string): Promise<void> {
        if (typeof fetch === "undefined") return;
        await fetch("/api/theme", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ theme: slug }),
        });
    }
}
