import { ChangeDetectionStrategy, Component, input } from "@angular/core";

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
  template: `<div class="grid {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Grid {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
