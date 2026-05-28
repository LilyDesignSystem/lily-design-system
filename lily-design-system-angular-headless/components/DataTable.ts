import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DataTable — a data table interactive grid for displaying and sorting tabular data <table>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `data-table` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-data-table",
  standalone: true,
  template: `<table class="data-table {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></table>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTable {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
