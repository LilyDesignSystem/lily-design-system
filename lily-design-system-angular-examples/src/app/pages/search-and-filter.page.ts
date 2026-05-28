import { Component, ChangeDetectionStrategy, signal, computed } from "@angular/core";
import { SearchInput, Combobox, TagGroup, Tag, Badge } from "lily-design-system-angular-headless";

@Component({
  selector: "lily-search-and-filter",
  standalone: true,
  imports: [SearchInput, Combobox, TagGroup, Tag, Badge],
  template: `
    <article class="page-wrapper">
      <h1>Search and filter</h1>

      <lily-search-input label="Search" [(value)]="query" />

      <lily-tag-group label="Filters">
        <lily-tag>Electronics</lily-tag>
        <lily-tag>Furniture</lily-tag>
      </lily-tag-group>

      <p>You searched for: <strong>{{ query() || "(nothing)" }}</strong> <lily-badge>{{ count() }}</lily-badge></p>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SearchAndFilterPage {
  protected query = signal("");
  protected count = computed(() => (this.query() ? 1 : 0));
}
