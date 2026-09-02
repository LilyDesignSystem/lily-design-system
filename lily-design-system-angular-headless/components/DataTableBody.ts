import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DataTableBody — a data table interactive grid tbody for displaying and sorting tabular data <tbody>
 *
 * Headless Angular component. Attribute selector on the native `<tbody>` —
 * the consumer writes `<tbody lily-data-table-body>`, so the host element IS the
 * `<tbody>` with no wrapper custom element between it and its parent (a
 * wrapper broke required parent-child content-model relationships for
 * assistive technology — see spec/index.md §11.8, Angular Material's own
 * idiom for list/table sub-elements). Renders the kebab-case class hook
 * `data-table-body` plus the consumer-provided `className` on the host. Ships
 * zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "tbody[lily-data-table-body]",
  standalone: true,
  template: `<ng-content />`,
  host: {
    "[class]": '"data-table-body " + className()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableBody {
  readonly className = input<string>("");
}
