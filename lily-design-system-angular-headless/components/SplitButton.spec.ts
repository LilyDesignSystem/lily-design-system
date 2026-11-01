import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SplitButton } from "./SplitButton";

function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(SplitButton);
    for (const [key, value] of Object.entries({
        label: "Save options",
        primaryLabel: "Save",
        menuLabel: "More save options",
        ...inputs,
    })) {
        fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    const root = fixture.nativeElement.querySelector("div.split-button") as HTMLElement;
    return {
        fixture,
        root,
        primary: root.querySelector(".split-button-primary") as HTMLButtonElement,
        trigger: root.querySelector(".split-button-menu-trigger") as HTMLButtonElement,
        menu: root.querySelector(".split-button-menu") as HTMLElement,
    };
}

describe("SplitButton", () => {
    test("renders a div role=group root with the base class and its label", () => {
        const { root } = create();
        expect(root.getAttribute("role")).toBe("group");
        expect(root.getAttribute("aria-label")).toBe("Save options");
    });

    test("appends the className input to the root class list", () => {
        const { root } = create({ className: "extra" });
        expect(root.classList.contains("extra")).toBe(true);
    });

    test("the primary button shows primaryLabel and emits primaryClick", () => {
        const { fixture, primary } = create();
        let clicks = 0;
        fixture.componentInstance.primaryClick.subscribe(() => clicks++);
        expect(primary.textContent).toBe("Save");
        primary.click();
        expect(clicks).toBe(1);
    });

    test("the menu trigger is named, says menu, and tracks menuOpen", () => {
        const { fixture, trigger, menu } = create();
        expect(trigger.getAttribute("aria-label")).toBe("More save options");
        expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
        expect(menu.hidden).toBe(true);
        fixture.componentRef.setInput("menuOpen", true);
        fixture.detectChanges();
        expect(trigger.getAttribute("aria-expanded")).toBe("true");
        expect(menu.hidden).toBe(false);
    });

    test("disabled disables both buttons", () => {
        const { primary, trigger } = create({ disabled: true });
        expect(primary.disabled).toBe(true);
        expect(trigger.disabled).toBe(true);
    });
});
