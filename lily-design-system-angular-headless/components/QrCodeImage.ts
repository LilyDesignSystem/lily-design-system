import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * QrCodeImage — a QR code image generated from text or URL data
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `qr-code-image` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-qr-code-image",
  standalone: true,
  template: `<div class="qr-code-image {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCodeImage {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
