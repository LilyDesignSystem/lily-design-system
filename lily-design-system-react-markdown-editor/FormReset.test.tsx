// P10-T9: a form reset puts the textarea back to the text it started with.
// The textarea is controlled, so the browser's own reset changes nothing.
import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MarkdownEditor from "./MarkdownEditor";

const afterReset = () => act(() => new Promise((resolve) => setTimeout(resolve, 0)));

function inForm(props: Record<string, unknown> = {}) {
    const { container } = render(
        <form>
            <MarkdownEditor
                label="Message"
                toolbarLabel="Formatting"
                labels={{}}
                name="body"
                defaultValue="hello"
                {...props}
            />
        </form>,
    );
    const form = container.querySelector("form")!;
    return { form, textarea: form.querySelector("textarea")! };
}

describe("MarkdownEditor form reset", () => {
    it("restores the initial text and tells the consumer", async () => {
        const onChange = vi.fn();
        const { form, textarea } = inForm({ onChange });
        fireEvent.change(textarea, { target: { value: "typed" } });
        expect(textarea.value).toBe("typed");
        form.reset();
        await afterReset();
        expect(textarea.value).toBe("hello");
        expect(new FormData(form).get("body")).toBe("hello");
        expect(onChange).toHaveBeenLastCalledWith("hello");
    });

    it("a cancelled reset changes nothing", async () => {
        const { form, textarea } = inForm();
        fireEvent.change(textarea, { target: { value: "typed" } });
        form.addEventListener("reset", (event) => event.preventDefault());
        form.reset();
        await afterReset();
        expect(textarea.value).toBe("typed");
    });
});
