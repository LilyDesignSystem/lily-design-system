import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * GraphicBlock — a wrapper for charts and graphics with title, description, notes, and ARIA description
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `graphic-block` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-graphic-block",
  standalone: true,
  template: `<div class="graphic-block {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphicBlock {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
