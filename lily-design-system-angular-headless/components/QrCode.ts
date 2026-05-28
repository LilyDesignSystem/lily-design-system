import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * QrCode — a QR code image generated from text or URL data
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `qr-code` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-qr-code",
  standalone: true,
  template: `<div class="qr-code {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCode {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
