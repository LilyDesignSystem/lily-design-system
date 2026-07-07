import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";
import Subject from "./ImageCropper.vue";
describe("ImageCropper", () => {
    test("renders application role", () => { render(Subject, { props: { label: "Cropper" }, slots: { default: "img" } }); expect(screen.getByRole("application")).toBeTruthy(); });
    test("has aria-label", () => { render(Subject, { props: { label: "Crop image" }, slots: { default: "img" } }); expect(screen.getByLabelText("Crop image")).toBeTruthy(); });
    test("passes through attributes", () => { render(Subject, { props: { label: "C", "data-testid": "ic" }, slots: { default: "x" } }); expect(screen.getByTestId("ic")).toBeTruthy(); });
});
