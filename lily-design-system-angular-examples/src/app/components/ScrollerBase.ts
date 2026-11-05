import {
    afterNextRender,
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    input,
    output,
    PLATFORM_ID,
    viewChild,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

/**
 * ScrollerBase — a low-level scroll position tracking primitive for scrollytelling
 *
 * Headless Angular component: each direct child is a step, current when it crosses the line `offset` of the way down the
 * viewport. `progressChange` is 0 to 1 through the page. Ships zero CSS.
 */
@Component({
    selector: "lily-scroller-base",
    standalone: true,
    template: `<div #root class="scroller-base {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollerBase {
    readonly label = input<string>("");
    readonly offset = input<number>(0.5);
    readonly className = input<string>("");
    readonly indexChange = output<number>();
    readonly progressChange = output<number>();

    private readonly root = viewChild.required<ElementRef<HTMLElement>>("root");

    constructor() {
        const destroyRef = inject(DestroyRef);
        const browser = isPlatformBrowser(inject(PLATFORM_ID));
        afterNextRender(() => {
            // This also runs while prerendering, where there is no window.
            if (!browser) return;
            const root = this.root().nativeElement;
            const steps = Array.from(root.children);
            const offset = this.offset();
            let observer: IntersectionObserver | undefined;
            if (typeof IntersectionObserver !== "undefined") {
                observer = new IntersectionObserver(
                    (entries) => {
                        for (const entry of entries) {
                            const index = steps.indexOf(entry.target);
                            if (entry.isIntersecting && index !== -1) this.indexChange.emit(index);
                        }
                    },
                    {
                        rootMargin: `-${(offset * 100).toFixed(2)}% 0px -${(100 - offset * 100).toFixed(2)}% 0px`,
                        threshold: 0,
                    },
                );
                for (const step of steps) observer.observe(step);
            }
            const onScroll = () => {
                const rect = root.getBoundingClientRect();
                const height = window.innerHeight || 1;
                this.progressChange.emit(
                    Math.max(0, Math.min(1, (height - rect.top) / (rect.height + height))),
                );
            };
            window.addEventListener("scroll", onScroll, { passive: true });
            onScroll();
            destroyRef.onDestroy(() => {
                observer?.disconnect();
                window.removeEventListener("scroll", onScroll);
            });
        });
    }
}
