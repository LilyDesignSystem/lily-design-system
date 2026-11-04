import { afterEach, test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import { TextSizePicker } from "./text-size-picker.js";

if (!customElements.get("text-size-picker"))
    customElements.define("text-size-picker", TextSizePicker);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the picker-listbox contract", async () => {
    const root = document.createElement("text-size-picker");
    for (const [name, value] of Object.entries({
        label: "Picker",
        sizes: "large,normal,small",
        value: "large",
    })) {
        root.setAttribute(name, value);
    }
    document.body.appendChild(root);
    await runPattern("picker-listbox", { root, hook: "text-size-picker" });
});
