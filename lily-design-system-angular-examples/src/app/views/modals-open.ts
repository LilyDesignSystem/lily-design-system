import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Dialog } from "../components/Dialog";
import { Drawer } from "../components/Drawer";

/** Modals open on first render, which is what used to break prerendering. See e2e/modals.spec.ts. */
@Component({
    selector: "lily-modals-open",
    standalone: true,
    imports: [Dialog, Drawer],
    template: `
    <article class="page-wrapper">
      <h1>Modals open on load</h1>
      <p>The page around them is still in the static HTML.</p>
      <lily-dialog label="Dialog" [open]="true"><p>Dialog body</p></lily-dialog>
      <lily-drawer label="Drawer" [open]="true"><p>Drawer body</p></lily-drawer>
    </article>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ModalsOpenPage {}
