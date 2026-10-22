import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * HorizontalScroller — a horizontally scrollable content container
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `horizontal-scroller` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-horizontal-scroller",
  standalone: true,
  template: `<div
    class="horizontal-scroller {{ className() }}"
    role="region"
    tabindex="0"
    [attr.aria-label]="label() || null"
    (keydown)="onKeydown($event)"
  ><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HorizontalScroller {
  readonly label = input<string>("");
  /** Pixels scrolled by ArrowLeft / ArrowRight. */
  readonly step = input<number>(100);
  readonly className = input<string>("");

  protected onKeydown(event: KeyboardEvent): void {
    const el = event.currentTarget as HTMLElement;
    switch (event.key) {
      case "ArrowRight":
        el.scrollBy({ left: this.step(), behavior: "smooth" });
        break;
      case "ArrowLeft":
        el.scrollBy({ left: -this.step(), behavior: "smooth" });
        break;
      case "Home":
        el.scrollTo({ left: 0, behavior: "smooth" });
        break;
      case "End":
        el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
        break;
      default:
        return;
    }
    event.preventDefault();
  }
}
