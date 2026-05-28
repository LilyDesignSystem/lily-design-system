import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * PhotoPack — a collection of photos displayed together as a group
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `photo-pack` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-photo-pack",
  standalone: true,
  template: `<div class="photo-pack {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoPack {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
