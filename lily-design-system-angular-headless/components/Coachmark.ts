import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Coachmark — an anchored popover that spotlights and explains a single feature
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `coachmark` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-coachmark",
  standalone: true,
  template: `<div class="coachmark {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Coachmark {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
