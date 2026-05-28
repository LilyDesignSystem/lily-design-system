import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Tour — a tour guide, such as for sightseeing, or pathways, or demonstrations, etc.
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `tour` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-tour",
  standalone: true,
  template: `<div class="tour {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tour {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
