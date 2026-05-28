import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * BannerBox — a banner box that is inside a banner component, using flexbox horizontal
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `banner-box` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-banner-box",
  standalone: true,
  template: `<div class="banner-box {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerBox {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
