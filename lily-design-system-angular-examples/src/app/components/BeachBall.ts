import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * BeachBall — a decorative animated beach ball element
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `beach-ball` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-beach-ball",
  standalone: true,
  template: `<div class="beach-ball {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BeachBall {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
