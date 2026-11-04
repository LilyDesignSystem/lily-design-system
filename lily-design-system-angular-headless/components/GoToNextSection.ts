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
 * GoToNextSection component
 *
 * A link that takes the user to the next section of the current page. Renders an <a> with the `go-to-
 * next-section` hook whose visible text and accessible name are both `label`.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, required. The link text, also set as aria-label.
 *   href — string, required. The URL of the next section, typically #section-id.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-go-to-next-section href="#…" label="…" />
 *
 * Examples:
 *   <lily-go-to-next-section href="#section-id" label="…" />
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
    selector: "lily-go-to-next-section",
    standalone: true,
    template: `<a class="go-to-next-section {{ className() }}" [attr.href]="href() || null" [attr.aria-label]="label() || null">{{ label() }}</a>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoToNextSection implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    /** Visible text and accessible name. */
    readonly label = input<string>("");
    /** The next section's fragment, for example "#results". */
    readonly href = input<string>("");
    readonly className = input<string>("");

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "GoToNextSection",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
