/*
    Example 1 — Basic usage.

    The minimum viable select: a label, a themes directory, and a slug
    list. The select resolves "light" as the initial active theme
    (since "light" is in the list), sets data-theme="light" on <html>,
    and injects a <link rel="stylesheet"> pointing at
    /assets/themes/light.css.

    The status line is part of the basic pattern, not an add-on.

    The closed control is placeholder-pinned: it always reads "Theme",
    never the active theme name. That keeps it one word wide, but it
    means a screen-reader user focusing the control does not hear which
    theme is in effect, and no option in the open list is marked
    selected. The <p class="theme-select-status"> below compensates: it
    names the active theme in text, for everyone.

    Two deliberate choices:

    1. It is VISIBLE, not sr-only. Naming the current setting in plain
       text helps sighted and cognitively-impaired users too, and WCAG
       2.2 AAA favours it. If a design genuinely cannot spare the
       space, keep the element and the aria-live and hide it visually
       instead — see docs/styling.md for the .sr-only recipe. Do not
       simply drop it.

    2. aria-live="polite" announces MUTATIONS only, so this stays
       silent on first paint and speaks once on each subsequent
       change. That is exactly what we want: no greeting on load, a
       confirmation on every switch.

    labelFor() is the component's own label resolver, reached through
    the #themeSelect template reference, so the status line shows the
    same human label as the option ("Abyss", not "abyss").
*/
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { ThemeSelect } from "../theme-select.component";

@Component({
    selector: "example-basic",
    standalone: true,
    imports: [ThemeSelect],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <lily-theme-select
            #themeSelect
            label="Theme"
            themesUrl="/assets/themes/"
            [themes]="['light', 'dark', 'abyss']"
            [(value)]="theme"
        />

        <p class="theme-select-status" aria-live="polite">
            Active theme: {{ themeSelect.labelFor(theme()) }}
        </p>
    `,
})
export class BasicExample {
    theme = signal("");
}
