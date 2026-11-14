import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import { BodyMap } from "./BodyMap";

@Component({
    standalone: true,
    imports: [BodyMap],
    template: `<lily-body-map label="Where is the pain?" name="sites" [regions]="regions" [(selected)]="selected"><svg viewBox="0 0 10 10"><circle data-region="head" r="2" cx="5" cy="2"></circle><rect data-region="left-arm" x="0" y="4" width="2" height="4"></rect></svg></lily-body-map>`,
})
class Host {
    regions = [
        { id: "head", label: "Head" },
        { id: "left-arm", label: "Left arm" },
    ];
    selected: string[] = [];
}

describe("BodyMap", () => {
    test("a fieldset with a legend; Space and a click on the drawing toggle checkboxes", async () => {
        const user = userEvent.setup();
        const fixture = TestBed.createComponent(Host);
        fixture.detectChanges();
        document.body.appendChild(fixture.nativeElement);
        const root = fixture.nativeElement.querySelector("fieldset.body-map") as HTMLElement;
        expect(root.querySelector("legend")?.textContent).toBe("Where is the pain?");
        expect(root.querySelector(".body-map-figure")?.getAttribute("aria-hidden")).toBe("true");
        const boxes = root.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        boxes[0].focus();
        await user.keyboard(" ");
        fixture.detectChanges();
        expect(boxes[0].checked).toBe(true);
        expect(
            root.querySelector('circle[data-region="head"]')?.getAttribute("data-selected"),
        ).toBe("true");
        await user.click(root.querySelector('rect[data-region="left-arm"]') as Element);
        fixture.detectChanges();
        expect(fixture.componentInstance.selected).toEqual(["head", "left-arm"]);
        expect(
            [...root.querySelectorAll<HTMLInputElement>('input[name="sites"]:checked')].map(
                (i) => i.value,
            ),
        ).toEqual(["head", "left-arm"]);
    });
});
