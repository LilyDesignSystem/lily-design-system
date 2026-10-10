/*
    Example 2 — Two-way binding + (sizeChange) handler.

    `[(value)]` exposes the active slug to surrounding code.
    `(sizeChange)` fires after each apply — data-text-size is set and
    localStorage (if any) is written before this fires — which is the
    right hook for analytics, telling the server, or notifying a
    sibling component.
*/
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { TextSizePicker } from "../text-size-picker.component";

@Component({
  selector: "example-two-way-binding",
  standalone: true,
  imports: [TextSizePicker],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <lily-text-size-picker
      label="Text size"
      [sizes]="['small', 'medium', 'large', 'x-large']"
      [(value)]="size"
      (sizeChange)="trackSizeChange($event)"
    />

    <p>
      Current size: <strong>{{ size() || "(resolving…)" }}</strong>
    </p>
  `,
})
export class TwoWayBindingExample {
  size = signal("");

  trackSizeChange(slug: string): void {
    // e.g. fetch("/api/preferences", { method: "POST", body: JSON.stringify({ textSize: slug }) });
    console.info("text size changed:", slug);
  }
}
