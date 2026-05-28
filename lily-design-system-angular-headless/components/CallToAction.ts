import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CallToAction — a prominent prompt encouraging user action
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `call-to-action` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-call-to-action",
  standalone: true,
  template: `<div class="call-to-action {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CallToAction {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
