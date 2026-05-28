import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * IconButton — a button containing only an icon with a required accessible label
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `icon-button` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-icon-button",
  standalone: true,
  template: `<button class="icon-button {{ className() }}" type="button" [attr.aria-label]="label() || null"><ng-content /></button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButton {
  /** Optional aria-label override. */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
}
