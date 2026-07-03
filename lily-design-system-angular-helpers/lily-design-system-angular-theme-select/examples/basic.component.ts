/*
    Example 1 — Basic usage.

    The minimum viable select: a label, a themes directory, and a slug
    list. The select resolves "light" as the initial active theme
    (since "light" is in the list), sets data-theme="light" on <html>,
    and injects a <link rel="stylesheet"> pointing at
    /assets/themes/light.css.
*/
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ThemeSelect } from "../theme-select.component";

@Component({
    selector: "example-basic",
    standalone: true,
    imports: [ThemeSelect],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <lily-theme-select
            label="Theme"
            themesUrl="/assets/themes/"
            [themes]="['light', 'dark', 'abyss']"
        />
    `,
})
export class BasicExample {}
