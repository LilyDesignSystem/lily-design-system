import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Resizable — a container that the user can resize by dragging
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `resizable` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-resizable",
  standalone: true,
  template: `<div class="resizable {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Resizable {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
