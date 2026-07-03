/*
    Example 6 — Zero-flicker switching via preloading.

    The default loading strategy fetches the active theme CSS on
    demand — fast, but the first switch to a not-yet-loaded theme
    incurs a network round-trip. To switch instantly, preload all
    theme CSS files via your own <link> tags in index.html. Each theme
    scopes its rules to :root[data-theme="<slug>"], so only the rules
    whose attribute matches the live one are applied.

    The select still mutates data-theme; the network round-trip is gone.

    IMPORTANT: when you preload, you can skip the managed <link>
    entirely by using a `target` that already has data-theme set, OR
    you can leave the managed <link> in place — its href will resolve
    to one of the already-cached stylesheets, so the network cost is
    just a 304.

    In Angular CLI place the preload tags in src/index.html; in Analog
    place them in index.html (the static shell).
*/
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ThemeSelect } from "../theme-select.component";

@Component({
    selector: "example-preloaded",
    standalone: true,
    imports: [ThemeSelect],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <!--
            In src/index.html, add:
              <link rel="stylesheet" href="/assets/themes/light.css">
              <link rel="stylesheet" href="/assets/themes/dark.css">
              <link rel="stylesheet" href="/assets/themes/abyss.css">
        -->
        <lily-theme-select
            label="Theme"
            themesUrl="/assets/themes/"
            [themes]="['light', 'dark', 'abyss']"
        />
    `,
})
export class PreloadedExample {}
