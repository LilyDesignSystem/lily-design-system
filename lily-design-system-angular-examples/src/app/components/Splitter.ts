import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    OnInit,
    inject,
    input,
    model,
} from "@angular/core";
import { attachSplitter } from "./widget-keys";
import { warnMissingName } from "./dev-warning";

/**
 * Splitter — a draggable divider for resizing adjacent panels
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `splitter` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-splitter",
    standalone: true,
    template: `<div
    class="splitter {{ className() }}"
    role="separator"
    tabindex="0"
    [attr.aria-label]="label() || null"
    [attr.aria-orientation]="orientation()"
    [attr.aria-valuenow]="value()"
    [attr.aria-valuemin]="min()"
    [attr.aria-valuemax]="max()"
  ></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Splitter implements OnInit {
    private readonly keysHost = inject(ElementRef);
    private readonly keysDestroy = inject(DestroyRef);

    readonly orientation = input<"horizontal" | "vertical">("vertical");
    /** Position. Two-way bindable. */
    readonly value = model<number>(50);
    readonly min = input<number>(0);
    readonly max = input<number>(100);

    ngAfterViewInit(): void {
        const separator = this.keysHost.nativeElement.querySelector(".splitter");
        this.keysDestroy.onDestroy(
            attachSplitter(separator, { onChange: (next) => this.value.set(next) }),
        );
    }

    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    readonly className = input<string>("");

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "Splitter",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
