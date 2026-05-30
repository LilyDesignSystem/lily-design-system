import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * BarcodeImage — a barcode-image image rendered from encoded data such as an order number, SKU, or identifier.
 *
 * Headless Angular component. Renders an <img> with the kebab-case class
 * hook `barcode-image` and the consumer-provided `className`, `src`, `alt`, and
 * optional `loading`. Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-barcode-image",
  standalone: true,
  template: `<img class="barcode-image {{ className() }}" [src]="src()" [alt]="alt()" [attr.loading]="loading() || null" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarcodeImage {
  readonly src = input.required<string>();
  readonly alt = input.required<string>();
  readonly loading = input<"lazy" | "eager" | "">("");
  readonly className = input<string>("");
}
