// Curated switchable themes (plan P3): NHS England for patients is the
// default visual reference; the rest demonstrate the runtime-swap
// contract in AGENTS/helpers.md. All 45 files under /themes/ work —
// this list is an editorial choice, not a technical limit.
export const themes = [
    "united-kingdom-national-health-service-england-for-patients",
    "united-kingdom-national-health-service-england-for-practitioners",
    "united-kingdom-national-health-service-scotland-for-patients",
    "united-kingdom-national-health-service-wales-for-patients",
    "australia-agriculture-design-system",
    "brazil-padrao-digital-de-governo",
    "canada-government-of-canada-design-system",
    "european-union-europa-component-library",
    "japan-digital-agency-design-system",
    "singapore-government-design-system",
    "united-kingdom-government-digital-service",
    "united-states-web-design-system",
    "adobe-spectrum",
    "mozilla-protocol",
    "light",
    "dark",
];

export const themeLabels: Record<string, string> = {
    "united-kingdom-national-health-service-england-for-patients": "NHS England (patients)",
    "united-kingdom-national-health-service-england-for-practitioners":
        "NHS England (practitioners)",
    "united-kingdom-national-health-service-scotland-for-patients": "NHS Scotland (patients)",
    "united-kingdom-national-health-service-wales-for-patients": "NHS Wales (patients)",
    "australia-agriculture-design-system": "AgDS (Australia)",
    "brazil-padrao-digital-de-governo": "gov.br DS",
    "canada-government-of-canada-design-system": "GC Design System",
    "european-union-europa-component-library": "ECL (European Commission)",
    "japan-digital-agency-design-system": "Digital Agency (Japan)",
    "singapore-government-design-system": "SGDS",
    "united-kingdom-government-digital-service": "GOV.UK GDS",
    "united-states-web-design-system": "USWDS",
    "adobe-spectrum": "Adobe Spectrum",
    "mozilla-protocol": "Mozilla Protocol",
    light: "Light",
    dark: "Dark",
};

export const defaultTheme = "united-kingdom-national-health-service-england-for-patients";
