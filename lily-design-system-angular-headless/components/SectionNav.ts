import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SectionNav — a navigation container for section navigation links
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `section-nav` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-section-nav",
  standalone: true,
  template: `<nav class="section-nav {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></nav>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionNav {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
