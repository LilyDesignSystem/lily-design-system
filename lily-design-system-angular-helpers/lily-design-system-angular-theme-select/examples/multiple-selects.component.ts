/*
    Example 7 — Multiple pickers in one page.

    Each picker gets a distinct `name`. The `name` plays two roles:
      1. It is the radio-input `name`, so the two groups don't share
         state.
      2. It is the discriminator on the managed <link> element, so each
         picker swaps its own stylesheet without stepping on the other.

    This is useful for: a "global" theme + a per-section accent theme;
    preview-vs-live theme A/B; or a settings page that compares two
    themes side-by-side.

    Note: the active `data-theme` attribute on <html> is set by whichever
    picker fires last. If you want two independent regions, pass a
    per-picker `target` so each updates a different DOM subtree.
*/
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    viewChild,
} from "@angular/core";
import { ThemeSelect } from "../theme-select.component";

@Component({
    selector: "example-multiple-pickers",
    standalone: true,
    imports: [ThemeSelect],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <section #regionA>
            <lily-theme-select
                label="Region A theme"
                name="region-a"
                themesUrl="/assets/themes/"
                [themes]="['light', 'dark']"
                [target]="regionA"
            />
        </section>

        <section #regionB>
            <lily-theme-select
                label="Region B theme"
                name="region-b"
                themesUrl="/assets/themes/"
                [themes]="['abyss', 'cupcake', 'dracula']"
                [target]="regionB"
            />
        </section>
    `,
})
export class MultiplePickersExample {
    readonly regionA = viewChild<ElementRef<HTMLElement>>("regionA");
    readonly regionB = viewChild<ElementRef<HTMLElement>>("regionB");
}
