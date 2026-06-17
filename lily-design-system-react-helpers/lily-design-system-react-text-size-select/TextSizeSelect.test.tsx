import * as React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import TextSizeSelect, {
    titleCaseSize,
    type ChildArgs,
} from "./TextSizeSelect";

const SIZES = ["small", "medium", "large", "x-large"];

function flush(): Promise<void> {
    return new Promise((r) => setTimeout(r, 0));
}

function resetRoot(): void {
    document.documentElement.removeAttribute("data-text-size");
}

beforeEach(() => {
    resetRoot();
    try {
        localStorage.clear();
    } catch {
        /* ignore */
    }
});

afterEach(() => {
    cleanup();
    resetRoot();
});

describe("TextSizeSelect — pure helpers", () => {
    test("titleCaseSize title-cases each hyphen word", () => {
        expect(titleCaseSize("x-large")).toBe("X Large");
        expect(titleCaseSize("small")).toBe("Small");
        expect(titleCaseSize("extra-extra-large")).toBe("Extra Extra Large");
    });
});

describe("TextSizeSelect — markup contract (§7.1–§7.4)", () => {
    test("§7.1 renders a <select> with role=combobox", () => {
        render(<TextSizeSelect label="Text size" sizes={SIZES} />);
        const select = screen.getByRole("combobox");
        expect(select.tagName).toBe("SELECT");
    });

    test("§7.2 aria-label is the supplied label", () => {
        render(<TextSizeSelect label="Choose text size" sizes={SIZES} />);
        expect(screen.getByLabelText("Choose text size")).toBeTruthy();
    });

    test("§7.3 one option per size; the select carries the supplied name", () => {
        render(
            <TextSizeSelect label="Text size" sizes={SIZES} name="font-scale" />,
        );
        const options = screen.getAllByRole("option") as HTMLOptionElement[];
        expect(options.length).toBe(SIZES.length);
        const select = screen.getByRole("combobox") as HTMLSelectElement;
        expect(select.name).toBe("font-scale");
    });

    test("§7.3 the select uses the default name 'text-size'", () => {
        render(<TextSizeSelect label="Text size" sizes={SIZES} />);
        const select = screen.getByRole("combobox") as HTMLSelectElement;
        expect(select.name).toBe("text-size");
    });

    test("§7.4 each option carries the size slug as its value", () => {
        render(<TextSizeSelect label="Text size" sizes={SIZES} />);
        const options = screen.getAllByRole("option") as HTMLOptionElement[];
        expect(options.map((o) => o.value)).toEqual(SIZES);
    });

    test("§7.5 default labels title-case the slug", () => {
        render(<TextSizeSelect label="Text size" sizes={["small", "x-large"]} />);
        expect(screen.getByText("Small")).toBeTruthy();
        expect(screen.getByText("X Large")).toBeTruthy();
    });

    test("§7.5 sizeLabels override the default title-cased text", () => {
        render(
            <TextSizeSelect
                label="Text size"
                sizes={["small", "x-large"]}
                sizeLabels={{ small: "Compact", "x-large": "Huge" }}
            />,
        );
        expect(screen.getByText("Compact")).toBeTruthy();
        expect(screen.getByText("Huge")).toBeTruthy();
    });
});

describe("TextSizeSelect — initial value resolution (§7.6)", () => {
    test("§7.6 initial value defaults to 'medium' when present", async () => {
        render(<TextSizeSelect label="Text size" sizes={SIZES} />);
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe(
            "medium",
        );
    });

    test("§7.6 initial value falls back to sizes[0] when 'medium' is absent", async () => {
        render(
            <TextSizeSelect label="Text size" sizes={["small", "large"]} />,
        );
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe(
            "small",
        );
    });

    test("§7.6 defaultValue wins over the medium/sizes[0] fallback", async () => {
        render(
            <TextSizeSelect
                label="Text size"
                sizes={SIZES}
                defaultValue="large"
            />,
        );
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe(
            "large",
        );
    });
});

describe("TextSizeSelect — size application (§7.7, §7.8)", () => {
    test("§7.7 applies data-text-size to document.documentElement", async () => {
        render(
            <TextSizeSelect
                label="Text size"
                sizes={SIZES}
                defaultValue="large"
            />,
        );
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe(
            "large",
        );
    });

    test("§7.7 a custom target receives data-text-size", async () => {
        const target = document.createElement("section");
        document.body.appendChild(target);
        render(
            <TextSizeSelect
                label="Text size"
                sizes={SIZES}
                defaultValue="large"
                target={target}
            />,
        );
        await flush();
        expect(target.getAttribute("data-text-size")).toBe("large");
        // Document root must remain untouched.
        expect(
            document.documentElement.hasAttribute("data-text-size"),
        ).toBe(false);
        target.remove();
    });

    test("§7.8 selecting an option updates data-text-size and fires onChange", async () => {
        const onChange = vi.fn();
        render(
            <TextSizeSelect
                label="Text size"
                sizes={SIZES}
                defaultValue="medium"
                onChange={onChange}
            />,
        );
        await flush();
        const select = screen.getByRole("combobox") as HTMLSelectElement;
        fireEvent.change(select, { target: { value: "x-large" } });
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe(
            "x-large",
        );
        expect(onChange).toHaveBeenCalledWith("x-large");
    });
});

describe("TextSizeSelect — persistence + explicit value (§7.9, §7.10)", () => {
    test("§7.9 persists to localStorage and reads back on a fresh mount", async () => {
        const { unmount } = render(
            <TextSizeSelect
                label="Text size"
                sizes={SIZES}
                storageKey="lily-text-size"
            />,
        );
        await flush();
        const select = screen.getByRole("combobox") as HTMLSelectElement;
        fireEvent.change(select, { target: { value: "large" } });
        await flush();
        expect(localStorage.getItem("lily-text-size")).toBe("large");
        unmount();
        resetRoot();

        render(
            <TextSizeSelect
                label="Text size"
                sizes={SIZES}
                storageKey="lily-text-size"
            />,
        );
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe(
            "large",
        );
    });

    test("§7.10 an explicit value prop wins over storage and defaults", async () => {
        localStorage.setItem("lily-text-size", "x-large");
        render(
            <TextSizeSelect
                label="Text size"
                sizes={SIZES}
                value="small"
                storageKey="lily-text-size"
                defaultValue="large"
            />,
        );
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe(
            "small",
        );
    });
});

describe("TextSizeSelect — spread + custom children (§7.12, §7.13)", () => {
    test("§7.12 extra attributes spread onto the select", () => {
        render(
            <TextSizeSelect
                label="Text size"
                sizes={SIZES}
                data-testid="ts"
            />,
        );
        expect(screen.getByTestId("ts")).toBeTruthy();
    });

    test("§7.13 children render prop receives ChildArgs", () => {
        render(
            <TextSizeSelect label="Text size" sizes={SIZES} name="font-scale">
                {(args: ChildArgs) => (
                    <div
                        data-testid="custom"
                        data-name={args.name}
                        data-label-x-large={args.labelFor("x-large")}
                    >
                        {args.sizes.join(",")}
                    </div>
                )}
            </TextSizeSelect>,
        );
        const custom = screen.getByTestId("custom");
        expect(custom.textContent).toBe("small,medium,large,x-large");
        expect(custom.getAttribute("data-name")).toBe("font-scale");
        expect(custom.getAttribute("data-label-x-large")).toBe("X Large");
    });
});
