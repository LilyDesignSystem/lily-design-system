import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Slider — a draggable control for selecting a value along a track
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `slider` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-slider",
  standalone: true,
  template: `<div class="slider {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Slider {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
