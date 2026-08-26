import { Component, ChangeDetectionStrategy, signal, computed } from "@angular/core";
import { RouterLink } from "@angular/router";
import { components } from "../components-data";

interface Entry {
  slug: string;
  pascal: string;
}

// The catalog registry is generated from components.tsv by
// bin/generate-registries, so names are canonical rather than
// reconstructed from slugs (which mangles TH/TD, ID, etc.).
const entries: Entry[] = components
  .map((c) => ({ slug: c.slug, pascal: c.name }))
  .sort((a, b) => a.slug.localeCompare(b.slug));

@Component({
  selector: "lily-components-catalog",
  standalone: true,
  imports: [RouterLink],
  template: `
    <article class="page-wrapper">
      <h1>Components</h1>
      <p>{{ entries.length }} components in the catalog.</p>

      <label for="search" style="display: block; font-weight: 600;">Search</label>
      <input
        id="search"
        type="search"
        autocomplete="off"
        [value]="query()"
        (input)="setQuery($event)"
        placeholder="Try: button, input, list, table…"
      />

      <p aria-live="polite">Showing {{ filtered().length }} of {{ entries.length }}.</p>

      <ul>
        @for (e of filtered(); track e.slug) {
          <li>
            <a [routerLink]="['/components', e.slug]">
              <strong>{{ e.pascal }}</strong>
              <span> — {{ e.slug }}</span>
            </a>
          </li>
        }
      </ul>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ComponentsIndexPage {
  protected readonly entries = entries;
  protected readonly query = signal("");

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.entries;
    return this.entries.filter(
      (e) => e.slug.includes(q) || e.pascal.toLowerCase().includes(q),
    );
  });

  protected setQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
