import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Byline — an author attribution with publish and update timestamps
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `byline` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-byline",
  standalone: true,
  template: `<div class="byline {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Byline {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
