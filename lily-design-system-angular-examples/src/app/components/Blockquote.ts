import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Blockquote — a block-level quotation with optional source citation
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `blockquote` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-blockquote",
    standalone: true,
    template: `<blockquote class="blockquote {{ className() }}" [attr.aria-label]="label() || null" [attr.cite]="cite() ?? null"><ng-content />@if (citationText()) {<footer class="blockquote-citation">{{ citationText() }}</footer>}</blockquote>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Blockquote {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Source address. */
    readonly cite = input<string | undefined>(undefined);
    /** Visible citation. */
    readonly citationText = input<string | undefined>(undefined);
}
