import { afterEach, test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import { LocalePicker } from "./locale-picker.js";

if (!customElements.get("lily-locale-picker"))
    customElements.define("lily-locale-picker", LocalePicker);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the picker-listbox contract", async () => {
    const root = document.createElement("lily-locale-picker");
    for (const [name, value] of Object.entries({
        label: "Picker",
        locales: "de,fr,it",
        value: "de",
    })) {
        root.setAttribute(name, value);
    }
    document.body.appendChild(root);
    await runPattern("picker-listbox", { root, hook: "locale-picker" });
});
