import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";
import { userEvent } from "@testing-library/user-event";

import { FiveFaceRatingPicker } from "./FiveFaceRatingPicker";

function create(inputs: Record<string, unknown> = {}, host: HTMLElement = document.body) {
    const fixture = TestBed.createComponent(FiveFaceRatingPicker);
    for (const [k, v] of Object.entries({ label: "Rating", ...inputs }))
        fixture.componentRef.setInput(k, v);
    host.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    const root: HTMLFieldSetElement = fixture.nativeElement.querySelector(
        "fieldset.five-face-rating-picker",
    );
    const radios = () => Array.from(root.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
    const checked = () => radios().findIndex((r) => r.checked) + 1;
    return { fixture, root, radios, checked };
}

describe("FiveFaceRatingPicker", () => {
    test("renders a fieldset radiogroup with the base class, label and className", () => {
        const { root } = create({ className: "extra" });
        expect(root.classList.contains("extra")).toBe(true);
        expect(root.getAttribute("role")).toBe("radiogroup");
        expect(root.getAttribute("aria-label")).toBe("Rating");
    });

    test("holds five native radios, values 1 to 5, sharing one name", () => {
        const { radios } = create();
        expect(radios().map((r) => r.value)).toEqual(["1", "2", "3", "4", "5"]);
        expect(new Set(radios().map((r) => r.name))).toEqual(new Set(["face-rating"]));
        expect(create({ name: "q1" }).radios()[0].name).toBe("q1");
    });

    test("checks the radio for value and labels the options", () => {
        const { root, checked } = create({
            value: 3,
            labels: ["Awful", "Poor", "OK", "Good", "Great"],
        });
        expect(checked()).toBe(3);
        expect(
            Array.from(root.querySelectorAll("label")).map((l) => l.textContent!.trim()),
        ).toEqual(["Awful", "Poor", "OK", "Good", "Great"]);
    });

    test("labels the options with the numbers by default", () => {
        const { root } = create();
        expect(
            Array.from(root.querySelectorAll("label")).map((l) => l.textContent!.trim()),
        ).toEqual(["1", "2", "3", "4", "5"]);
    });

    test("checking a radio sets the two-way value", () => {
        const { fixture, radios } = create();
        radios()[3].click();
        fixture.detectChanges();
        expect(fixture.componentInstance.value()).toBe(4);
    });

    test("ArrowRight and ArrowLeft move the selection through the native radio group", async () => {
        const user = userEvent.setup();
        const { fixture, radios, checked } = create({ value: 2 });
        radios()[1].focus();
        await user.keyboard("{ArrowRight}");
        fixture.detectChanges();
        expect(checked()).toBe(3);
        expect(fixture.componentInstance.value()).toBe(3);
        await user.keyboard("{ArrowLeft}{ArrowLeft}");
        fixture.detectChanges();
        expect(checked()).toBe(1);
        expect(fixture.componentInstance.value()).toBe(1);
    });

    test("disabled disables the whole group", () => {
        const { root } = create({ disabled: true });
        expect(root.disabled).toBe(true);
    });

    test("a form reset restores the starting value, unless cancelled", async () => {
        const form = document.createElement("form");
        document.body.appendChild(form);
        const { fixture, radios, checked } = create({ value: 2 }, form);
        await fixture.whenStable();
        radios()[4].click();
        fixture.detectChanges();
        form.reset();
        await new Promise((resolve) => setTimeout(resolve, 0));
        fixture.detectChanges();
        expect(checked()).toBe(2);
        expect(fixture.componentInstance.value()).toBe(2);
        radios()[4].click();
        fixture.detectChanges();
        form.addEventListener("reset", (e) => e.preventDefault());
        form.reset();
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(fixture.componentInstance.value()).toBe(5);
        form.remove();
    });
});
