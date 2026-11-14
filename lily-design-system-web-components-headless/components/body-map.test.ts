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
