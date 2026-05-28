import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Organization — an organization component that contains other organization-related information
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `organization` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-organization",
  standalone: true,
  template: `<div class="organization {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Organization {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
