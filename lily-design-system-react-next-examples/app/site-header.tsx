"use client";

import { ThemePicker } from "lily-design-system-react-theme-picker";
import { themes, themeLabels, defaultTheme } from "./theme-config";

export function SiteHeader() {
  return (
    <div className="site-header">
      <span>Lily Design System — Next.js examples</span>
      <ThemePicker
        label="Choose a theme"
        themesUrl="/themes/"
        themes={themes}
        themeLabels={themeLabels}
        defaultValue={defaultTheme}
        storageKey="lily-theme"
      />
    </div>
  );
}
