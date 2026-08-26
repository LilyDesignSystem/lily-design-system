// Curated switchable themes (plan P3): NHS England for patients is the
// default visual reference; the rest demonstrate the runtime-swap
// contract in AGENTS/helpers.md. All 45 files under /themes/ work —
// this list is an editorial choice, not a technical limit.
export const themes = [
  "united-kingdom-national-health-service-england-for-patients",
  "united-kingdom-national-health-service-england-for-practitioners",
  "united-kingdom-national-health-service-scotland-for-patients",
  "united-kingdom-national-health-service-wales-for-patients",
  "united-kingdom-government-digital-service",
  "united-states-web-design-system",
  "adobe-spectrum",
  "mozilla-protocol",
  "light",
  "dark",
];

export const themeLabels: Record<string, string> = {
  "united-kingdom-national-health-service-england-for-patients": "NHS England (patients)",
  "united-kingdom-national-health-service-england-for-practitioners": "NHS England (practitioners)",
  "united-kingdom-national-health-service-scotland-for-patients": "NHS Scotland (patients)",
  "united-kingdom-national-health-service-wales-for-patients": "NHS Wales (patients)",
  "united-kingdom-government-digital-service": "GOV.UK GDS",
  "united-states-web-design-system": "USWDS",
  "adobe-spectrum": "Adobe Spectrum",
  "mozilla-protocol": "Mozilla Protocol",
  light: "Light",
  dark: "Dark",
};

export const defaultTheme = "united-kingdom-national-health-service-england-for-patients";
