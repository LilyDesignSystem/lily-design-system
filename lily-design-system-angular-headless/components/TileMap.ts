import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TileMap — a tile cartogram map with configurable layers for geographic data visualization
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `tile-map` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-tile-map",
  standalone: true,
  template: `<div class="tile-map {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TileMap {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
