import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SelectWithExtras — a select dropdown with additional features like search or groups
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `select-with-extras` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-select-with-extras",
  standalone: true,
  template: `<div class="select-with-extras {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectWithExtras {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
