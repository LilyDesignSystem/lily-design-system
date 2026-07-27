/*
    Follow the OS `prefers-color-scheme`.

    Set `detectFromSystem` and the select resolves the OS colour-scheme
    preference to `"dark"` or `"light"` on first visit — but only if
    that slug is actually in your `themes` list, and only when nothing
    higher in the resolution order supplied a value:

        value > storage > detectFromSystem > defaultValue > "light" > themes[0]

    So a returning visitor's stored choice still wins: the OS is a
    first-visit default, not an override. `matchSystemTheme` is exported
    if you want the same resolution outside the component (server-side
    rendering, a route guard, a test).

    If you want the select to *track* the OS preference over time
    (re-apply when the user toggles their system setting), add a
    `matchMedia.addEventListener("change", …)` listener and write to
    the `[(value)]`-bound signal.
*/
import {
    ChangeDetectionStrategy,
    Component,
    signal,
} from "@angular/core";
import { ThemeChooser } from "../theme-chooser.component";

@Component({
    selector: "example-system-preference",
    standalone: true,
    imports: [ThemeChooser],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <lily-theme-chooser
            label="Theme"
            themesUrl="/assets/themes/"
            [themes]="['light', 'dark']"
            [detectFromSystem]="true"
            [(value)]="theme"
            storageKey="my-app:theme"
        />
    `,
})
export class SystemPreferenceExample {
    theme = signal("");
}
