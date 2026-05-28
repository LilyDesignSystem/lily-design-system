import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SplitButton — a button with a primary action and a dropdown for related actions
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `split-button` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-split-button",
  standalone: true,
  template: `<button class="split-button {{ className() }}" type="button" [attr.aria-label]="label() || null"><ng-content /></button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplitButton {
  /** Optional aria-label override. */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
}
