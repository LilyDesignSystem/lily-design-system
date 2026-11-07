import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Code component
 *
 * Inline computer code. Renders a <code> with the `code` hook; use CodeBlock for multi-line code.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   <ng-content /> — projected content, required. The code text.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-code>…</lily-code>
 *
 * Examples:
 *   <p>Run <lily-code>pnpm install</lily-code> first.</p>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *
 * References:
 *   - MDN <code>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/code
 */
@Component({
    selector: "lily-code",
    standalone: true,
    template: `<code class="code {{ className() }}"><ng-content /></code>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Code {
    readonly className = input<string>("");
}
