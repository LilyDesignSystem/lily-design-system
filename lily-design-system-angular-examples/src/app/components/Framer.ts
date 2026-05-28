import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Framer — a container for framed content display with decorative border
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `framer` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-framer",
  standalone: true,
  template: `<div class="framer {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Framer {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
