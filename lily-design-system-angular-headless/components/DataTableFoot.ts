import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DataTableFoot — a data table interactive grid tfoot for displaying and sorting tabular data <tfoot>
 *
 * Headless Angular component. Attribute selector on the native `<tfoot>` —
 * the consumer writes `<tfoot lily-data-table-foot>`, so the host element IS the
 * `<tfoot>` with no wrapper custom element between it and its parent (a
 * wrapper broke required parent-child content-model relationships for
 * assistive technology — see spec/index.md §11.8, Angular Material's own
 * idiom for list/table sub-elements). Renders the kebab-case class hook
 * `data-table-foot` plus the consumer-provided `className` on the host. Ships
 * zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "tfoot[lily-data-table-foot]",
  standalone: true,
  template: `<ng-content />`,
  host: {
    "[class]": '"data-table-foot " + className()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableFoot {
  readonly className = input<string>("");
}
