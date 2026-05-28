import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * FloatingPanel — a panel that floats above page content
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `floating-panel` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-floating-panel",
  standalone: true,
  template: `<div class="floating-panel {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatingPanel {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
