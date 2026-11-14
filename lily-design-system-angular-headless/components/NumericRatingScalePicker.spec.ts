import { TestBed } from "@angular/core/testing";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import { NumericRatingScalePicker } from "./NumericRatingScalePicker";

function mount(inputs: Record<string, unknown>) {
    const fixture = TestBed.createComponent(NumericRatingScalePicker);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    document.body.appendChild(fixture.nativeElement);
    return fixture;
}

describe("NumericRatingScalePicker", () => {
    test("is a fieldset with a legend, radios from 0 to 10 and described ends", () => {
        const fixture = mount({
            label: "How bad is your pain now?",
            minLabel: "No pain",
            maxLabel: "Worst pain imaginable",
        });
        const root = fixture.nativeElement as HTMLElement;
        expect(root.querySelector("fieldset legend")?.textContent).toBe(
            "How bad is your pain now?",
        );
        const radios = root.querySelectorAll<HTMLInputElement>('input[type="radio"]');
        expect(radios).toHaveLength(11);
        const minId = radios[0].getAttribute("aria-describedby");
        expect(root.querySelector(`#${minId}`)?.textContent).toBe("No pain");
        const maxId = radios[10].getAttribute("aria-describedby");
        expect(root.querySelector(`#${maxId}`)?.textContent).toBe("Worst pain imaginable");
        expect(radios[5].hasAttribute("aria-describedby")).toBe(false);
    });

    test("arrow keys move and choose, and the model follows", async () => {
        const user = userEvent.setup();
        const fixture = mount({ label: "Pain", value: "3" });
        const radios = fixture.nativeElement.querySelectorAll(
            'input[type="radio"]',
        ) as NodeListOf<HTMLInputElement>;
        radios[3].focus();
        await user.keyboard("{ArrowRight}");
        expect(radios[4].checked).toBe(true);
        expect(fixture.componentInstance.value()).toBe("4");
    });
});
