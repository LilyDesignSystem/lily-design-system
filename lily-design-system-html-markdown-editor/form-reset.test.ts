// P10-T9: a form reset restores the textarea to the text it was built with: the
// browser resets a textarea to its *default* value, not to a property a script set.
import { afterEach, describe, expect, test } from "vitest";

import { MarkdownEditor } from "./markdown-editor.js";

if (!customElements.get("markdown-editor"))
    customElements.define("markdown-editor", MarkdownEditor);

afterEach(() => {
    document.body.innerHTML = "";
});

const tick = () => new Promise((resolve) => setTimeout(resolve, 5));

function inForm() {
    document.body.innerHTML =
        '<form><markdown-editor label="Message" toolbar-label="Formatting" name="body" value="hello"></markdown-editor></form>';
    const form = document.querySelector("form")!;
    return { form, textarea: form.querySelector("textarea")! };
}

describe("MarkdownEditor form reset", () => {
    test("restores the initial text", async () => {
        const { form, textarea } = inForm();
        expect(textarea.value).toBe("hello");
        textarea.value = "typed";
        form.reset();
        await tick();
        expect(textarea.value).toBe("hello");
        expect(new FormData(form).get("body")).toBe("hello");
    });

    test("a cancelled reset changes nothing", async () => {
        const { form, textarea } = inForm();
        textarea.value = "typed";
        form.addEventListener("reset", (event) => event.preventDefault());
        form.reset();
        await tick();
        expect(textarea.value).toBe("typed");
    });
});
