import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TourList — an ordered list of tour guide steps
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `tour-list` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-tour-list",
  standalone: true,
  template: `<ol class="tour-list {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></ol>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourList {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
