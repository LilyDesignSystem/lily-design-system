/*
    Example 1 — Basic usage.

    The minimum viable picker: a label and a slug list. The control
    resolves "medium" as the initial active size (since "medium" is in
    the list) and sets data-text-size="medium" on <html>.

    The status line is part of the basic pattern, not an add-on. The
    control is an icon button: closed, it shows only the "A" glyph, and
    its accessible name is always the static aria-label ("Text size"),
    never the active size — so without this line neither a sighted user
    nor a screen reader can read the current selection back off the
    closed control.

    Two deliberate choices, mirroring theme-picker's basic example:

    1. It is VISIBLE, not sr-only. Naming the current size in plain
       text helps sighted and cognitively-impaired users too, and WCAG
       2.2 AAA favours it. If a design genuinely cannot spare the
       space, keep the element and hide it visually instead of
       deleting it.

    2. aria-live="polite" announces MUTATIONS only, so this stays
       silent on first paint and speaks once on each subsequent change.

    labelFor() is the component's own label resolver, reached through
    the #textSizePicker template reference, so the status line shows
    the same human label as the option ("X Large", not "x-large").

    The CSS that actually resizes the page is yours — the package ships
    zero typography. Map each [data-text-size="…"] slug to a font-size
    on :root using relative units; see ../docs/accessibility.md.
*/
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { TextSizePicker } from "../text-size-picker.component";

@Component({
  selector: "example-basic",
  standalone: true,
  imports: [TextSizePicker],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <lily-text-size-picker
      #textSizePicker
      label="Text size"
      [sizes]="['small', 'medium', 'large', 'x-large']"
      [(value)]="size"
    />

    <p class="text-size-picker-status" aria-live="polite">
      Text size: {{ textSizePicker.labelFor(size()) }}
    </p>
  `,
})
export class BasicExample {
  size = signal("");
}
