import { afterEach, test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import { SharePicker } from "./share-picker.js";

if (!customElements.get("share-picker")) customElements.define("share-picker", SharePicker);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the picker-disclosure contract", async () => {
    const root = document.createElement("share-picker") as SharePicker;
    root.setAttribute("label", "Picker");
    root.setAttribute("url", "https://example.test/");
    root.targets = [{ id: "one", label: "One", href: () => "https://example.test/" }];
    document.body.appendChild(root);
    await runPattern("picker-disclosure", { root, hook: "share-picker" });
});
