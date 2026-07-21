/*
    Scoped target — change locale of one region, not the whole page.

    Useful for multilingual content panels: a single page with two
    cards each in a different language. Pass `[target]="panel"` so
    the select writes lang/dir to that element instead of <html>.

    Outcome: the surrounding page stays in its document language; the
    chosen panel switches independently. Two panels each scoped to
    their own select.
*/
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    signal,
    viewChild,
} from "@angular/core";
import { LocaleChooser } from "../locale-chooser.component";

@Component({
    selector: "example-scoped-target",
    standalone: true,
    imports: [LocaleChooser],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <article>
            <h1>Document language stays English; panels switch independently.</h1>

            <section #panelA class="panel">
                <h2>Panel A</h2>
                <lily-locale-chooser
                    label="Panel A language"
                    [locales]="['en', 'fr', 'ar']"
                    [target]="panelA.nativeElement"
                    [(value)]="aLocale"
                />
                <p>Current panel locale: <code>{{ aLocale() }}</code></p>
            </section>

            <section #panelB class="panel">
                <h2>Panel B</h2>
                <lily-locale-chooser
                    label="Panel B language"
                    [locales]="['en', 'fr', 'ar']"
                    [target]="panelB.nativeElement"
                    [(value)]="bLocale"
                />
                <p>Current panel locale: <code>{{ bLocale() }}</code></p>
            </section>
        </article>
    `,
})
export class ScopedTargetExample {
    panelA = viewChild<ElementRef<HTMLElement>>("panelA");
    panelB = viewChild<ElementRef<HTMLElement>>("panelB");

    aLocale = signal("en");
    bLocale = signal("fr");
}
