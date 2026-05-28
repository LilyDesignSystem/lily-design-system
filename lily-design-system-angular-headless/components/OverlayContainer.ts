import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * OverlayContainer — a full-viewport overlay backdrop for modals and sheets
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `overlay-container` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-overlay-container",
  standalone: true,
  template: `<div class="overlay-container {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayContainer {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
