import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { ModalDialog } from "./Dialog";

/**
 * TimeoutDialog — a modal dialog warning users before session timeout
 *
 * Headless Angular component: a `<dialog role="alertdialog">` named by `label` (aria-label) holding the consumer's
 * warning and actions. Shown while `open` with `showModal()` (ModalDialog, tasks.md P14-T4): top layer, inert page,
 * Tab trapped; focus returns to the opener when it closes. As in the Svelte reference, `open` is one-way: the
 * consumer's actions decide when the warning ends. Ships zero CSS.
 */
@Component({
    selector: "lily-timeout-dialog",
    standalone: true,
    template: `<dialog
    class="timeout-dialog {{ className() }}"
    role="alertdialog"
    [attr.aria-label]="label() || null"
    [lilyModalDialog]="open()"
  ><ng-content /></dialog>`,
    imports: [ModalDialog],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeoutDialog {
    readonly label = input<string>("");
    readonly open = input<boolean>(false);
    readonly className = input<string>("");
}
