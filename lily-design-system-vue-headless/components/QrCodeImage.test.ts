import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";
import Subject from "./QrCodeImage.vue";
describe("QrCodeImage", () => {
    test("renders an img role", () => { render(Subject, { props: { label: "QR code" }, slots: { default: "qr" } }); expect(screen.getByRole("img")).toBeTruthy(); });
    test("has aria-label", () => { render(Subject, { props: { label: "Scan to visit" }, slots: { default: "qr" } }); expect(screen.getByLabelText("Scan to visit")).toBeTruthy(); });
    test("passes through attributes", () => { render(Subject, { props: { label: "Q", "data-testid": "qr" }, slots: { default: "x" } }); expect(screen.getByTestId("qr")).toBeTruthy(); });
});
