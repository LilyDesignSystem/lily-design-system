import { Component, ChangeDetectionStrategy, computed, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { injectParams } from "@analogjs/router";
import { DomSanitizer, type SafeHtml } from "@angular/platform-browser";
import { componentDemos } from "../../component-demos";

@Component({
  selector: "lily-component-detail",
  standalone: true,
  imports: [RouterLink],
  template: `
    <article class="page-wrapper">
      <nav aria-label="Breadcrumb">
        <a routerLink="/components">← All components</a>
      </nav>

      <h1>{{ slug() }}</h1>

      <h2>Live demo</h2>
      <div class="component-demo" [innerHTML]="demoHtml()"></div>

      <details>
        <summary>HTML source</summary>
        <pre><code>{{ demoSource() }}</code></pre>
      </details>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ComponentDetailPage {
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly slug = injectParams("slug");

  protected readonly demoSource = computed(() => {
    const s = this.slug();
    return s ? componentDemos[s] ?? "" : "";
  });

  protected readonly demoHtml = computed<SafeHtml>(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.demoSource()),
  );
}
