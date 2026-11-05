import {
    afterNextRender,
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    input,
    OnInit,
    viewChild,
} from "@angular/core";
import { warnMissingName } from "./dev-warning";

/**
 * VideoPlayer — a video player with play-in-view behavior, custom controls, and IntersectionObserver support
 *
 * Headless Angular component: the contract's `<div>` holding a native `<video>`. Project custom controls with the `controls`
 * attribute and a caption with the `caption` attribute. Autoplay means play while in view, and browsers block sound, so pair
 * it with `muted`. Ships zero CSS.
 */
@Component({
    selector: "lily-video-player",
    standalone: true,
    template: `<div class="video-player {{ className() }}" role="group" [attr.aria-label]="label() || null">
        <video
            #video
            class="video-player-element"
            [src]="src()"
            [attr.poster]="poster() || null"
            [muted]="muted()"
            [loop]="loop()"
            [controls]="controls()"
            playsinline
        ></video>
        <ng-content select="[controls]" />
        <ng-content select="[caption]" />
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPlayer implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly src = input.required<string>();
    readonly label = input<string>("");
    readonly poster = input<string>("");
    /** Play while at least half of the video is in view. */
    readonly autoplay = input<boolean>(false);
    readonly muted = input<boolean>(false);
    readonly loop = input<boolean>(false);
    readonly controls = input<boolean>(true);
    readonly className = input<string>("");

    private readonly video = viewChild.required<ElementRef<HTMLVideoElement>>("video");

    constructor() {
        const destroyRef = inject(DestroyRef);
        afterNextRender(() => {
            if (!this.autoplay() || typeof IntersectionObserver === "undefined") return;
            const video = this.video().nativeElement;
            const observer = new IntersectionObserver(
                (entries) => {
                    for (const entry of entries) {
                        if (entry.isIntersecting) void video.play().catch(() => {});
                        else video.pause();
                    }
                },
                { threshold: 0.5 },
            );
            observer.observe(video);
            destroyRef.onDestroy(() => observer.disconnect());
        });
    }

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "VideoPlayer",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
