import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Subject from "./QrCodeImage";
function textSnippet(text: string) { return (($anchor: Comment) => { $anchor.before(document.createTextNode(text)); }) as any; }
describe("QrCodeImage", () => {
    test("renders an img role", () => { render(<Subject label="QR code">qr</Subject>); expect(screen.getByRole("img")).toBeTruthy(); });
    test("has aria-label", () => { render(<Subject label="Scan to visit">qr</Subject>); expect(screen.getByLabelText("Scan to visit")).toBeTruthy(); });
    test("passes through attributes", () => { render(<Subject label="Q" data-testid="qr">x</Subject>); expect(screen.getByTestId("qr")).toBeTruthy(); });
});
