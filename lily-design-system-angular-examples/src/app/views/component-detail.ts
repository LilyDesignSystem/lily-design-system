import { Component, ChangeDetectionStrategy, computed, inject } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs";
import { DomSanitizer, type SafeHtml } from "@angular/platform-browser";
import { componentDemos } from "../component-demos";
import { components } from "../components-data";

@Component({
  selector: "lily-component-detail",
  standalone: true,
  imports: [RouterLink],
  template: `
    <article class="page-wrapper">
      <nav aria-label="Breadcrumb">
        <a routerLink="/components">Back to components</a>
      </nav>

      <h1>{{ meta()?.name ?? "Component Not Found" }}</h1>

      @if (meta(); as m) {
        <p>{{ m.description }}</p>

        <h2>Live demo</h2>
        <div class="component-demo" [innerHTML]="demoHtml()"></div>

        <details>
          <summary>HTML source</summary>
          <pre><code>{{ demoSource() }}</code></pre>
        </details>

        <h2>Details</h2>
        <dl>
          <dt>Name</dt>
          <dd>{{ m.name }}</dd>
          <dt>Slug</dt>
          <dd><code>{{ m.slug }}</code></dd>
          <dt>Description</dt>
          <dd>{{ m.description }}</dd>
        </dl>
      } @else {
        <p>Component not found.</p>
      }
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ComponentDetailPage {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly route = inject(ActivatedRoute);
  protected readonly slug = toSignal(
    this.route.paramMap.pipe(map((p) => p.get("slug"))),
    { initialValue: this.route.snapshot.paramMap.get("slug") },
  );

  protected readonly meta = computed(() => {
    const s = this.slug();
    return s ? components.find((c) => c.slug === s) : undefined;
  });

  protected readonly demoSource = computed(() => {
    const s = this.slug();
    return s ? componentDemos[s] ?? "" : "";
  });

  protected readonly demoHtml = computed<SafeHtml>(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.demoSource()),
  );
}
