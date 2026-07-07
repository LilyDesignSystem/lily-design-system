import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Subject from "./ImageCropper";
function textSnippet(text: string) { return (($anchor: Comment) => { $anchor.before(document.createTextNode(text)); }) as any; }
describe("ImageCropper", () => {
    test("renders application role", () => { render(<Subject label="Cropper">canvas</Subject>); expect(screen.getByRole("application")).toBeTruthy(); });
    test("has aria-label", () => { render(<Subject label="Crop image">canvas</Subject>); expect(screen.getByLabelText("Crop image")).toBeTruthy(); });
    test("passes through attributes", () => { render(<Subject label="S" data-testid="ic">x</Subject>); expect(screen.getByTestId("ic")).toBeTruthy(); });
});
