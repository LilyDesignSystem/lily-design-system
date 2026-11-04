import { afterEach, test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { Dialog } from "./dialog.js";

if (!customElements.get("lily-dialog")) customElements.define("lily-dialog", Dialog);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the dialog contract", async () => {
    document.body.innerHTML = '<lily-dialog label="Settings"></lily-dialog>';
    const root = document.body.firstElementChild as HTMLElement;
    await runPattern("dialog", {
        root,
        hook: "dialog",
        open: () => root.setAttribute("open", ""),
    });
});
