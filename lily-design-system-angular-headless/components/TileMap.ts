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
  template: `<div
    class="tile-map {{ className() }}"
    role="img"
    aria-roledescription="tile map"
    [attr.aria-label]="label() || null"
    (keydown)="onKeydown($event)"
  ><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TileMap {
  readonly label = input<string>("");
  readonly className = input<string>("");

  /**
   * Arrow keys move focus between `[data-tile]` descendants (left/right by order, up/down to the
   * nearest tile in the row above or below); Enter / Space fire a bubbling `tile-activate` event
   * on the focused tile; Escape blurs it.
   */
  protected onKeydown(event: KeyboardEvent): void {
    const root = event.currentTarget as HTMLElement;
    const tiles = Array.from(root.querySelectorAll<HTMLElement>("[data-tile]"));
    if (tiles.length === 0) return;
    const focused = document.activeElement as HTMLElement | null;
    const idx = focused ? tiles.indexOf(focused) : -1;
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        tiles[Math.min(tiles.length - 1, idx + 1)]?.focus();
        break;
      case "ArrowLeft":
        event.preventDefault();
        tiles[Math.max(0, idx - 1)]?.focus();
        break;
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        if (idx === -1) return;
        const currentRect = tiles[idx].getBoundingClientRect();
        const targetX = currentRect.left + currentRect.width / 2;
        const wantBelow = event.key === "ArrowDown";
        const next = tiles
          .map((t, i) => ({ t, i }))
          .filter(({ i }) => i !== idx)
          .filter(({ t }) => {
            const r = t.getBoundingClientRect();
            return wantBelow ? r.top > currentRect.top : r.top < currentRect.top;
          })
          .map(({ t }) => {
            const r = t.getBoundingClientRect();
            return { t, score: Math.abs(r.left + r.width / 2 - targetX) + Math.abs(r.top - currentRect.top) };
          })
          .sort((a, b) => a.score - b.score)[0]?.t;
        next?.focus();
        break;
      }
      case "Enter":
      case " ":
        event.preventDefault();
        focused?.dispatchEvent(new CustomEvent("tile-activate", { bubbles: true }));
        break;
      case "Escape":
        event.preventDefault();
        focused?.blur();
        break;
    }
  }
}
