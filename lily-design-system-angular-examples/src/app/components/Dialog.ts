import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * Dialog — a modal or non-modal dialog window
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `dialog` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-dialog",
  standalone: true,
  template: `<dialog
    class="dialog {{ className() }}"
    tabindex="-1"
    [attr.aria-label]="label() || null"
    [attr.aria-modal]="modal() ? 'true' : null"
    [open]="open()"
    (keydown)="onKeydown($event)"
  ><ng-content /></dialog>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dialog {
  readonly label = input<string>("");
  /** Whether the dialog is visible. Two-way bindable; Escape sets it to false. */
  readonly open = model<boolean>(false);
  /** Whether the dialog is modal (`aria-modal`). */
  readonly modal = input<boolean>(true);
  readonly className = input<string>("");

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      event.preventDefault();
      this.open.set(false);
    }
  }
}
