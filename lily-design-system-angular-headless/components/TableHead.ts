import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TableHead — a table interactive grid thead <thead>
 *
 * Headless Angular component. Attribute selector on the native `<thead>` —
 * the consumer writes `<thead lily-table-head>`, so the host element IS the
 * `<thead>` with no wrapper custom element between it and its parent (a
 * wrapper broke required parent-child content-model relationships for
 * assistive technology — see spec/index.md §11.8, Angular Material's own
 * idiom for list/table sub-elements). Renders the kebab-case class hook
 * `table-head` plus the consumer-provided `className` on the host. Ships
 * zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "thead[lily-table-head]",
  standalone: true,
  template: `<ng-content />`,
  host: {
    "[class]": '"table-head " + className()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableHead {
  readonly className = input<string>("");
}
