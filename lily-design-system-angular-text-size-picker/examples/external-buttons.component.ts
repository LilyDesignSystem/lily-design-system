/*
    Example 6 — Driving the control from your own UI.

    `value` is a `model<string>()` — an ordinary two-way-bindable
    signal — so your own UI can drive the picker without calling any
    method on the component. Sometimes you want bigger, more
    discoverable affordances than a dropdown: an A− / A+ preset row in
    a settings page, say.

    `size.set(slug)` runs exactly the same lifecycle the listbox does:
    the component's own effect() applies data-text-size, writes
    localStorage (if storageKey is set), and emits sizeChange — there
    is no separate "external" code path to keep in sync.

    `sizeName` is exported for exactly this reason: your own UI can
    render labels that match the listbox without duplicating the
    title-casing rule.

    Note the aria-pressed on each preset button — these are toggles,
    and the state must be readable by assistive technology, not just
    visible as a highlight (WCAG 1.4.1: no colour-only meaning).
*/
import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from "@angular/core";
import { TextSizePicker, sizeName } from "../text-size-picker.component";

@Component({
  selector: "example-external-buttons",
  standalone: true,
  imports: [TextSizePicker],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <lily-text-size-picker
      label="Text size"
      [sizes]="sizes"
      storageKey="lily-text-size"
      [(value)]="size"
    />

    <div role="group" aria-label="Text size presets">
      @for (slug of sizes; track slug) {
        <button
          type="button"
          [attr.aria-pressed]="slug === size()"
          (click)="size.set(slug)"
        >
          {{ sizeName(slug) }}
        </button>
      }
    </div>

    <p class="text-size-picker-status" aria-live="polite">
      Text size: {{ size() ? sizeName(size()) : "none" }}
    </p>
  `,
})
export class ExternalButtonsExample {
  readonly sizes = ["small", "medium", "large", "x-large"];
  readonly size = signal("");

  /** Bound so the template can call the exported label resolver. */
  protected readonly sizeName = sizeName;
}
