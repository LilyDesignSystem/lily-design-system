import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DownloadButton — a download link styled as a button, with optional file size and format metadata
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `download-button` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-download-button",
    standalone: true,
    template: `<a
      class="download-button {{ className() }}"
      [attr.href]="href() || null"
      [attr.aria-label]="label() || null"
      [attr.data-file-size]="fileSize() || null"
      [attr.data-file-format]="fileFormat() || null"
      [attr.download]="download() === true ? '' : download() || null"
      ><ng-content
    /></a>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadButton {
    /** Optional aria-label override. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The file's URL. */
    readonly href = input<string>("");
    /** Shown file size, for example "2 MB", exposed as data-file-size. */
    readonly fileSize = input<string>("");
    /** Shown file format, for example "PDF", exposed as data-file-format. */
    readonly fileFormat = input<string>("");
    /** true downloads under the URL's name; a string names the saved file. */
    readonly download = input<boolean | string>(false);
}
