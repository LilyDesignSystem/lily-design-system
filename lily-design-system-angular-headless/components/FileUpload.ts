import { ChangeDetectionStrategy, Component, input, output, signal } from "@angular/core";

/**
 * FileUpload — a drag-and-drop area for uploading files
 *
 * Headless Angular component: the button clicks a hidden file input. The status is the consumer's words, from
 * `selectedLabel`, as in Svelte; no English default. Ships zero CSS.
 */
/** The files a drop carries: all of them with `multiple`, else the first. */
function droppedFiles(files: FileList, multiple: boolean): FileList {
    if (multiple || files.length <= 1 || typeof DataTransfer === "undefined") return files;
    const one = new DataTransfer();
    one.items.add(files[0]);
    return one.files;
}

@Component({
    selector: "lily-file-upload",
    standalone: true,
    template: `<div
        class="file-upload {{ className() }}"
        [attr.data-drop-zone]="dropZone() ? '' : null"
        [attr.data-drag-over]="dragOver() ? '' : null"
        (dragover)="onDragOver($event)"
        (dragleave)="dragOver.set(false)"
        (drop)="onDrop($event)"
    >
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
    /** The root also accepts dropped files, into the same output and count; the button stays the keyboard path. */
    readonly dropZone = input<boolean>(false);
    readonly filesChange = output<FileList | null>();

    protected readonly fileCount = signal(0);
    protected readonly dragOver = signal(false);

    protected onDragOver(event: DragEvent): void {
        if (!this.dropZone() || this.disabled() || !event.dataTransfer?.types.includes("Files"))
            return;
        event.preventDefault();
        this.dragOver.set(true);
    }

    protected onDrop(event: DragEvent): void {
        if (!this.dropZone() || this.disabled()) return;
        event.preventDefault();
        this.dragOver.set(false);
        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) return;
        this.changed(droppedFiles(files, this.multiple()));
    }

    protected changed(files: FileList | null): void {
        this.fileCount.set(files?.length ?? 0);
        this.filesChange.emit(files);
    }
}
