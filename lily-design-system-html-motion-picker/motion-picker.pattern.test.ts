import { afterEach, test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import { MotionPicker } from "./motion-picker.js";

if (!customElements.get("motion-picker")) customElements.define("motion-picker", MotionPicker);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the picker-listbox contract", async () => {
    const root = document.createElement("motion-picker");
    for (const [name, value] of Object.entries({
        label: "Picker",
        motions: "full,none,reduced",
        value: "full",
    })) {
        root.setAttribute(name, value);
    }
    document.body.appendChild(root);
    await runPattern("picker-listbox", { root, hook: "motion-picker" });
});
