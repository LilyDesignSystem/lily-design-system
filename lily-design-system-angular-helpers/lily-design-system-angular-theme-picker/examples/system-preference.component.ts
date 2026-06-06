/*
    Example 8 — Follow the OS `prefers-color-scheme`.

    The picker has no opinion about light vs. dark; it just owns the
    selection contract. To make the first-visit default follow the
    OS, resolve the media query yourself and pass the resolved slug
    as `defaultValue`. The user can still pick anything they like
    afterwards, and the choice persists via `storageKey`.

    If you want the picker to *track* the OS preference over time
    (re-apply when the user toggles their system setting), add a
    `matchMedia.addEventListener("change", …)` listener and write to
    the `[(value)]`-bound signal.
*/
import {
    ChangeDetectionStrategy,
    Component,
    signal,
} from "@angular/core";
import { ThemePicker } from "../theme-picker.component";

@Component({
    selector: "example-system-preference",
    standalone: true,
    imports: [ThemePicker],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <lily-theme-picker
            label="Theme"
            themesUrl="/assets/themes/"
            [themes]="['light', 'dark']"
            [defaultValue]="prefersDark ? 'dark' : 'light'"
            [(value)]="theme"
            storageKey="my-app:theme"
        />
    `,
})
export class SystemPreferenceExample {
    readonly prefersDark =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-color-scheme: dark)").matches;

    theme = signal("");
}
