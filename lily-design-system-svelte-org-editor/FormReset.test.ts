// P10-T9: a form reset puts the textarea back to the text it started with. The textarea's value is one-way
// (`{value}` plus `oninput`), so the browser's own reset restores the textarea's empty default text while the
// component's `value` keeps what was typed.
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/svelte";
import OrgEditor from "./OrgEditor.svelte";

const afterReset = () => new Promise((resolve) => setTimeout(resolve, 0));

function inForm(props: Record<string, unknown> = {}) {
    const form = document.createElement("form");
    document.body.append(form);
    render(OrgEditor, {
        target: form,
        props: {
            label: "Message",
            toolbarLabel: "Formatting",
            labels: {},
            name: "body",
            value: "hello",
            ...props,
        },
    });
    return { form, textarea: form.querySelector("textarea")! };
}

describe("OrgEditor form reset", () => {
    it("restores the initial text and tells the consumer", async () => {
        const onchange = vi.fn();
        const { form, textarea } = inForm({ onchange });
        await fireEvent.input(textarea, { target: { value: "typed" } });
        expect(textarea.value).toBe("typed");
        form.reset();
        await afterReset();
        expect(textarea.value).toBe("hello");
        expect(new FormData(form).get("body")).toBe("hello");
        expect(onchange).toHaveBeenLastCalledWith("hello");
        form.remove();
    });

    it("a cancelled reset changes nothing", async () => {
        const { form, textarea } = inForm();
        await fireEvent.input(textarea, { target: { value: "typed" } });
        form.addEventListener("reset", (event) => event.preventDefault());
        form.reset();
        await afterReset();
        expect(textarea.value).toBe("typed");
        form.remove();
    });
});
