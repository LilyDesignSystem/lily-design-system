/*
    Example 7 — Multiple choosers in one page.

    Each chooser gets a distinct `name`. The `name` plays two roles:
      1. It is the hidden input's `name`, so a surrounding <form>
         receives the two selections as separate fields.
      2. It is the discriminator on the managed <link> element, so each
         chooser swaps its own stylesheet without stepping on the other.

    This is useful for: a "global" theme + a per-section accent theme;
    preview-vs-live theme A/B; or a settings page that compares two
    themes side-by-side.

    Note: the active `data-theme` attribute on <html> is set by whichever
    chooser fires last. If you want two independent regions, pass a
    per-chooser `target` so each updates a different DOM subtree.
*/
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    viewChild,
} from "@angular/core";
import { ThemeChooser } from "../theme-chooser.component";

@Component({
    selector: "example-multiple-choosers",
    standalone: true,
    imports: [ThemeChooser],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <section #regionA>
            <lily-theme-chooser
                label="Region A theme"
                name="region-a"
                themesUrl="/assets/themes/"
                [themes]="['light', 'dark']"
                [target]="regionA"
            />
        </section>

        <section #regionB>
            <lily-theme-chooser
                label="Region B theme"
                name="region-b"
                themesUrl="/assets/themes/"
                [themes]="['abyss', 'cupcake', 'dracula']"
                [target]="regionB"
            />
        </section>
    `,
})
export class MultipleSelectsExample {
    readonly regionA = viewChild<ElementRef<HTMLElement>>("regionA");
    readonly regionB = viewChild<ElementRef<HTMLElement>>("regionB");
}
