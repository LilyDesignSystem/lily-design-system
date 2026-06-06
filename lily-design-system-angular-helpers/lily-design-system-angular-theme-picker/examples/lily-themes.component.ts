/*
    Example 9 — All 41 Lily / DaisyUI themes.

    This is the full catalog shipped in `../../themes/`. Drop them
    all into `src/assets/themes/` and the picker will swap between
    them. "light" remains the default because it is in the list.
*/
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ThemePicker } from "../theme-picker.component";

@Component({
    selector: "example-lily-themes",
    standalone: true,
    imports: [ThemePicker],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <lily-theme-picker
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
        "night",
        "nord",
        "pastel",
        "retro",
        "silk",
        "sunset",
        "synthwave",
        "valentine",
        "winter",
        "wireframe",
        "united-kingdom-national-health-service-england-for-patients",
        "united-kingdom-national-health-service-england-for-practitioners",
        "united-kingdom-national-health-service-scotland-for-patients",
        "united-kingdom-national-health-service-scotland-for-practitioners",
        "united-kingdom-national-health-service-wales-for-patients",
        "united-kingdom-national-health-service-wales-for-practitioners",
    ];
}
