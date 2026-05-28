import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SectionList — a list of section navigation items
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `section-list` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-section-list",
  standalone: true,
  template: `<ol class="section-list {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></ol>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionList {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
