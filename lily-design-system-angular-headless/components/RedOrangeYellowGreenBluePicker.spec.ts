import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";
import { userEvent } from "@testing-library/user-event";

import { RedOrangeYellowGreenBluePicker } from "./RedOrangeYellowGreenBluePicker";

const statusLabel = (status: string) =>
    (
        ({
            red: "Rouge",
            orange: "Orange",
            yellow: "Jaune",
            green: "Vert",
            blue: "Bleu",
        }) as Record<string, string>
    )[status];

function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(RedOrangeYellowGreenBluePicker);
    for (const [k, v] of Object.entries({ label: "Status", ...inputs }))
        fixture.componentRef.setInput(k, v);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    const root: HTMLFieldSetElement = fixture.nativeElement.querySelector(
        "fieldset.red-orange-yellow-green-blue-picker",
    );
    const radios = () => Array.from(root.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
    const texts = () =>
        Array.from(root.querySelectorAll("label")).map((l) => l.textContent!.trim());
    return { fixture, root, radios, texts };
}

describe("RedOrangeYellowGreenBluePicker", () => {
    test("renders a fieldset radiogroup with the base class, label and className", () => {
        const { root } = create({ className: "extra" });
        expect(root.classList.contains("extra")).toBe(true);
        expect(root.getAttribute("role")).toBe("radiogroup");
        expect(root.getAttribute("aria-label")).toBe("Status");
    });

    test("holds one native radio per status, sharing one name", () => {
        const { radios } = create({ statusLabel });
        expect(radios().map((r) => r.value)).toEqual(["red", "orange", "yellow", "green", "blue"]);
        expect(new Set(radios().map((r) => r.name))).toEqual(new Set(["status"]));
        expect(create({ name: "q1" }).radios()[0].name).toBe("q1");
    });

    test("statusLabel gives each option its text; without it, the value", () => {
        expect(create({ statusLabel }).texts()).toEqual([
            "Rouge",
            "Orange",
            "Jaune",
            "Vert",
            "Bleu",
        ]);
        expect(create().texts()).toEqual(["red", "orange", "yellow", "green", "blue"]);
    });

    test("checks the radio for value, and checking one sets it", () => {
        const { fixture, radios } = create({ statusLabel, value: "orange" });
        expect(radios()[1].checked).toBe(true);
        radios()[0].click();
        fixture.detectChanges();
        expect(fixture.componentInstance.value()).toBe("red");
    });

    test("ArrowRight moves the selection through the native radio group", async () => {
        const user = userEvent.setup();
        const { fixture, radios } = create({ statusLabel });
        await user.click(radios()[0]);
        await user.keyboard("{ArrowRight}");
        fixture.detectChanges();
        expect(radios()[1].checked).toBe(true);
        expect(fixture.componentInstance.value()).toBe("orange");
    });

    test("disabled disables the group", () => {
        expect(create({ disabled: true }).root.disabled).toBe(true);
    });
});
