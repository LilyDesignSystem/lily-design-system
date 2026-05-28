import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "lily-app",
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <a class="skip-link" href="#main-content">Skip to main content</a>

    <header class="header" aria-label="Site header">
      <div class="page-wrapper">
        <strong>Lily</strong>
        <span>Angular example</span>
      </div>
    </header>

    <main id="main-content">
      <router-outlet />
    </main>

    <footer class="footer" aria-label="Site footer">
      <div class="page-wrapper">
        <p>Lily Design System — Angular + Analog.js</p>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
