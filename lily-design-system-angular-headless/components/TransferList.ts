import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TransferList — a dual list box for moving items between two lists
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `transfer-list` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-transfer-list",
  standalone: true,
  template: `<ol class="transfer-list {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></ol>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransferList {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
