import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * ScrollBar — a custom scrollbar element
 *
 * Headless Angular component. Renders a focusable `<div role="scrollbar">`
 * with the kebab-case class hook `scroll-bar` and the consumer-provided
 * `className`. Ships zero CSS; the consumer styles via the class hook.
 *
 * The keys move the two-way `value`: Arrow Up/Left and Arrow Down/Right by
 * `step`, Page Up/Page Down by `pageStep`, Home/End to `min`/`max`, clamped.
 * The consumer scrolls its content to the value, writes the value back as the
 * content scrolls, and handles drag.
 */
@Component({
    selector: "lily-scroll-bar",
    standalone: true,
    template: `<div
    class="scroll-bar {{ className() }}"
    role="scrollbar"
    tabindex="0"
    [attr.aria-label]="label() || null"
    [attr.aria-orientation]="orientation()"
    [attr.aria-controls]="controls() || null"
    [attr.aria-valuenow]="value()"
    [attr.aria-valuemin]="min()"
    [attr.aria-valuemax]="max()"
    (keydown)="onKeydown($event)"
  ><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollBar {
    readonly label = input<string>("");
    readonly orientation = input<"vertical" | "horizontal">("vertical");
    /** Scroll position. Two-way bindable. */
    readonly value = model<number>(0);
    readonly min = input<number>(0);
    readonly max = input<number>(100);
    /** Arrow-key increment. */
    readonly step = input<number>(1);
    /** Page Up / Page Down increment. */
    readonly pageStep = input<number>(10);
    /** Id of the scrolled element, via aria-controls. */
    readonly controls = input<string>("");
    readonly className = input<string>("");

    private clamp(v: number): number {
        return Math.min(this.max(), Math.max(this.min(), v));
    }

    protected onKeydown(event: KeyboardEvent): void {
        switch (event.key) {
            case "ArrowUp":
            case "ArrowLeft":
                this.value.set(this.clamp(this.value() - this.step()));
                break;
            case "ArrowDown":
            case "ArrowRight":
                this.value.set(this.clamp(this.value() + this.step()));
                break;
            case "PageUp":
                this.value.set(this.clamp(this.value() - this.pageStep()));
                break;
            case "PageDown":
                this.value.set(this.clamp(this.value() + this.pageStep()));
                break;
            case "Home":
                this.value.set(this.min());
                break;
            case "End":
                this.value.set(this.max());
                break;
            default:
                return;
        }
        event.preventDefault();
    }
}
