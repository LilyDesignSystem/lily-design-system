import { afterEach, describe, expect, test } from "vitest";
import userEvent from "@testing-library/user-event";

import { BodyMap } from "./body-map.js";

if (!customElements.get("lily-body-map")) customElements.define("lily-body-map", BodyMap);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("BodyMap", () => {
    test("a fieldset with a hidden drawing; Space and a shape click toggle checkboxes", async () => {
        const user = userEvent.setup();
        document.body.innerHTML = `<lily-body-map label="Where is the pain?" name="sites" regions='[{"id":"head","label":"Head"},{"id":"left-arm","label":"Left arm"}]'><svg viewBox="0 0 10 10"><circle data-region="head" r="2"></circle><rect data-region="left-arm" width="2" height="4"></rect></svg></lily-body-map>`;
        const host = document.querySelector("lily-body-map") as BodyMap;
        expect(document.querySelector("fieldset.body-map legend")?.textContent).toBe(
            "Where is the pain?",
        );
        expect(document.querySelector(".body-map-figure")?.getAttribute("aria-hidden")).toBe(
            "true",
        );
        const head = document.querySelector('input[value="head"]') as HTMLInputElement;
        head.focus();
        await user.keyboard(" ");
        expect(host.selected).toEqual(["head"]);
        expect(
            document.querySelector('circle[data-region="head"]')?.getAttribute("data-selected"),
        ).toBe("true");
        await user.click(document.querySelector('rect[data-region="left-arm"]') as Element);
        expect(host.selected).toEqual(["head", "left-arm"]);
        expect(document.querySelectorAll('input[name="sites"]:checked')).toHaveLength(2);
    });
});

describe("BodyMap follows its attributes (P50-T28)", () => {
    test("builds the regions again, keeping what the person ticked", () => {
        document.body.innerHTML = `<lily-body-map label="Old" regions='[{"id":"head","label":"Head"},{"id":"chest","label":"Chest"}]' selected='["head"]'><svg><circle data-region="head"></circle><rect data-region="knee"></rect></svg></lily-body-map>`;
        const host = document.querySelector("lily-body-map") as BodyMap;
        const box = (id: string) =>
            document.querySelector(`input[value="${id}"]`) as HTMLInputElement;
        box("chest").checked = true;
        host.setAttribute("label", "Where does it hurt?");
        host.setAttribute(
            "regions",
            '[{"id":"head","label":"Head"},{"id":"chest","label":"Chest"},{"id":"knee","label":"Knee"}]',
        );
        host.setAttribute("selected", '["knee"]');
        host.setAttribute("class", "wide");
        expect(document.querySelector("fieldset")?.className).toBe("body-map wide");
        expect(document.querySelector("legend")?.textContent).toBe("Where does it hurt?");
        expect(document.querySelectorAll(".body-map-regions input")).toHaveLength(3);
        expect(box("chest").checked).toBe(true);
        expect(box("head").checked).toBe(false);
        expect(box("knee").checked).toBe(true);
        expect(host.selected).toEqual(["chest", "knee"]);
        expect(document.querySelector('[data-region="knee"]')?.getAttribute("data-selected")).toBe(
            "true",
        );
        (document.querySelector('rect[data-region="knee"]') as Element).dispatchEvent(
            new MouseEvent("click", { bubbles: true }),
        );
        expect(box("knee").checked).toBe(false);
    });
});
