import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DialGroup — a group of dial components
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `dial-group` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-dial-group",
  standalone: true,
  template: `<div class="dial-group {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialGroup {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
