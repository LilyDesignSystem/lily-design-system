import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ImageInput";

describe("ImageInput", () => {
    test("renders an image input", () => {
        render(<Subject src="/test.png" alt="Submit" />);
        const input = screen.getByRole("button", { name: "Submit" }) as HTMLInputElement;
        expect(input.type).toBe("image");
    });

    test("has src", () => {
        render(<Subject src="/test.png" alt="Submit" />);
        const input = screen.getByRole("button", { name: "Submit" }) as HTMLInputElement;
        expect(input.src).toContain("/test.png");
    });

    test("has alt", () => {
        render(<Subject src="/test.png" alt="Submit" />);
        const input = screen.getByRole("button", { name: "Submit" }) as HTMLInputElement;
        expect(input.alt).toBe("Submit");
    });

    test("supports width", () => {
        render(<Subject src="/test.png" alt="Submit" width={100} />);
        const input = screen.getByRole("button", { name: "Submit" }) as HTMLInputElement;
        expect(input.getAttribute("width")).toBe("100");
    });

    test("supports height", () => {
        render(<Subject src="/test.png" alt="Submit" height={40} />);
        const input = screen.getByRole("button", { name: "Submit" }) as HTMLInputElement;
        expect(input.getAttribute("height")).toBe("40");
    });

    test("supports disabled", () => {
        render(<Subject src="/test.png" alt="Submit" disabled />);
        expect((screen.getByRole("button", { name: "Submit" }) as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(<Subject src="/test.png" alt="Submit" data-testid="ii" />);
        expect(screen.getByTestId("ii")).toBeTruthy();
    });
});
