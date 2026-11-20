"use client";

/*
    Example 9 — All 63 Lily reference themes.

    This is the full catalog shipped in `../../themes/`. Drop them all
    into `public/assets/themes/` and the select will swap between them.
    "light" remains the default because it is in the list.
*/

import { ThemePicker } from "../ThemePicker";

const themes = [
    "abyss",
    "acid",
    "aqua",
    "autumn",
    "black",
    "bumblebee",
    "business",
    "cappuccino",
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
    "adobe-spectrum",
    "ant-design",
    "atlassian",
    "australia-agriculture-design-system",
    "brazil-padrao-digital-de-governo",
    "canada-government-of-canada-design-system",
    "european-union-europa-component-library",
    "excel",
    "fluent",
    "github-primer",
    "united-kingdom-government-digital-service",
    "ibm-carbon",
    "japan-digital-agency-design-system",
    "linear",
    "mozilla-protocol",
    "united-kingdom-national-health-service-england-for-patients",
    "united-kingdom-national-health-service-england-for-practitioners",
    "united-kingdom-national-health-service-scotland-for-patients",
    "united-kingdom-national-health-service-scotland-for-practitioners",
    "united-kingdom-national-health-service-wales-for-patients",
    "united-kingdom-national-health-service-wales-for-practitioners",
    "notion",
    "salesforce",
    "sap-fiori",
    "singapore-government-design-system",
    "united-states-web-design-system",
    "vercel",
];

export function LilyThemesExample() {
    return (
        <ThemePicker
            label="Lily theme"
            themesUrl="/assets/themes/"
            themes={themes}
            storageKey="lily:theme"
        />
    );
}

export default LilyThemesExample;
