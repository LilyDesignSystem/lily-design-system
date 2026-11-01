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
    "adobe-spectrum",
    "ant-design",
    "aqua",
    "atlassian",
    "australia-agriculture-design-system",
    "autumn",
    "black",
    "brazil-padrao-digital-de-governo",
    "bumblebee",
    "business",
    "canada-government-of-canada-design-system",
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
    "european-union-europa-component-library",
    "excel",
    "fantasy",
    "fluent",
    "forest",
    "garden",
    "github-primer",
    "halloween",
    "ibm-carbon",
    "japan-digital-agency-design-system",
    "lemonade",
    "light",
    "linear",
    "lofi",
    "luxury",
    "mozilla-protocol",
    "night",
    "nord",
    "notion",
    "pastel",
    "retro",
    "salesforce",
    "sap-fiori",
    "silk",
    "singapore-government-design-system",
    "sunset",
    "synthwave",
    "valentine",
    "vercel",
    "winter",
    "wireframe",
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
