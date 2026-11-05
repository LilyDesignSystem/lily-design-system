import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";

/**
 * FloatButton — a floating action button anchored to a viewport corner
 *
 * Headless Angular component, fixed to a corner by an inline style, which is structural. A native click bubbles to the host,
 * so listen with `(click)`. Ships zero CSS.
 */
@Component({
    selector: "lily-float-button",
    standalone: true,
    template: `<button
        class="float-button {{ className() }}"
        [type]="type()"
        [disabled]="disabled()"
        [attr.aria-label]="label() || null"
        [attr.data-position]="position()"
        [attr.style]="positionStyle()"
    ><ng-content /></button>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatButton {
    /** Accessible name. */
    readonly label = input<string>("");
    readonly position = input<"top-left" | "top-right" | "bottom-left" | "bottom-right">(
        "bottom-right",
    );
    readonly disabled = input<boolean>(false);
    readonly type = input<"button" | "submit" | "reset">("button");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");

    protected readonly positionStyle = computed(() => {
        const [block, inline] = this.position().split("-");
        return `position: fixed; ${block}: 1rem; ${inline}: 1rem;`;
    });
}
