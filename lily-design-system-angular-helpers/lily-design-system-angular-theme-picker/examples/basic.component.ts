/*
    Example 1 — Basic usage.

    The minimum viable select: a label, a themes directory, and a slug
    list. The select resolves "light" as the initial active theme
    (since "light" is in the list), sets data-theme="light" on <html>,
    and injects a <link rel="stylesheet"> pointing at
    /assets/themes/light.css.

    The status line is part of the basic pattern, not an add-on.

    The control is an icon button that opens a listbox. Closed, it
    shows only the half-circle glyph — it never names the active theme,
    visually or in the accessibility tree, since its accessible name is
    the static aria-label. So a user returning to the page has no way
    to learn which theme is in effect without opening the list. The
    <p class="theme-chooser-status"> below compensates: it names the
    active theme in text, for everyone.

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
    the #themeChooser template reference, so the status line shows the
    same human label as the option ("Abyss", not "abyss").

    One more thing this example does NOT ship, because the package
    ships zero CSS: positioning for the listbox. Without
    `position: relative` on .theme-chooser and `position: absolute` on
    .theme-chooser-list, the open list pushes page content around. See
    docs/styling.md.
*/
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { ThemeChooser } from "../theme-chooser.component";

@Component({
    selector: "example-basic",
    standalone: true,
    imports: [ThemeChooser],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <lily-theme-chooser
            #themeChooser
            label="Theme"
            themesUrl="/assets/themes/"
            [themes]="['light', 'dark', 'abyss']"
            [(value)]="theme"
        />

        <p class="theme-chooser-status" aria-live="polite">
            Active theme: {{ themeChooser.labelFor(theme()) }}
        </p>
    `,
})
export class BasicExample {
    theme = signal("");
}
