import { afterEach, test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { Sheet } from "./sheet.js";

if (!customElements.get("lily-sheet")) customElements.define("lily-sheet", Sheet);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the dialog contract", async () => {
    document.body.innerHTML = '<lily-sheet label="Settings"></lily-sheet>';
    const root = document.body.firstElementChild as HTMLElement;
    await runPattern("dialog", {
        root,
        hook: "sheet",
        open: () => root.setAttribute("open", ""),
    });
});
