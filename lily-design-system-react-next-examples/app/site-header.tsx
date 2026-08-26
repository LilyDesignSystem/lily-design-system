"use client";

import { ThemePicker } from "lily-design-system-react-theme-picker";
import { LocalePicker } from "lily-design-system-react-locale-picker";
import { TextSizePicker } from "lily-design-system-react-text-size-picker";
import { themes, themeLabels, defaultTheme } from "./theme-config";

// Explicit endonym labels: the helper derives endonyms from
// Intl.DisplayNames, but that is only as good as the browser's ICU data
// (headless Chromium lacks Welsh, for example). A consumer that cares
// about a specific list should say so.
const locales = ["en-GB", "cy-GB", "fr-FR", "ar"];
const localeLabels: Record<string, string> = {
  "en-GB": "English (UK)",
  "cy-GB": "Cymraeg",
  "fr-FR": "Français",
  ar: "العربية",
};
const sizes = ["small", "medium", "large"];
const sizeLabels: Record<string, string> = { small: "Small", medium: "Medium", large: "Large" };

export function SiteHeader() {
  return (
    <div className="site-header">
      <span>Lily Design System — Next.js examples</span>
      <div className="site-header-pickers">
        <ThemePicker
          label="Choose a theme"
          themesUrl="/themes/"
          themes={themes}
          themeLabels={themeLabels}
          defaultValue={defaultTheme}
          storageKey="lily-theme"
        />
        <LocalePicker
          label="Choose a language"
          locales={locales}
          localeLabels={localeLabels}
          defaultValue="en-GB"
          storageKey="lily-locale"
        />
        <TextSizePicker
          label="Text size"
          sizes={sizes}
          sizeLabels={sizeLabels}
          defaultValue="medium"
          storageKey="lily-text-size"
        />
      </div>
    </div>
  );
}
