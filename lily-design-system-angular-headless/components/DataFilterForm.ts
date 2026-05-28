import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DataFilterForm — a form for filtering data by criteria
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `data-filter-form` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-data-filter-form",
  standalone: true,
  template: `<div class="data-filter-form {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataFilterForm {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
