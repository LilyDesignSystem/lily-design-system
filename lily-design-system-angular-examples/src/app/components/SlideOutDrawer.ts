import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * SlideOutDrawer — a drawer that slides out from the side of the page
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `slide-out-drawer` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-slide-out-drawer",
  standalone: true,
  template: `@if (open()) {
    <div
      class="slide-out-drawer {{ className() }}"
      role="dialog"
      tabindex="-1"
      aria-modal="true"
      [attr.aria-label]="label() || null"
      (keydown)="onKeydown($event)"
    ><ng-content /></div>
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideOutDrawer {
  readonly label = input<string>("");
  /** Whether the panel is shown. Two-way bindable; Escape sets it to false. */
  readonly open = model<boolean>(false);
  readonly className = input<string>("");

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      event.preventDefault();
      this.open.set(false);
    }
  }
}
