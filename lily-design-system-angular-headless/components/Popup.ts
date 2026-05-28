import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Popup — a temporary overlay that appears above page content
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `popup` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-popup",
  standalone: true,
  template: `<div class="popup {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Popup {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
