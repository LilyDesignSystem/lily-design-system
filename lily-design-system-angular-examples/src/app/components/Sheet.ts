import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * Sheet — a panel that slides in from a screen edge as an overlay
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `sheet` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-sheet",
  standalone: true,
  template: `@if (open()) {
    <div
      class="sheet {{ className() }}"
      role="dialog"
      tabindex="-1"
      aria-modal="true"
      [attr.aria-label]="label() || null"
      [attr.data-side]="side()"
      (keydown)="onKeydown($event)"
    ><ng-content /></div>
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sheet {
  readonly label = input<string>("");
  /** Whether the panel is shown. Two-way bindable; Escape sets it to false. */
  readonly open = model<boolean>(false);
  /** Edge the panel attaches to; exposed as `data-side`. */
  readonly side = input<"left" | "right" | "top" | "bottom">("right");
  readonly className = input<string>("");

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      event.preventDefault();
      this.open.set(false);
    }
  }
}
