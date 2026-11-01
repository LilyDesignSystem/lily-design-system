// P10-T9: form-reset audit. Every component that holds a native form control's
// value in its own state must restore the value it started with when the form
// resets (React keeps a controlled field's default in step with its value, so
// the browser's own reset is a no-op), report it through onChange, and do
// nothing when the reset is cancelled.
import { act, fireEvent, render } from "@testing-library/react";
import React from "react";
import { describe, expect, test, vi } from "vitest";

import AccordionCheckbox from "./AccordionCheckbox";
import CheckboxInput from "./CheckboxInput";
import FileUpload from "./FileUpload";
import MultiSelect from "./MultiSelect";
import MultiSelectWithExtras from "./MultiSelectWithExtras";
import RadioInput from "./RadioInput";
import TaskListItem from "./TaskListItem";

function inForm(ui: React.ReactElement): HTMLFormElement {
    const { container } = render(<form>{ui}</form>);
    return container.querySelector("form")!;
}
const afterReset = () => act(() => new Promise((resolve) => setTimeout(resolve, 0)));

async function resetAndCheck(form: HTMLFormElement, cancel: boolean) {
    if (cancel) form.addEventListener("reset", (e) => e.preventDefault());
    form.reset();
    await afterReset();
}

describe.each([
    {
        name: "CheckboxInput",
        ui: (onChange: (v: boolean) => void) => (
            <CheckboxInput
                label="A"
                name="a"
                value="yes"
                checked={false}
                onChange={onChange}
            />
        ),
        control: (f: HTMLFormElement) => f.querySelector<HTMLInputElement>("input")!,
        change: (el: HTMLInputElement) => fireEvent.click(el),
        initial: (f: HTMLFormElement) =>
            f.querySelector<HTMLInputElement>("input")!.checked === false,
        changed: (f: HTMLFormElement) =>
            f.querySelector<HTMLInputElement>("input")!.checked === true,
        reported: true,
    },
    {
        name: "TaskListItem",
        ui: (onChange: (v: boolean) => void) => (
            <ul>
                <TaskListItem
                    label="A"
                    checked={false}
                    onChange={onChange}
                />
            </ul>
        ),
        control: (f: HTMLFormElement) => f.querySelector<HTMLInputElement>("input")!,
        change: (el: HTMLInputElement) => fireEvent.click(el),
        initial: (f: HTMLFormElement) =>
            f.querySelector<HTMLInputElement>("input")!.checked === false,
        changed: (f: HTMLFormElement) =>
            f.querySelector<HTMLInputElement>("input")!.checked === true,
        reported: true,
    },
    {
        name: "AccordionCheckbox (uncontrolled)",
        ui: (onChange: (v: boolean) => void) => (
            <AccordionCheckbox
                label="A"
                onChange={onChange}
            >
                body
            </AccordionCheckbox>
        ),
        control: (f: HTMLFormElement) => f.querySelector<HTMLInputElement>("input")!,
        change: (el: HTMLInputElement) => fireEvent.click(el),
        initial: (f: HTMLFormElement) =>
            f.querySelector<HTMLInputElement>("input")!.checked === false &&
            f.querySelector<HTMLElement>(".accordion-checkbox-panel")!.hidden === true,
        changed: (f: HTMLFormElement) =>
            f.querySelector<HTMLInputElement>("input")!.checked === true,
        reported: true,
    },
    {
        name: "RadioInput",
        ui: (onChange: () => void) => (
            <>
                <RadioInput
                    label="A"
                    name="r"
                    value="a"
                    checked
                    onChange={onChange}
                />
                <RadioInput
                    label="B"
                    name="r"
                    value="b"
                    onChange={onChange}
                />
            </>
        ),
        control: (f: HTMLFormElement) => f.querySelector<HTMLInputElement>('input[value="b"]')!,
        change: (el: HTMLInputElement) => fireEvent.click(el),
        initial: (f: HTMLFormElement) => new FormData(f).get("r") === "a",
        changed: (f: HTMLFormElement) => new FormData(f).get("r") === "b",
        reported: false,
    },
    {
        name: "MultiSelect",
        ui: (onChange: (v: string[]) => void) => (
            <MultiSelect
                label="A"
                value={["a"]}
                onChange={onChange}
                name="m"
            >
                <option value="a">a</option>
                <option value="b">b</option>
            </MultiSelect>
        ),
        control: (f: HTMLFormElement) => f.querySelector<HTMLSelectElement>("select")!,
        change: (el: HTMLSelectElement) => {
            el.options[0].selected = false;
            el.options[1].selected = true;
            fireEvent.change(el);
        },
        initial: (f: HTMLFormElement) => new FormData(f).getAll("m").join() === "a",
        changed: (f: HTMLFormElement) => new FormData(f).getAll("m").join() === "b",
        reported: true,
    },
    {
        name: "MultiSelectWithExtras",
        ui: (onChange: (v: string[]) => void) => (
            <MultiSelectWithExtras
                label="A"
                value={["a"]}
                onChange={onChange}
                name="m"
            >
                <option value="a">a</option>
                <option value="b">b</option>
            </MultiSelectWithExtras>
        ),
        control: (f: HTMLFormElement) => f.querySelector<HTMLSelectElement>("select")!,
        change: (el: HTMLSelectElement) => {
            el.options[0].selected = false;
            el.options[1].selected = true;
            fireEvent.change(el);
        },
        initial: (f: HTMLFormElement) =>
            Array.from(f.querySelector("select")!.selectedOptions)
                .map((o) => o.value)
                .join() === "a",
        changed: (f: HTMLFormElement) =>
            Array.from(f.querySelector("select")!.selectedOptions)
                .map((o) => o.value)
                .join() === "b",
        reported: true,
    },
] as const)("$name form reset", (c) => {
    test("restores the initial value and tells the consumer", async () => {
        const onChange = vi.fn();
        const form = inForm((c.ui as any)(onChange));
        (c.change as any)(c.control(form as any));
        expect(c.changed(form as any)).toBe(true);
        onChange.mockClear();
        await resetAndCheck(form, false);
        expect(c.initial(form as any)).toBe(true);
        // A radio restores natively; the browser fires no change event.
        if (c.reported) expect(onChange).toHaveBeenCalled();
    });

    test("a cancelled reset changes nothing", async () => {
        const onChange = vi.fn();
        const form = inForm((c.ui as any)(onChange));
        (c.change as any)(c.control(form as any));
        await resetAndCheck(form, true);
        expect(c.changed(form as any)).toBe(true);
    });
});

describe("FileUpload form reset", () => {
    test("the selected-file count clears when the form resets", async () => {
        const form = inForm(<FileUpload label="Upload" />);
        const input = form.querySelector<HTMLInputElement>('input[type="file"]')!;
        const file = new File(["x"], "x.txt");
        Object.defineProperty(input, "files", { value: [file], configurable: true });
        fireEvent.change(input);
        expect(form.querySelector("[data-file-count]")!.getAttribute("data-file-count")).toBe("1");
        Object.defineProperty(input, "files", { value: [], configurable: true });
        await resetAndCheck(form, false);
        expect(form.querySelector("[data-file-count]")!.getAttribute("data-file-count")).toBe("0");
    });
});
