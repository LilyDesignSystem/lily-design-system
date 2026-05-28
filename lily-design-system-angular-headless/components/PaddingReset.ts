import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * PaddingReset — a container that resets padding inside fluid-width containers
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `padding-reset` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-padding-reset",
  standalone: true,
  template: `<div class="padding-reset {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaddingReset {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
