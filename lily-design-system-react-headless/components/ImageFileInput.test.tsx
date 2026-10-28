import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Subject from "./ImageFileInput";
describe("ImageFileInput", () => {
    test("renders file input", () => {
        render(<Subject label="Photo" />);
        expect((screen.getByLabelText("Photo") as HTMLInputElement).type).toBe("file");
    });
    test("accepts images by default", () => {
        render(<Subject label="Photo" />);
        expect((screen.getByLabelText("Photo") as HTMLInputElement).accept).toBe("image/*");
    });
    test("passes through attributes", () => {
        render(
            <Subject
                label="P"
                data-testid="ii"
            />,
        );
        expect(screen.getByTestId("ii")).toBeTruthy();
    });
});
