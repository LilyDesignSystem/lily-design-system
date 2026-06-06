/*
    Example 1 — Basic usage.

    The minimum viable picker: a label, a themes directory, and a slug
    list. The picker resolves "light" as the initial active theme
    (since "light" is in the list), sets data-theme="light" on <html>,
    and injects a <link rel="stylesheet"> pointing at
    /assets/themes/light.css.
*/
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ThemePicker } from "../theme-picker.component";

@Component({
    selector: "example-basic",
    standalone: true,
    imports: [ThemePicker],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <lily-theme-picker
            label="Theme"
            themesUrl="/assets/themes/"
            [themes]="['light', 'dark', 'abyss']"
        />
    `,
})
export class BasicExample {}
