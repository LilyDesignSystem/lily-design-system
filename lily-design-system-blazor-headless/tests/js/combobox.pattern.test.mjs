// The shared combobox contract against Combobox.razor.js. The state is C#'s, so a stand-in for the component holds it;
// ComboboxTests.Module_opening_and_choosing_reach_the_parameters proves that half.
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import path from "node:path";

const { JSDOM } = process.env.JSDOM_PATH
    ? await import(pathToFileURL(path.join(process.env.JSDOM_PATH, "lib/api.js")).href).then(
          (m) => m.default ?? m,
      )
    : await import("jsdom");

const dom = new JSDOM("<!doctype html><body></body>", { pretendToBeVisual: true });
for (const k of ["window", "document", "HTMLElement", "HTMLInputElement", "Node", "KeyboardEvent", "MouseEvent", "Event"]) {
    globalThis[k] = k === "window" ? dom.window : (dom.window[k] ?? globalThis[k]);
}
const { attachDotNet } = await import("../../src/LilyBlazorHeadless/Components/Combobox.razor.js");
const { runPattern } = await import("../../../shared/pattern-tester.ts");

test("meets the combobox contract", async () => {
    document.body.innerHTML = `<div class="combobox"><input type="text" role="combobox" aria-label="Fruit" aria-expanded="false" aria-controls="list" aria-autocomplete="list"><div role="listbox" id="list" aria-label="Fruit" hidden></div></div>`;
    const root = document.body.firstElementChild;
    const input = root.querySelector("input");
    const list = root.querySelector("#list");
    const component = {
        invokeMethodAsync(name, arg) {
            if (name === "OnComboboxOpen") {
                input.setAttribute("aria-expanded", String(arg));
                list.hidden = !arg;
            } else if (name === "OnComboboxChoose") input.value = arg;
            return Promise.resolve();
        },
    };
    const handle = attachDotNet(input, list, component);
    await runPattern("combobox", {
        root,
        hook: "combobox",
        open: () => component.invokeMethodAsync("OnComboboxOpen", true),
    });
    handle.dispose();
});
