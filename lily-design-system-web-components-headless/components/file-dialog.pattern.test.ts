import { afterEach, test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { FileDialog } from "./file-dialog.js";

if (!customElements.get("lily-file-dialog")) customElements.define("lily-file-dialog", FileDialog);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the dialog contract", async () => {
    document.body.innerHTML = '<lily-file-dialog label="Settings"></lily-file-dialog>';
    const root = document.body.firstElementChild as HTMLElement;
    await runPattern("dialog", {
        root,
        hook: "file-dialog",
        open: () => root.setAttribute("open", ""),
    });
});
