import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Editable — an inline-editable text element that toggles between view and edit modes
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `editable` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-editable",
  standalone: true,
  template: `<div class="editable {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Editable {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
