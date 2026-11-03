import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ArticleLayout component
 *
 * The outer wrapper of an editorial article. Renders an <article> with the `article-layout` hook; the
 * column widths its children use are set by the consumer's CSS, not by this component.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Accessible name, rendered as aria-label on the root.
 *   <ng-content /> — projected content, required. The article content (headline, byline, content blocks).
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-article-layout label="…">…</lily-article-layout>
 *
 * Examples:
 *   <lily-article-layout label="Annual report"><lily-headline>…</lily-headline><lily-content-block>…</lily-content-block></lily-article-layout>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - The native <article> element supplies the article role
 *   - aria-label comes from `label` when given
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *   - Sets no custom properties and no widths; define column widths in CSS
 *
 * References:
 *   - MDN <article>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article
 *   - Reuters Graphics Article (the inspiration): https://github.com/reuters-graphics/graphics-components
 */
@Component({
    selector: "lily-article-layout",
    standalone: true,
    template: `<article class="article-layout {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></article>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleLayout {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
