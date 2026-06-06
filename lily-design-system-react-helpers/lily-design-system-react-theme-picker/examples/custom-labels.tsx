"use client";

/*
    Example 4 — Custom labels.

    Default labels title-case the slug ("light" → "Light"). Pass
    `themeLabels` to override per-slug — useful for i18n or for slugs that
    don't gracefully title-case (e.g. country-prefixed Lily theme slugs).
*/

import { ThemePicker } from "../ThemePicker";

const labels: Record<string, string> = {
    light: "Clair",
    dark: "Sombre",
    "united-kingdom-national-health-service-england-for-patients":
        "NHS England (patients)",
    "united-kingdom-national-health-service-england-for-practitioners":
        "NHS England (practitioners)",
};

export function CustomLabelsExample() {
    return (
        <ThemePicker
            label="Thème"
            themesUrl="/assets/themes/"
            themes={[
                "light",
                "dark",
                "united-kingdom-national-health-service-england-for-patients",
                "united-kingdom-national-health-service-england-for-practitioners",
            ]}
            themeLabels={labels}
        />
    );
}

export default CustomLabelsExample;
