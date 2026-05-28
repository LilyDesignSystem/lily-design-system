import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Banner — a prominent message bar across the top of a page
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `banner` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-banner",
  standalone: true,
  template: `<div class="banner {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Banner {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
