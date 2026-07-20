/*
    Example 9 — All 45 Lily reference themes.

    This is the full catalog shipped in `../../themes/`. Drop them
    all into `src/assets/themes/` and the select will swap between
    them. "light" remains the default because it is in the list.
*/
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ThemeSelect } from "../theme-select.component";

@Component({
    selector: "example-lily-themes",
    standalone: true,
    imports: [ThemeSelect],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <lily-theme-select
            label="Lily theme"
            themesUrl="/assets/themes/"
            [themes]="themes"
            storageKey="lily:theme"
        />
    `,
})
export class LilyThemesExample {
    readonly themes = [
        "abyss",
        "acid",
        "adobe-spectrum",
        "aqua",
        "autumn",
        "black",
        "bumblebee",
        "business",
        "caramellatte",
        "cmyk",
        "coffee",
        "corporate",
        "cupcake",
        "cyberpunk",
        "dark",
        "dim",
        "dracula",
        "emerald",
        "fantasy",
        "forest",
        "garden",
        "halloween",
        "lemonade",
        "light",
        "lofi",
        "luxury",
        "mozilla-protocol",
        "night",
        "nord",
        "pastel",
        "retro",
        "silk",
        "sunset",
        "synthwave",
        "united-kingdom-government-digital-service",
        "valentine",
        "winter",
        "wireframe",
        "united-kingdom-national-health-service-england-for-patients",
        "united-kingdom-national-health-service-england-for-practitioners",
        "united-kingdom-national-health-service-scotland-for-patients",
        "united-kingdom-national-health-service-scotland-for-practitioners",
        "united-kingdom-national-health-service-wales-for-patients",
        "united-kingdom-national-health-service-wales-for-practitioners",
        "united-states-web-design-system",
    ];
}
