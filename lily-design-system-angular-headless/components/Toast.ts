import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Toast — a brief auto-dismissing notification message
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `toast` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-toast",
  standalone: true,
  template: `<div class="toast {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
