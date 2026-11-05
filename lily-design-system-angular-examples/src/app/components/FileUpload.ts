import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
    signal,
} from "@angular/core";

/**
 * FileUpload — a drag-and-drop area for uploading files
 *
 * Headless Angular component: the button clicks a hidden file input. The status is the consumer's words, from
 * `selectedLabel`: the Svelte component's English "files selected" is not ported. Ships zero CSS.
 */
@Component({
    selector: "lily-file-upload",
    standalone: true,
    template: `<div class="file-upload {{ className() }}">
        <button type="button" [attr.aria-label]="label()" [disabled]="disabled()" (click)="picker.click()">
            {{ label() }}
        </button>
        <input
            #picker
            type="file"
            [attr.accept]="accept() || null"
            [multiple]="multiple()"
            hidden
            (change)="changed($any($event.target).files)"
        />
        <span aria-live="polite" [attr.data-file-count]="fileCount()">{{
            fileCount() > 0 ? selectedLabel()?.(fileCount()) : ""
        }}</span>
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUpload {
    readonly label = input.required<string>();
    readonly accept = input<string>("");
    readonly multiple = input<boolean>(false);
    readonly disabled = input<boolean>(false);
    /** The status for a count of files; plural forms are the consumer's. */
    readonly selectedLabel = input<((count: number) => string) | null>(null);
    readonly className = input<string>("");
    readonly filesChange = output<FileList | null>();

    protected readonly fileCount = signal(0);

    protected changed(files: FileList | null): void {
        this.fileCount.set(files?.length ?? 0);
        this.filesChange.emit(files);
    }
}
