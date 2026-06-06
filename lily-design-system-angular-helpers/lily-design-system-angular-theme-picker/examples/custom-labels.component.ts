/*
    Example 4 — Custom labels.

    Default labels title-case the slug ("light" → "Light"). Pass
    `themeLabels` to override per-slug — useful for i18n or for slugs
    that don't gracefully title-case (e.g. country-prefixed Lily theme
    slugs).
*/
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ThemePicker } from "../theme-picker.component";

@Component({
    selector: "example-custom-labels",
    standalone: true,
    imports: [ThemePicker],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <lily-theme-picker
            label="Thème"
            themesUrl="/assets/themes/"
            [themes]="[
                'light',
                'dark',
                'united-kingdom-national-health-service-england-for-patients',
                'united-kingdom-national-health-service-england-for-practitioners',
            ]"
            [themeLabels]="labels"
        />
    `,
})
export class CustomLabelsExample {
    readonly labels: Record<string, string> = {
        light: "Clair",
        dark: "Sombre",
        "united-kingdom-national-health-service-england-for-patients":
            "NHS England (patients)",
        "united-kingdom-national-health-service-england-for-practitioners":
            "NHS England (practitioners)",
    };
}
