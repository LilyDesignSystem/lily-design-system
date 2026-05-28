import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Collapsible — a container that can be expanded or collapsed
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `collapsible` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-collapsible",
  standalone: true,
  template: `<div class="collapsible {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Collapsible {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
