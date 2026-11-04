import {
    ChangeDetectionStrategy,
    Component,
    input,
    ElementRef,
    OnInit,
    inject,
} from "@angular/core";
import { warnMissingName } from "./dev-warning";

/**
 * GoToPreviousSection component
 *
 * A link that takes the user to the previous section of the current page. Renders an <a> with the `go-
 * to-previous-section` hook whose visible text and accessible name are both `label`.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, required. The link text, also set as aria-label.
 *   href — string, required. The URL of the previous section, typically #section-id.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-go-to-previous-section href="#…" label="…" />
 *
 * Examples:
 *   <lily-go-to-previous-section href="#section-id" label="…" />
 *
 * Keyboard:
 *   - Tab: moves focus onto the link
 *   - Enter: follows the link (native browser behaviour)
 *
 * Accessibility:
 *   - A native <a href> link: the destination and the link text give the role and name
 *   - aria-label repeats the visible text; keep them identical (WCAG 2.5.3)
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *   - The link text is the consumer's translated `label`; the component has no text of its own
 *
 * References:
 *   - MDN <a>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a
 */
@Component({
    selector: "lily-go-to-previous-section",
    standalone: true,
    template: `<a class="go-to-previous-section {{ className() }}" [attr.href]="href() || null" [attr.aria-label]="label() || null">{{ label() }}</a>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoToPreviousSection implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    /** Visible text and accessible name. */
    readonly label = input<string>("");
    /** The previous section's fragment, for example "#summary". */
    readonly href = input<string>("");
    readonly className = input<string>("");

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "GoToPreviousSection",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
