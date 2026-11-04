import { afterEach, test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import { ThemePicker } from "./theme-picker.js";

if (!customElements.get("lily-theme-picker"))
    customElements.define("lily-theme-picker", ThemePicker);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the picker-listbox contract", async () => {
    const root = document.createElement("lily-theme-picker");
    for (const [name, value] of Object.entries({
        label: "Picker",
        themes: "abyss,dark,light",
        value: "abyss",
        "themes-url": "/t/",
    })) {
        root.setAttribute(name, value);
    }
    document.body.appendChild(root);
    await runPattern("picker-listbox", { root, hook: "theme-picker" });
});
