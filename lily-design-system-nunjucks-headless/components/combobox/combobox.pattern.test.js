// @vitest-environment jsdom
// The shared combobox contract against the macro's markup and combobox.js, in the test's own document.
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import { render } from "../../test/render.js";
import { initCombobox } from "./combobox.js";

test("meets the combobox contract", async () => {
    document.body.innerHTML = render("combobox", { id: "fruit", label: "Fruit" }).document.body.innerHTML;
    const root = document.querySelector(".combobox");
    const input = root.querySelector("input");
    const handle = initCombobox(root);
    await runPattern("combobox", {
        root,
        hook: "combobox",
        open: () => {
            input.setAttribute("aria-expanded", "true");
            document.getElementById("fruit-listbox").hidden = false;
        },
    });
    handle.dispose();
});
