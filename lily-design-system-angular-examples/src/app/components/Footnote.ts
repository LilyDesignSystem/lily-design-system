import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Footnote — a footnote reference and content element
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `footnote` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-footnote",
    standalone: true,
    template: `<span class="footnote {{ className() }}" role="note" [attr.id]="id() ?? null" [attr.aria-label]="label() || id() || null"><ng-content /></span>`,
    // The id belongs on the element: left on the host too it would be a duplicate.
    host: { "[attr.id]": "null" },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footnote {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Id a reference links to; also its name unless label is given. */
    readonly id = input<string | undefined>(undefined);
}
