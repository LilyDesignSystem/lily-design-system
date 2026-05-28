import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Tile — a grouping container that presents related content in a structured format, often as a single clickable area
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `tile` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-tile",
  standalone: true,
  template: `<div class="tile {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tile {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
