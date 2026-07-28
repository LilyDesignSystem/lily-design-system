/*
    Example 5 — Custom rendering: replacing the button glyph.

    TextSizePicker exposes exactly one rendering escape hatch: a
    projected <ng-template> that replaces the glyph inside the trigger
    button. The listbox — its role, options, aria-selected flags,
    aria-activedescendant wiring, and keyboard contract — stays
    component-owned. That narrowness is the point: the accessibility
    contract is the component's job, not the consumer's.

    Two overrides below.

    1. An inline SVG. The default "A" glyph is a font character, so it
       inherits the page's own typeface — and, being a text-size
       control, its rendered size shifts with the very setting it
       adjusts. An SVG sized in px stays put. Keep aria-hidden="true"
       and focusable="false" on it — the button is named by its
       aria-label, and a named or focusable graphic inside only adds
       noise.

    2. A text label plus an open/closed caret, using the ChildArgs
       context: { value, open, labelFor }, passed as both $implicit
       and named properties.

       Note the tradeoff this second form carries. The button now has
       visible text AND an aria-label, and aria-label wins in the
       accessibility tree — so a voice-control user saying the visible
       words may fail to activate it (WCAG 2.5.3 Label in Name). Here
       the label is "Text size" and the visible text is the size name,
       so they do not match. Prefer the status-region pattern in
       basic.component.ts, which surfaces the active size without
       touching the button's name.

    The TextSizePickerIcon marker directive is optional. It gives typed
    let- variables under strictTemplates via its
    ngTemplateContextGuard; the component queries any projected
    <ng-template>, so it changes nothing at runtime.

    Note also that .text-size-picker-icon is not rendered when a
    template is projected, so CSS written against that hook no longer
    applies.
*/
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import {
  TextSizePicker,
  TextSizePickerIcon,
} from "../text-size-picker.component";

@Component({
  selector: "example-custom-rendering",
  standalone: true,
  imports: [TextSizePicker, TextSizePickerIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- 1. Inline SVG replacing the default glyph. -->
    <lily-text-size-picker label="Text size" [sizes]="sizes" [(value)]="size">
      <ng-template>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M4 20 L10 4 L16 20 M6.5 14 H13.5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
      </ng-template>
    </lily-text-size-picker>

    <!-- 2. Text label + caret, driven by the ChildArgs context. -->
    <lily-text-size-picker
      label="Text size"
      name="labelled"
      [sizes]="sizes"
      [(value)]="size"
    >
      <ng-template lilyTextSizePickerIcon let-args>
        {{ args.labelFor(args.value) }}
        <span aria-hidden="true">{{ args.open ? "▴" : "▾" }}</span>
      </ng-template>
    </lily-text-size-picker>
  `,
})
export class CustomRenderingExample {
  readonly sizes = ["small", "medium", "large", "x-large"];
  size = signal("");
}
