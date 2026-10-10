/*
    Example 7 — Multiple pickers in one page.

    Each picker gets a distinct `name` and a distinct `target`. The
    `name` plays two roles:
      1. It is the hidden input's `name`, so a surrounding <form>
         receives the two selections as separate fields.
      2. It keeps each picker's `sizeChange` payload distinguishable
         when both are logged to the same handler.

    `target` scopes what actually receives `data-text-size`: without
    it, every picker on the page competes to set the same attribute on
    <html>, and whichever applies last wins. Passing a per-picker
    `target` lets two independent regions — e.g. a "reading pane"
    preview at one size while the rest of the page stays at another —
    coexist.

    Note the `regionA()?.nativeElement ?? null` unwrap: `target` is
    typed `HTMLElement | null`, and `viewChild(...)` returns a
    `Signal<ElementRef<HTMLElement> | undefined>`, so the signal must
    be called and its `.nativeElement` read before it can be passed in.
*/
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  viewChild,
} from "@angular/core";
import { TextSizePicker } from "../text-size-picker.component";

@Component({
  selector: "example-multiple-pickers",
  standalone: true,
  imports: [TextSizePicker],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section #regionA>
      <lily-text-size-picker
        label="Sidebar text size"
        name="sidebar-text-size"
        [sizes]="['small', 'medium', 'large']"
        [target]="regionA()?.nativeElement ?? null"
      />
    </section>

    <section #regionB>
      <lily-text-size-picker
        label="Reading pane text size"
        name="reading-pane-text-size"
        [sizes]="['medium', 'large', 'x-large', 'xx-large']"
        [target]="regionB()?.nativeElement ?? null"
      />
    </section>
  `,
})
export class MultiplePickersExample {
  readonly regionA = viewChild<ElementRef<HTMLElement>>("regionA");
  readonly regionB = viewChild<ElementRef<HTMLElement>>("regionB");
}
