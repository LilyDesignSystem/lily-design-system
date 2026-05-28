import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Image — an image element with alt text
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `image` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-image",
  standalone: true,
  template: `<div class="image {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Image {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
