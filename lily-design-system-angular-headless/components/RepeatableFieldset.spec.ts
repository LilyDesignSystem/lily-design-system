import { Component, signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import { RepeatableFieldset } from "./RepeatableFieldset";

@Component({
    standalone: true,
    imports: [RepeatableFieldset],
    template: `<lily-repeatable-fieldset
        legend="Medicines"
        [(items)]="items"
        [newItem]="newItem"
        [itemLegend]="itemLegend"
        addLabel="Add another medicine"
        [removeLabel]="removeLabel"
        [addedLabel]="addedLabel"
        [removedLabel]="removedLabel"
        [min]="min()"
        [max]="max()"
        ><ng-template let-item let-index="index"
            ><label [attr.for]="'medicine-' + index">Name</label><input [id]="'medicine-' + index" [value]="item.name"
        /></ng-template>
    </lily-repeatable-fieldset>`,
})
class Host {
    items = [{ name: "Aspirin" }];
    readonly min = signal(0);
    readonly max = signal<number | undefined>(undefined);
    newItem = () => ({ name: "" });
    itemLegend = (n: number) => `Medicine ${n}`;
    removeLabel = (n: number) => `Remove medicine ${n}`;
    addedLabel = (n: number) => `Medicine ${n} added`;
    removedLabel = (n: number) => `Medicine ${n} removed`;
}

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

function make(items: { name: string }[], min = 0, max?: number) {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.items = items;
    fixture.componentInstance.min.set(min);
    fixture.componentInstance.max.set(max);
    fixture.detectChanges();
    document.body.append(fixture.nativeElement);
    return fixture;
}

const items = (root: HTMLElement) =>
    [...root.querySelectorAll(".repeatable-fieldset-item")] as HTMLFieldSetElement[];
const legends = (root: HTMLElement) =>
    items(root).map((el) => el.querySelector("legend")?.textContent);
const button = (root: HTMLElement, text: string) =>
    [...root.querySelectorAll("button")].find(
        (b) => b.textContent?.trim() === text,
    ) as HTMLButtonElement;

describe("RepeatableFieldset", () => {
    test("add appends an item, renumbers, announces, and moves focus to its first field", async () => {
        const fixture = make([{ name: "Aspirin" }]);
        const root: HTMLElement = fixture.nativeElement;
        button(root, "Add another medicine").click();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(legends(root)).toEqual(["Medicine 1", "Medicine 2"]);
        expect(document.activeElement).toBe(items(root)[1].querySelector("input"));
        expect(root.querySelector('[role="status"]')?.textContent).toBe("Medicine 2 added");
        fixture.nativeElement.remove();
    });

    test("remove takes out that item, keeps the others, and moves focus to the add button", async () => {
        const fixture = make([{ name: "Aspirin" }, { name: "Metformin" }, { name: "Ramipril" }]);
        const root: HTMLElement = fixture.nativeElement;
        button(root, "Remove medicine 2").click();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(legends(root)).toEqual(["Medicine 1", "Medicine 2"]);
        expect(fixture.componentInstance.items.map((x) => x.name)).toEqual(["Aspirin", "Ramipril"]);
        expect(document.activeElement).toBe(button(root, "Add another medicine"));
        fixture.nativeElement.remove();
    });

    test("min leaves out the remove buttons; max disables the add button", () => {
        const root: HTMLElement = make([{ name: "Aspirin" }], 1, 1).nativeElement;
        expect(root.querySelector(".repeatable-fieldset-remove")).toBeNull();
        expect(button(root, "Add another medicine").disabled).toBe(true);
        root.remove();
    });
});
