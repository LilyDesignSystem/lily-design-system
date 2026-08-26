import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { Button } from "../components/Button";
import { Dialog } from "../components/Dialog";

@Component({
  selector: "lily-dialog-flow",
  standalone: true,
  imports: [Button, Dialog],
  template: `
    <article class="page-wrapper">
      <h1>Dialog flow</h1>
      <lily-button (click)="open.set(!open())">{{ open() ? "Close" : "Open" }} dialog</lily-button>

      <lily-dialog label="Confirmation" [open]="open()">
        <p>Are you sure you want to continue?</p>
        <lily-button (click)="open.set(false)">OK</lily-button>
      </lily-dialog>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DialogFlowPage {
  protected open = signal(false);
}
