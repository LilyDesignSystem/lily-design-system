import { afterEach, test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { Combobox } from "./combobox.js";

if (!customElements.get("lily-combobox")) customElements.define("lily-combobox", Combobox);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the combobox contract", async () => {
    document.body.innerHTML = '<lily-combobox label="Fruit"></lily-combobox>';
    const root = document.body.firstElementChild as HTMLElement;
    await runPattern("combobox", {
        root,
        hook: "combobox",
        open: () => root.setAttribute("open", ""),
    });
});
