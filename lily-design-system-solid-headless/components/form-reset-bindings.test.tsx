// A form reset puts every field back to its default (the value attribute, the checked attribute, each option's
// selected attribute). Solid writes a bound value as the DOM property, so without a default that follows it a reset
// empties a field the consumer still holds a value for. These cover the reset with no edits, the case that broke.
import { render } from "./test-utils";
import { describe, expect, test } from "vitest";
import TextInput from "./TextInput";
import TextAreaInput from "./TextAreaInput";
import NumberInput from "./NumberInput";
import CheckboxInput from "./CheckboxInput";
import Select from "./Select";

const afterReset = () => new Promise((resolve) => setTimeout(resolve, 0));

function inForm(ui: () => unknown) {
    const { container } = render(() => <form>{ui() as never}</form>);
    return container.querySelector("form")!;
}

describe("form reset keeps bound values", () => {
    test("TextInput", async () => {
        const form = inForm(() => (
            <TextInput
                label="Name"
                value="Ada"
            />
        ));
        form.reset();
        await afterReset();
        expect(form.querySelector("input")!.value).toBe("Ada");
    });

    test("TextAreaInput", async () => {
        const form = inForm(() => (
            <TextAreaInput
                label="Notes"
                value="Hello"
            />
        ));
        form.reset();
        await afterReset();
        expect(form.querySelector("textarea")!.value).toBe("Hello");
    });

    test("NumberInput", async () => {
        const form = inForm(() => (
            <NumberInput
                label="Count"
                value={3}
            />
        ));
        form.reset();
        await afterReset();
        expect(form.querySelector("input")!.value).toBe("3");
    });

    test("CheckboxInput", async () => {
        const form = inForm(() => (
            <CheckboxInput
                label="Agree"
                checked
            />
        ));
        form.reset();
        await afterReset();
        expect(form.querySelector("input")!.checked).toBe(true);
    });

    test("Select", async () => {
        const form = inForm(() => (
            <Select
                label="Priority"
                value="high"
            >
                <option value="low">Low</option>
                <option value="high">High</option>
            </Select>
        ));
        form.reset();
        await afterReset();
        expect(form.querySelector("select")!.value).toBe("high");
    });
});
