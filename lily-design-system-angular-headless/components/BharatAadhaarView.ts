import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * BharatAadhaarView — a read-only display of India's Aadhaar (आधार)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `bharat-aadhaar-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-bharat-aadhaar-view",
  standalone: true,
  template: `<span class="bharat-aadhaar-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BharatAadhaarView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
