import {
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    inject,
    input,
    model,
    OnInit,
} from "@angular/core";
import { warnMissingName } from "./dev-warning";
import { restoreOnFormReset } from "./form-reset";

let nextId = 0;

/**
 * AccordionCheckbox — a checkbox option that reveals an accordion panel when checked
 *
 * Headless Angular component: a real checkbox with `aria-controls` and `aria-expanded`, its label, and a labelled region
 * hidden while unchecked. `[(checked)]` is two-way, and a form reset restores it. `id` is the base of the checkbox and
 * panel ids, generated when not given. Unlike `lily-details`, this is a form control, not a `<summary>` toggle.
 * Ships zero CSS; the consumer styles via the class hooks.
 *
 * Keyboard: Tab reaches the checkbox; Space toggles it (native).
 */
@Component({
    selector: "lily-accordion-checkbox",
    standalone: true,
    template: `<div class="accordion-checkbox {{ className() }}">
        <input
            type="checkbox"
            class="accordion-checkbox-input"
            [attr.id]="checkboxId()"
            [attr.aria-controls]="panelId()"
            [attr.aria-expanded]="checked()"
            [checked]="checked()"
            (change)="checked.set($any($event.target).checked)"
        />
        <label class="accordion-checkbox-label" [attr.for]="checkboxId()">{{ label() }}</label>
        <div
            class="accordion-checkbox-panel"
            [attr.id]="panelId()"
            role="region"
            [attr.aria-labelledby]="checkboxId()"
            [attr.hidden]="checked() ? null : ''"
        >
            <ng-content />
        </div>
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionCheckbox implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    readonly checked = model<boolean>(false);
    /** Base id for the checkbox and the panel. */
    readonly id = input<string | undefined>(undefined);
    readonly className = input<string>("");

    private readonly generatedId = `accordion-checkbox-${++nextId}`;
    private readonly baseId = computed(() => this.id() ?? this.generatedId);
    protected readonly checkboxId = computed(() => `${this.baseId()}-checkbox`);
    protected readonly panelId = computed(() => `${this.baseId()}-panel`);

    constructor() {
        restoreOnFormReset(this.checked);
    }

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "AccordionCheckbox",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
