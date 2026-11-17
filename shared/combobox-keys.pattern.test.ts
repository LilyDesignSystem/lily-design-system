// @vitest-environment jsdom
// The shared combobox contract (pattern-contracts.json) run against this module itself, so bin/mutation-test can see
// that the keys are tested (tasks.md P35-T3). The packages run the same contract against their own components.
import { test } from "vitest";

import { attachCombobox } from "./combobox-keys";
import { runPattern } from "./pattern-tester";

test("combobox-keys meets the combobox contract", async () => {
    document.body.innerHTML = `<div class="combobox"><input type="text" role="combobox" aria-label="Fruit" aria-expanded="false" aria-controls="list" aria-autocomplete="list"><div role="listbox" id="list" aria-label="Fruit" hidden></div></div>`;
    const root = document.body.firstElementChild as HTMLElement;
    const input = root.querySelector("input") as HTMLInputElement;
    const list = root.querySelector("#list") as HTMLElement;
    let open = false;
    const setOpen = (next: boolean) => {
        open = next;
        input.setAttribute("aria-expanded", String(next));
        list.hidden = !next;
    };
    const detach = attachCombobox(input, list, {
        open: () => open,
        setOpen,
        choose: (value) => {
            input.value = value;
        },
    });
    await runPattern("combobox", { root, hook: "combobox", open: () => setOpen(true) });
    detach();
});
