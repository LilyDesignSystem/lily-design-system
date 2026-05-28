import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Hero — a large box or image with a title and description
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `hero` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-hero",
  standalone: true,
  template: `<div class="hero {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
