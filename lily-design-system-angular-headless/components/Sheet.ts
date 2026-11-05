import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    Directive,
    ElementRef,
    OnDestroy,
    inject,
    input,
    model,
    OnInit,
    PLATFORM_ID,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { warnMissingName } from "./dev-warning";

/**
 * Opens the host `<dialog>` as a real modal (tasks.md P18-T6): `showModal()` puts it in the top layer, makes the
 * page behind it inert, traps Tab and lets Escape fire `cancel`. Where `showModal` is missing (jsdom) it falls back
 * to the `open` attribute. Focus moves inside on open and returns to the element that had it on close.
 */
@Directive({ selector: "dialog[lilyModal]", standalone: true })
class ModalDialog implements AfterViewInit, OnDestroy {
    private readonly host = inject<ElementRef<HTMLDialogElement>>(ElementRef);
    private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
    private opener: HTMLElement | null = null;

    ngAfterViewInit(): void {
        // Prerendering has no document, and the dialog opens in the browser.
        if (!this.browser) return;
        const node = this.host.nativeElement;
        this.opener = document.activeElement as HTMLElement | null;
        if (!node.open) {
            if (typeof node.showModal === "function") node.showModal();
            else node.setAttribute("open", "");
        }
        if (!node.contains(document.activeElement)) node.focus();
    }

    ngOnDestroy(): void {
        const node = this.host.nativeElement;
        if (node.open) {
            if (typeof node.close === "function") node.close();
            else node.removeAttribute("open");
        }
        const opener = this.opener;
        if (opener && opener !== document.body && opener.isConnected) opener.focus();
    }
}

/**
 * Sheet — a panel that slides in from a screen edge as an overlay
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `sheet` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 *
 * Modal: while `open` it renders a native `<dialog>` opened with `showModal()`, so the page behind it is inert,
 * Tab stays inside, Escape (keydown or the native `cancel`) sets `open` to false, and focus returns to the
 * element that opened it.
 */
@Component({
    selector: "lily-sheet",
    standalone: true,
    template: `@if (open()) {
    <dialog
      lilyModal
      class="sheet {{ className() }}"
      tabindex="-1"
      aria-modal="true"
      [attr.aria-label]="label() || null"
      [attr.data-side]="side()"
      (keydown)="onKeydown($event)"
      (cancel)="onCancel($event)"
      (close)="open.set(false)"
    ><ng-content /></dialog>
  }`,
    imports: [ModalDialog],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sheet implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    /** Whether the panel is shown. Two-way bindable; Escape sets it to false. */
    readonly open = model<boolean>(false);
    /** Edge the panel attaches to; exposed as `data-side`. */
    readonly side = input<"left" | "right" | "top" | "bottom">("right");
    readonly className = input<string>("");

    protected onKeydown(event: KeyboardEvent): void {
        if (event.key === "Escape" && !event.defaultPrevented) {
            event.preventDefault();
            this.open.set(false);
        }
    }

    protected onCancel(event: Event): void {
        event.preventDefault();
        this.open.set(false);
    }

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "Sheet",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
