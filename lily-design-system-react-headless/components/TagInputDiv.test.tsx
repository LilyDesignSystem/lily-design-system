import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import Subject from "./TagInputDiv";

const field = (label: string) => screen.getByRole("textbox", { name: label }) as HTMLInputElement;

describe("TagInputDiv", () => {
    test("the root is a named group with the base class", () => {
        render(
            <Subject
                label="Add tag"
                className="extra"
            />,
        );
        const root = screen.getByRole("group", { name: "Add tag" });
        expect(root.tagName).toBe("DIV");
        expect(root.classList.contains("tag-input-div")).toBe(true);
        expect(root.classList.contains("extra")).toBe(true);
    });

    test("holds a named text field", () => {
        render(<Subject label="New tag" />);
        expect(field("New tag").type).toBe("text");
        expect(field("New tag").classList.contains("tag-input-div-field")).toBe(true);
    });

    test("the field takes disabled, placeholder, name and required", () => {
        render(
            <Subject
                label="T"
                disabled
                placeholder="P"
                name="n"
                required
            />,
        );
        const input = field("T");
        expect(input.disabled).toBe(true);
        expect(input.placeholder).toBe("P");
        expect(input.name).toBe("n");
        expect(input.required).toBe(true);
    });

    test("passes other attributes to the root", () => {
        render(
            <Subject
                label="T"
                data-testid="ti"
            />,
        );
        expect(screen.getByTestId("ti").tagName).toBe("DIV");
    });

    test("renders the consumer's tags before the field", () => {
        render(
            <Subject label="T">
                <span data-testid="tag">one</span>
            </Subject>,
        );
        expect(screen.getByTestId("tag").nextElementSibling).toBe(field("T"));
    });

    test("Enter adds the trimmed text and clears the value", () => {
        const onAdd = vi.fn();
        const onChange = vi.fn();
        render(
            <Subject
                label="T"
                value="  one  "
                onAdd={onAdd}
                onChange={onChange}
            />,
        );
        fireEvent.keyDown(field("T"), { key: "Enter" });
        expect(onAdd).toHaveBeenCalledWith("one");
        expect(onChange).toHaveBeenCalledWith("");
    });

    test("Enter on blank text adds nothing and stays a normal Enter", () => {
        const onAdd = vi.fn();
        render(
            <Subject
                label="T"
                value="   "
                onAdd={onAdd}
            />,
        );
        const notPrevented = fireEvent.keyDown(field("T"), { key: "Enter" });
        expect(onAdd).not.toHaveBeenCalled();
        expect(notPrevented).toBe(true);
    });

    test("Enter during an IME composition adds nothing", () => {
        const onAdd = vi.fn();
        render(
            <Subject
                label="T"
                value="one"
                onAdd={onAdd}
            />,
        );
        fireEvent.keyDown(field("T"), { key: "Enter", isComposing: true });
        expect(onAdd).not.toHaveBeenCalled();
    });
});
