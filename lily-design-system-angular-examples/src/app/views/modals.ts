import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { AlertDialog } from "../components/AlertDialog";
import { Dialog } from "../components/Dialog";
import { Drawer } from "../components/Drawer";
import { FileDialog } from "../components/FileDialog";
import { Sheet } from "../components/Sheet";
import { SlideOutDrawer } from "../components/SlideOutDrawer";
import { TimeoutDialog } from "../components/TimeoutDialog";

/** Every modal: each opens with showModal(), takes focus, and gives it back. See e2e/modals.spec.ts. */
@Component({
    selector: "lily-modals",
    standalone: true,
    imports: [AlertDialog, Dialog, Drawer, FileDialog, Sheet, SlideOutDrawer, TimeoutDialog],
    template: `
    <article class="page-wrapper">
      <h1>Modals</h1>
      @for (kind of kinds; track kind) {
        <p><button type="button" [attr.data-testid]="'open-' + kind" (click)="open.set(kind)">Open {{ kind }}</button></p>
      }

      <lily-dialog label="Dialog" [open]="open() === 'dialog'" (openChange)="closed($event)">
        <button type="button" data-testid="close-dialog" (click)="open.set('')">Close</button>
      </lily-dialog>
      <lily-alert-dialog title="Alert" [open]="open() === 'alert-dialog'" (openChange)="closed($event)">
        <button type="button" data-testid="close-alert-dialog" (click)="open.set('')">Close</button>
      </lily-alert-dialog>
      <lily-file-dialog label="File" [open]="open() === 'file-dialog'" (openChange)="closed($event)">
        <button type="button" data-testid="close-file-dialog" (click)="open.set('')">Close</button>
      </lily-file-dialog>
      <lily-timeout-dialog label="Timeout" [open]="open() === 'timeout-dialog'">
        <button type="button" data-testid="close-timeout-dialog" (click)="open.set('')">Close</button>
      </lily-timeout-dialog>
      <lily-drawer label="Drawer" [open]="open() === 'drawer'" (openChange)="closed($event)">
        <button type="button" data-testid="close-drawer" (click)="open.set('')">Close</button>
      </lily-drawer>
      <lily-sheet label="Sheet" [open]="open() === 'sheet'" (openChange)="closed($event)">
        <button type="button" data-testid="close-sheet" (click)="open.set('')">Close</button>
      </lily-sheet>
      <lily-slide-out-drawer label="Slide-out" [open]="open() === 'slide-out-drawer'" (openChange)="closed($event)">
        <button type="button" data-testid="close-slide-out-drawer" (click)="open.set('')">Close</button>
      </lily-slide-out-drawer>
    </article>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ModalsPage {
    protected readonly kinds = [
        "dialog",
        "alert-dialog",
        "file-dialog",
        "timeout-dialog",
        "drawer",
        "sheet",
        "slide-out-drawer",
    ];
    protected readonly open = signal("");

    protected closed(open: boolean): void {
        if (!open) this.open.set("");
    }
}
