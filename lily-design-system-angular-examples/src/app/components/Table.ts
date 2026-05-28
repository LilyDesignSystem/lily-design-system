import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Table — a table with rows and columns <table>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `table` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-table",
  standalone: true,
  template: `<table class="table {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></table>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Table {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
