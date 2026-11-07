import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CodeBlock component
 *
 * A block of preformatted code. Renders a <pre> with the `code-block` hook; whitespace is preserved by
 * the element. Syntax highlighting is the consumer's.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Names the block, which becomes role="region".
 *   <ng-content /> — projected content, required. The code text (usually a <code> element inside).
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-code-block label="…">…</lily-code-block>
 *
 * Examples:
 *   <lily-code-block label="Install"><code>pnpm install</code></lily-code-block>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - role="region" and aria-label come from `label` when given
 *   - A scrollable <pre> should be keyboard-focusable (tabindex="0") with an accessible name; pass both on the host element (Angular has no rest props)
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *
 * References:
 *   - MDN <pre>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/pre
 */
@Component({
    selector: "lily-code-block",
    standalone: true,
    template: `<pre class="code-block {{ className() }}" [attr.role]="label() ? 'region' : null" [attr.aria-label]="label() || null"><ng-content /></pre>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeBlock {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
