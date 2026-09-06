import { afterEach, describe, expect, test } from "vitest";

import { SegmentGroupItem } from "./segment-group-item.js";

if (!customElements.get("lily-segment-group-item")) {
    customElements.define("lily-segment-group-item", SegmentGroupItem);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SegmentGroupItem", () => {
    test("renders a native button with role=radio", () => {
        const host = render("<lily-segment-group-item>Day</lily-segment-group-item>");

        const button = host.querySelector("button") as HTMLButtonElement;
        expect(button.type).toBe("button");
        expect(button.getAttribute("role")).toBe("radio");
    });

    test("moves the host's children (label content) into the button", () => {
        const host = render("<lily-segment-group-item>Day</lily-segment-group-item>");

        expect(host.querySelector("button")!.textContent).toBe("Day");
    });

    test("aria-checked and roving tabindex reflect the checked attribute", () => {
        const checked = render("<lily-segment-group-item checked>Day</lily-segment-group-item>");
        const unchecked = render("<lily-segment-group-item>Week</lily-segment-group-item>");

        const checkedButton = checked.querySelector("button") as HTMLButtonElement;
        const uncheckedButton = unchecked.querySelector("button") as HTMLButtonElement;
        expect(checkedButton.getAttribute("aria-checked")).toBe("true");
        expect(checkedButton.tabIndex).toBe(0);
        expect(uncheckedButton.getAttribute("aria-checked")).toBe("false");
        expect(uncheckedButton.tabIndex).toBe(-1);
    });

    test("value is exposed as data-value on the button", () => {
        const host = render('<lily-segment-group-item value="day">Day</lily-segment-group-item>');

        expect(host.querySelector("button")!.getAttribute("data-value")).toBe("day");
    });

    test("disabled propagates to the inner button", () => {
        const host = render("<lily-segment-group-item disabled>Day</lily-segment-group-item>");

        expect((host.querySelector("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("live attribute changes re-sync aria-checked and tabindex", () => {
        const host = render("<lily-segment-group-item>Day</lily-segment-group-item>");
        const button = host.querySelector("button") as HTMLButtonElement;

        host.setAttribute("checked", "");

        expect(button.getAttribute("aria-checked")).toBe("true");
        expect(button.tabIndex).toBe(0);
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-segment-group-item class="extra">Day</lily-segment-group-item>');

        expect(host.querySelector("button")!.className).toBe("segment-group-item extra");
    });
});
