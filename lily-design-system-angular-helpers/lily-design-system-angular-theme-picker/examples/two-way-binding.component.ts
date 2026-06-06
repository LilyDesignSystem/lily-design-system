/*
    Example 2 — Two-way binding + (themeChange) handler.

    `[(value)]` exposes the active slug to surrounding code.
    `(themeChange)` fires after each apply, which is the right hook for
    analytics, telling the server, or notifying a sibling component.
*/
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { ThemePicker } from "../theme-picker.component";

@Component({
    selector: "example-two-way-binding",
    standalone: true,
    imports: [ThemePicker],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <lily-theme-picker
            label="Theme"
            themesUrl="/assets/themes/"
            [themes]="['light', 'dark', 'abyss']"
            [(value)]="theme"
            (themeChange)="trackThemeChange($event)"
        />

        <p>Current theme: <strong>{{ theme() || "(resolving…)" }}</strong></p>
    `,
})
export class TwoWayBindingExample {
    theme = signal("");

    trackThemeChange(slug: string): void {
        // e.g. fetch("/api/preferences", { method: "POST", body: JSON.stringify({ theme: slug }) });
        console.info("theme changed:", slug);
    }
}
