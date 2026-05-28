import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * HeroHeadline — a full-bleed hero section with headline overlaid on media
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `hero-headline` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-hero-headline",
  standalone: true,
  template: `<div class="hero-headline {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroHeadline {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
