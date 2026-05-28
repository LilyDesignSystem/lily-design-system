import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Figure — a self-contained figure with optional caption
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `figure` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-figure",
  standalone: true,
  template: `<figure class="figure {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></figure>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Figure {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
