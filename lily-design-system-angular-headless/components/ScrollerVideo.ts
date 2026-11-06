import {
    afterNextRender,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    input,
    OnInit,
    output,
    viewChild,
} from "@angular/core";
import { warnMissingName } from "./dev-warning";
import { ScrollerBase } from "./ScrollerBase";

/**
 * ScrollerVideo — a video-driven scrollytelling component with frame-by-frame scrubbing
 *
 * Headless Angular component: a muted background video whose time follows a `ScrollerBase`. The steps are projected. Ships zero
 * CSS.
 */
@Component({
    selector: "lily-scroller-video",
    standalone: true,
    imports: [ScrollerBase],
    template: `<div class="scroller-video {{ className() }}" [attr.role]="label() ? 'group' : null" [attr.aria-label]="label() || null">
        <div
            class="scroller-video-background"
            role="img"
            aria-roledescription="scrollable video"
            [attr.aria-label]="alt()"
        >
            <video #video class="scroller-video-element" [src]="src()" [muted]="true" playsinline preload="auto"></video>
        </div>
        <lily-scroller-base
            className="scroller-video-foreground"
            [offset]="offset()"
            (indexChange)="indexChange.emit($event)"
            (progressChange)="onProgress($event)"
        >
            <ng-content />
        </lily-scroller-base>
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollerVideo implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly src = input.required<string>();
    readonly label = input<string>("");
    readonly alt = input.required<string>();
    readonly offset = input<number>(0.5);
    readonly className = input<string>("");
    readonly indexChange = output<number>();
    readonly progressChange = output<number>();

    private readonly video = viewChild.required<ElementRef<HTMLVideoElement>>("video");

    protected onProgress(progress: number): void {
        const video = this.video().nativeElement;
        if (Number.isFinite(video.duration) && video.duration > 0)
            video.currentTime = video.duration * progress;
        this.progressChange.emit(progress);
    }

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "ScrollerVideo",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
