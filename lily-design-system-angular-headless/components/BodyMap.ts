import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnInit,
    effect,
    inject,
    input,
    model,
    viewChild,
} from "@angular/core";
import { warnMissingName } from "./dev-warning";

export interface BodyMapRegion {
    id: string;
    label: string;
}

/**
 * BodyMap: marking regions of the body on a consumer-supplied drawing (spec/healthcare-ui item 11). A fieldset named by
 * its legend; the projected drawing is aria-hidden; every region is a real checkbox in a list, which submits with the
 * form, and a click on a shape marked data-region toggles it. `selected` is a two-way model. Props: BodyMap.md.
 */
@Component({
    selector: "lily-body-map",
    standalone: true,
    template: `<fieldset class="body-map {{ className() }}"><legend class="body-map-legend">{{ label() }}</legend><div #figure class="body-map-figure" aria-hidden="true" (click)="onFigureClick($event)"><ng-content /></div><ul class="body-map-regions">@for (region of regions(); track region.id) {<li><label class="body-map-region"><input type="checkbox" [attr.name]="name() || null" [value]="region.id" [checked]="selected().includes(region.id)" (change)="toggle(region.id)" /> {{ region.label }}</label></li>}</ul></fieldset>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyMap implements OnInit {
    /** The question, rendered as the legend. */
    readonly label = input<string>("");
    readonly className = input<string>("");
    readonly regions = input<BodyMapRegion[]>([]);
    /** The checkboxes' form name. */
    readonly name = input<string>("");
    readonly selected = model<string[]>([]);
    private readonly figure = viewChild<ElementRef<HTMLDivElement>>("figure");
    private readonly lilyHost = inject(ElementRef);

    constructor() {
        effect(() => {
            const chosen = this.selected();
            for (const shape of this.figure()?.nativeElement.querySelectorAll("[data-region]") ??
                []) {
                if (chosen.includes(shape.getAttribute("data-region") ?? ""))
                    shape.setAttribute("data-selected", "true");
                else shape.removeAttribute("data-selected");
            }
        });
    }

    ngOnInit(): void {
        warnMissingName(
            "BodyMap",
            this.label(),
            this.lilyHost.nativeElement.getAttribute("aria-labelledby"),
        );
    }

    protected toggle(id: string): void {
        const current = this.selected();
        this.selected.set(
            current.includes(id) ? current.filter((s) => s !== id) : [...current, id],
        );
    }

    protected onFigureClick(event: MouseEvent): void {
        const id = (event.target as Element | null)
            ?.closest("[data-region]")
            ?.getAttribute("data-region");
        if (id && this.regions().some((r) => r.id === id)) this.toggle(id);
    }
}
