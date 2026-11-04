import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    OnInit,
    inject,
    input,
} from "@angular/core";
import { attachRadioGroup } from "./widget-keys";
import { warnMissingName } from "./dev-warning";

/**
 * SegmentGroup — a group of mutually exclusive segment options
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `segment-group` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-segment-group",
    standalone: true,
    template: `<div class="segment-group {{ className() }}" role="radiogroup" [attr.aria-label]="label() || null"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SegmentGroup implements OnInit {
    private readonly keysHost = inject(ElementRef);
    private readonly keysDestroy = inject(DestroyRef);

    ngAfterViewInit(): void {
        const root = this.keysHost.nativeElement.querySelector(".segment-group");
        this.keysDestroy.onDestroy(attachRadioGroup(root));
    }

    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    readonly className = input<string>("");

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "SegmentGroup",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
