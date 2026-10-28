import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";

/**
 * Grid — a CSS grid layout container with configurable columns and gap
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `grid` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-grid",
  standalone: true,
  template: `<div class="grid {{ className() }}" [attr.aria-label]="label() || null" [attr.data-columns]="columns()" [attr.data-min-column-width]="minColumnWidth() || null" [style.display]="'grid'" [style.grid-template-columns]="gridTemplateColumns()" [style.gap]="gap()"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Grid {
  readonly label = input<string>("");
  readonly className = input<string>("");
  /** Number of equal columns OR a custom grid-template-columns string. */
  readonly columns = input<number | string>(12);
  /** CSS length: fit as many columns as fit, each at least this wide. Wins over `columns`. */
  readonly minColumnWidth = input<string>("");
  /** Gap CSS value. */
  readonly gap = input<string>("1rem");
  readonly gridTemplateColumns = computed(() => {
    const min = this.minColumnWidth();
    if (min) return `repeat(auto-fit, minmax(min(${min}, 100%), 1fr))`;
    const columns = this.columns();
    return typeof columns === "number" ? `repeat(${columns}, minmax(0, 1fr))` : columns;
  });
}
