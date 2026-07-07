import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ImageCropper — a container for cropping and resizing an image to a selected region
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `image-cropper` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook and supplies the
 * image plus crop overlay UI as children.
 */
@Component({
  selector: "lily-image-cropper",
  standalone: true,
  template: `<div class="image-cropper {{ className() }}" role="application" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageCropper {
  readonly label = input.required<string>();
  readonly className = input<string>("");
}
