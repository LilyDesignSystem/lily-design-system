import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * AddressographBox — a patient identification block printed or rendered from an addressograph-box plate, showing core patient demographics.
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `addressograph-box` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-addressograph-box",
  standalone: true,
  template: `<div class="addressograph-box {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressographBox {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
