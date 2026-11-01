// P10-T9: a form reset puts the textarea back to the text it started with.
// The textarea shows component state, which the browser's own reset knows nothing about.
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import MarkdownEditor from "./MarkdownEditor.vue";

const tick = () => new Promise((resolve) => setTimeout(resolve, 5));

function inForm() {
    const form = document.createElement("form");
    document.body.appendChild(form);
    const wrapper = mount(MarkdownEditor, {
        attachTo: form,
        props: {
            label: "Message",
            toolbarLabel: "Formatting",
            labels: {},
            name: "body",
            modelValue: "hello",
        },
    });
    return { form, wrapper, textarea: form.querySelector("textarea")! };
}

describe("MarkdownEditor form reset", () => {
    it("restores the initial text and tells the consumer", async () => {
        const { form, wrapper, textarea } = inForm();
        textarea.value = "typed";
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        await tick();
        form.reset();
        await tick();
        expect(textarea.value).toBe("hello");
        expect(new FormData(form).get("body")).toBe("hello");
        expect(wrapper.emitted("update:modelValue")!.at(-1)).toEqual(["hello"]);
        wrapper.unmount();
    });

    it("a cancelled reset changes nothing", async () => {
        const { form, wrapper, textarea } = inForm();
        textarea.value = "typed";
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        await tick();
        form.addEventListener("reset", (event) => event.preventDefault());
        form.reset();
        await tick();
        expect(textarea.value).toBe("typed");
        wrapper.unmount();
    });
});
