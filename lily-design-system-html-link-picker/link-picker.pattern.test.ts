import { afterEach, test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import { LinkPicker } from "./link-picker.js";

if (!customElements.get("link-picker")) customElements.define("link-picker", LinkPicker);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the picker-disclosure contract", async () => {
    const root = document.createElement("link-picker") as LinkPicker;
    root.setAttribute("label", "Picker");
    root.links = [{ label: "Home", href: "/" }];
    document.body.appendChild(root);
    await runPattern("picker-disclosure", { root, hook: "link-picker" });
});
