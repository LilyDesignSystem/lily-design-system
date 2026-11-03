import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * BarcodeImage component
 *
 * An image of a barcode (a patient wristband or a label, say). Renders an <img> with the `barcode-
 * image` hook; the component does not generate barcodes, the consumer supplies the image.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   src — string, required. The image URL.
 *   alt — string, required. The text alternative; for a barcode, say what it encodes in words.
 *   loading — "lazy" | "eager", optional. Passed to the native loading attribute.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-barcode-image src="…" alt="…" />
 *
 * Examples:
 *   <lily-barcode-image src="/wristband.svg" alt="Barcode for patient identifier 123" />
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - `alt` is required: a barcode is unreadable to a screen reader, so the alternative carries the encoded value or its meaning
 *
 * Internationalization:
 *   - `alt` is consumer-supplied and should be translated
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *   - Ships no barcode symbology; generation is the consumer's
 *
 * References:
 *   - MDN <img>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img
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
