import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ThemePicker } from "lily-design-system-angular-theme-picker";
import { themes, themeLabels, defaultTheme } from "./theme-config";

@Component({
  selector: "lily-app",
  standalone: true,
  imports: [RouterOutlet, ThemePicker],
  template: `
    <a class="skip-link" href="#main-content">Skip to main content</a>

    <header class="header" aria-label="Site header">
      <div class="page-wrapper site-header">
        <span><strong>Lily</strong> <span>Angular example</span></span>
        <lily-theme-picker
          label="Choose a theme"
          themesUrl="/themes/"
          [themes]="themes"
          [themeLabels]="themeLabels"
          [defaultValue]="defaultTheme"
          storageKey="lily-theme"
        />
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
}
