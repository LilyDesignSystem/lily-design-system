import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    input,
    output,
} from "@angular/core";
import { attachCropper, type CropRect } from "./widget-keys";

/**
 * ImageCropper — a container for cropping and resizing an image to a selected region
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `image-cropper` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook and supplies the
 * image plus crop overlay UI as children.
 */
@Component({
    selector: "lily-image-cropper",
    standalone: true,
    template: `<div class="image-cropper {{ className() }}" role="application" [attr.aria-label]="label() || null"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageCropper {
    private readonly keysHost = inject(ElementRef);
    private readonly keysDestroy = inject(DestroyRef);

    ngAfterViewInit(): void {
        const root = this.keysHost.nativeElement.querySelector(".image-cropper");
        this.keysDestroy.onDestroy(
            attachCropper(root, {
                crop: this.crop(),
                onChange: (next) => this.cropChange.emit(next),
            }),
        );
    }

    readonly label = input.required<string>();
    /** Where the rectangle starts, in percent. Default: the whole image. */
    readonly crop = input<CropRect | undefined>(undefined);
    /** Each new rectangle. */
    readonly cropChange = output<CropRect>();
    readonly className = input<string>("");
}
