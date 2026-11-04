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
 * HorizontalScroller component
 *
 * A horizontally scrollable region that is keyboard-operable. Renders a <div role="region"
 * tabindex="0"> with the `horizontal-scroller` hook and scrolls it with the arrow keys; pointer and
 * touch scrolling stay native overflow behaviour.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, required. Accessible name. Rendered as aria-label.
 *   step — number, default 100. Pixels moved by one ArrowLeft or ArrowRight press.
 *   <ng-content /> — projected content, required. The content.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-horizontal-scroller label="…" step={100}>…</lily-horizontal-scroller>
 *
 * Examples:
 *   <lily-horizontal-scroller label="Quarterly figures"><table>…</table></lily-horizontal-scroller>
 *
 * Keyboard:
 *   - ArrowRight: scrolls right by `step`
 *   - ArrowLeft: scrolls left by `step`
 *   - Home: scrolls to the start
 *   - End: scrolls to the end
 *   - All scrolling is smooth; honour prefers-reduced-motion in the consumer's CSS (scroll-behavior) if needed
 *
 * Accessibility:
 *   - role="region" with aria-label makes it a named landmark
 *   - tabindex="0" makes the scrollable region keyboard-focusable (axe scrollable-region-focusable); the Svelte a11y warning is deliberately ignored
 *   - Left and right keys are physical, not logical: in right-to-left layouts ArrowRight still scrolls right
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *   - Overflow, widths and scroll snapping are the consumer's CSS
 *
 * References:
 *   - axe scrollable-region-focusable: https://dequeuniversity.com/rules/axe/4.10/scrollable-region-focusable
 *   - WCAG 1.4.10 Reflow: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
 */
@Component({
    selector: "lily-horizontal-scroller",
    standalone: true,
    template: `<div
    class="horizontal-scroller {{ className() }}"
    role="region"
    tabindex="0"
    [attr.aria-label]="label() || null"
    (keydown)="onKeydown($event)"
  ><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HorizontalScroller implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    /** Pixels scrolled by ArrowLeft / ArrowRight. */
    readonly step = input<number>(100);
    readonly className = input<string>("");

    protected onKeydown(event: KeyboardEvent): void {
        const el = event.currentTarget as HTMLElement;
        switch (event.key) {
            case "ArrowRight":
                el.scrollBy({ left: this.step(), behavior: "smooth" });
                break;
            case "ArrowLeft":
                el.scrollBy({ left: -this.step(), behavior: "smooth" });
                break;
            case "Home":
                el.scrollTo({ left: 0, behavior: "smooth" });
                break;
            case "End":
                el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
                break;
            default:
                return;
        }
        event.preventDefault();
    }

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "HorizontalScroller",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
