import { Component, ChangeDetectionStrategy, signal, computed } from "@angular/core";
import { RouterLink } from "@angular/router";
import { components, CATEGORY_LABEL } from "../components-data";
import { suffixPatternOf, SUFFIX_LABEL, STANDALONE_ID } from "../suffix-pattern";

interface Entry {
  slug: string;
  pascal: string;
  description: string;
  category: string;
  suffix: string;
}

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

// The catalog registry is generated from components.tsv by
// bin/generate-registries, so names are canonical rather than
// reconstructed from slugs (which mangles TH/TD, ID, etc.). Category
// comes from each component's own registry entry (bin/generate-component-categories,
// sourced from the canonical HTML tag in components/{slug}/AGENTS.md);
// suffix pattern is derived client-side from the slug (../suffix-pattern.ts).
const entries: Entry[] = components
  .map((c) => ({
    slug: c.slug,
    pascal: c.name,
    description: c.description,
    category: c.category,
    suffix: suffixPatternOf(c.slug),
  }))
  .sort((a, b) => a.slug.localeCompare(b.slug));

function countBy(items: Entry[], key: "category" | "suffix"): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item[key], (counts.get(item[key]) ?? 0) + 1);
  }
  return counts;
}

const categoryCounts = countBy(entries, "category");
const suffixCounts = countBy(entries, "suffix");

// Both dropdowns only ever list ids actually present in the catalog,
// so "All ..." plus real, populated options -- no dead choices that
// would always return zero results.
const categoryOptions: FilterOption[] = Object.entries(CATEGORY_LABEL)
  .filter(([id]) => categoryCounts.has(id))
  .map(([id, label]) => ({ id, label, count: categoryCounts.get(id) ?? 0 }))
  .sort((a, b) => b.count - a.count);

const suffixOptions: FilterOption[] = Object.entries(SUFFIX_LABEL)
  .filter(([id]) => suffixCounts.has(id) && id !== STANDALONE_ID)
  .map(([id, label]) => ({ id, label, count: suffixCounts.get(id) ?? 0 }))
  .sort((a, b) => b.count - a.count)
  .concat(
    suffixCounts.has(STANDALONE_ID)
      ? [{ id: STANDALONE_ID, label: SUFFIX_LABEL[STANDALONE_ID], count: suffixCounts.get(STANDALONE_ID) ?? 0 }]
      : [],
  );

@Component({
  selector: "lily-components-catalog",
  standalone: true,
  imports: [RouterLink],
  template: `
    <article class="page-wrapper">
      <h1>Components</h1>
      <p>{{ entries.length }} components in the catalog.</p>

      <label for="search" style="display: block; font-weight: 600;">Filter components</label>
      <input
        id="search"
        type="search"
        autocomplete="off"
        [value]="query()"
        (input)="setQuery($event)"
        placeholder="Try: button, input, list, table…"
      />

      <label for="category-filter" style="display: block; font-weight: 600;">Category</label>
      <select id="category-filter" [value]="categoryFilter()" (change)="setCategoryFilter($event)">
        <option value="">All categories ({{ entries.length }})</option>
        @for (opt of categoryOptions; track opt.id) {
          <option [value]="opt.id">{{ opt.label }} ({{ opt.count }})</option>
        }
      </select>

      <label for="suffix-filter" style="display: block; font-weight: 600;">Suffix pattern</label>
      <select id="suffix-filter" [value]="suffixFilter()" (change)="setSuffixFilter($event)">
        <option value="">All suffix patterns ({{ entries.length }})</option>
        @for (opt of suffixOptions; track opt.id) {
          <option [value]="opt.id">{{ opt.label }} ({{ opt.count }})</option>
        }
      </select>

      @if (hasActiveFilter()) {
        <p>
          <button type="button" (click)="resetFilters()">Clear filters</button>
        </p>
      }

      <p aria-live="polite" role="status">{{ filtered().length }} of {{ entries.length }} components</p>

      <ul class="component-index-list">
        @for (e of filtered(); track e.slug) {
          <li class="component-index-list-item">
            <a [routerLink]="['/components', e.slug]">
              <strong>{{ e.pascal }}</strong>
              <span> — {{ e.slug }}</span>
            </a>
            <span class="component-index-list-item-description"> {{ e.description }}</span>
          </li>
        }
      </ul>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ComponentsIndexPage {
  protected readonly entries = entries;
  protected readonly categoryOptions = categoryOptions;
  protected readonly suffixOptions = suffixOptions;

  protected readonly query = signal("");
  protected readonly categoryFilter = signal("");
  protected readonly suffixFilter = signal("");

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const category = this.categoryFilter();
    const suffix = this.suffixFilter();
    return this.entries.filter((e) => {
      const matchesSearch =
        q === "" ||
        e.pascal.toLowerCase().includes(q) ||
        e.slug.includes(q) ||
        e.description.toLowerCase().includes(q);
      const matchesCategory = category === "" || e.category === category;
      const matchesSuffix = suffix === "" || e.suffix === suffix;
      return matchesSearch && matchesCategory && matchesSuffix;
    });
  });

  protected readonly hasActiveFilter = computed(
    () => this.query() !== "" || this.categoryFilter() !== "" || this.suffixFilter() !== "",
  );

  protected setQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected setCategoryFilter(event: Event): void {
    this.categoryFilter.set((event.target as HTMLSelectElement).value);
  }

  protected setSuffixFilter(event: Event): void {
    this.suffixFilter.set((event.target as HTMLSelectElement).value);
  }

  protected resetFilters(): void {
    this.query.set("");
    this.categoryFilter.set("");
    this.suffixFilter.set("");
  }
}
