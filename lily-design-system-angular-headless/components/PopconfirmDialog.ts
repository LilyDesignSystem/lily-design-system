import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * PopconfirmDialog — a popover dialog with confirm and cancel buttons
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `popconfirm-dialog` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-popconfirm-dialog",
  standalone: true,
  template: `<dialog class="popconfirm-dialog {{ className() }}" [attr.aria-label]="label() || null" [open]="open()"><ng-content /></dialog>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopconfirmDialog {
  readonly label = input<string>("");
  readonly open = input<boolean>(false);
  readonly className = input<string>("");
}
