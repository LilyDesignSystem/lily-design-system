import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SignaturePad — a drawing area for capturing a handwritten signature
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `signature-pad` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-signature-pad",
  standalone: true,
  template: `<div class="signature-pad {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignaturePad {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
