// Every stylesheet in static/assets/themes (65), in one list sorted alphabetically by the name shown (spec/theme-picker,
// "Order of themes"), sorted below with the platform's collation. Shared by the site header and the /demo/ pages.
const THEME_SLUGS: string[] = [
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
    "dark-high-contrast",
    "dim",
    "dracula",
    "emerald",
    "fantasy",
    "forest",
    "garden",
    "halloween",
    "lemonade",
    "light",
    "light-high-contrast",
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

// Labels where title-casing the slug reads wrongly ("IBM Carbon", not "Ibm Carbon") or where a public body's short name is
// what people look for ("NHS England (patients)"). The same as the picker bar's DEFAULT_THEME_LABELS; passed here too until
// the site depends on a picker-bar release that has them.
export const THEME_LABELS: Record<string, string> = {
    cmyk: "CMYK",
    "brazil-padrao-digital-de-governo": "Brazil Padrão Digital de Governo",
    "canada-government-of-canada-design-system": "Canada Government of Canada Design System",
    "github-primer": "GitHub Primer",
    "dark-high-contrast": "Dark High-Contrast",
    "ibm-carbon": "IBM Carbon",
    "light-high-contrast": "Light High-Contrast",
    "sap-fiori": "SAP Fiori",
    "united-kingdom-government-digital-service": "GOV.UK Design System",
    "united-kingdom-national-health-service-england-for-patients": "NHS England (patients)",
    "united-kingdom-national-health-service-england-for-practitioners":
        "NHS England (practitioners)",
    "united-kingdom-national-health-service-scotland-for-patients": "NHS Scotland (patients)",
    "united-kingdom-national-health-service-scotland-for-practitioners":
        "NHS Scotland (practitioners)",
    "united-kingdom-national-health-service-wales-for-patients": "NHS Wales (patients)",
    "united-kingdom-national-health-service-wales-for-practitioners": "NHS Wales (practitioners)",
    "united-states-web-design-system": "U.S. Web Design System",
};

const themeName = (slug: string): string =>
    THEME_LABELS[slug] ??
    slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

// Sorted by the name shown: base letters, numbers as numbers, ties by slug. No language is named, so the platform's
// default applies, as in the pickers. The published picker-bar does not sort yet; a release that does would agree.
const collator = new Intl.Collator(undefined, { sensitivity: "base", numeric: true });
export const THEMES: string[] = [...THEME_SLUGS].sort(
    (a, b) => collator.compare(themeName(a), themeName(b)) || (a < b ? -1 : a > b ? 1 : 0),
);
