import { ChangeDetectionStrategy, Component, input } from "@angular/core";

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
  template: `<dialog class="dialog {{ className() }}" [attr.aria-label]="label() || null" [open]="open()"><ng-content /></dialog>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dialog {
  readonly label = input<string>("");
  readonly open = input<boolean>(false);
  readonly className = input<string>("");
}
