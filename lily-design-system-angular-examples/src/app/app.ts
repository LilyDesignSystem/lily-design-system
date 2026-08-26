import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ThemePicker } from "lily-design-system-angular-theme-picker";
import { LocalePicker } from "lily-design-system-angular-locale-picker";
import { TextSizePicker } from "lily-design-system-angular-text-size-picker";
import { themes, themeLabels, defaultTheme } from "./theme-config";

@Component({
  selector: "lily-app",
  standalone: true,
  imports: [RouterOutlet, ThemePicker, LocalePicker, TextSizePicker],
  template: `
    <a class="skip-link" href="#main-content">Skip to main content</a>

    <header class="header" aria-label="Site header">
      <div class="page-wrapper site-header">
        <span><strong>Lily</strong> <span>Angular example</span></span>
        <span class="site-header-pickers">
          <lily-theme-picker
            label="Choose a theme"
            themesUrl="/themes/"
            [themes]="themes"
            [themeLabels]="themeLabels"
            [defaultValue]="defaultTheme"
            storageKey="lily-theme"
          />
          <lily-locale-picker
            label="Choose a language"
            [locales]="locales"
            [localeLabels]="localeLabels"
            defaultValue="en-GB"
            storageKey="lily-locale"
          />
          <lily-text-size-picker
            label="Text size"
            [sizes]="sizes"
            [sizeLabels]="sizeLabels"
            defaultValue="medium"
            storageKey="lily-text-size"
          />
        </span>
      </div>
    </header>

    <main id="main-content">
      <router-outlet />
    </main>

    <footer class="footer" aria-label="Site footer">
      <div class="page-wrapper">
        <p>Lily Design System — Angular + Analog.js</p>
        <p>Lily™ and Lily Design System™ are trademarks.</p>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly themes = themes;
  protected readonly themeLabels = themeLabels;
  protected readonly defaultTheme = defaultTheme;
  // Explicit endonym labels: Intl.DisplayNames is only as good as the
  // browser's ICU data (headless Chromium lacks Welsh, for example).
  protected readonly locales = ["en-GB", "cy-GB", "fr-FR", "ar"];
  protected readonly localeLabels: Record<string, string> = {
    "en-GB": "English (UK)",
    "cy-GB": "Cymraeg",
    "fr-FR": "Français",
    ar: "العربية",
  };
  protected readonly sizes = ["small", "medium", "large"];
  protected readonly sizeLabels: Record<string, string> = {
    small: "Small", medium: "Medium", large: "Large",
  };
}
