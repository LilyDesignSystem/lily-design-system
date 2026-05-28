import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * GovernmentIdentifier — an identifier section with a parent agency logo, agency name, and required government links
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `government-identifier` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-government-identifier",
  standalone: true,
  template: `<div class="government-identifier {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovernmentIdentifier {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
