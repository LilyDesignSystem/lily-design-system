import { describe, expect, test } from "vitest";
import { afterEach } from "vitest";

import { Hint } from "./hint.js";

if (!customElements.get("lily-hint")) customElements.define("lily-hint", Hint);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("Hint keyboard", () => {
    test("aria-describedby can point a control at it", async () => {
        document.body.innerHTML =
            '<lily-hint id="name-hint" label="Hint">Use your full name</lily-hint>';

        document.body.insertAdjacentHTML("beforeend", '<input aria-describedby="name-hint" />');
        const input = document.querySelector("[aria-describedby]");
        const target = document.getElementById(input?.getAttribute("aria-describedby") ?? "");
        expect(target?.textContent).toContain("Use your full name");
    });
});
