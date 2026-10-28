import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";
import Subject from "./ImageFileInput.vue";
describe("ImageFileInput", () => {
    test("renders file input", () => {
        render(Subject, { props: { label: "Photo" } });
        expect((screen.getByLabelText("Photo") as HTMLInputElement).type).toBe("file");
    });
    test("accepts images by default", () => {
        render(Subject, { props: { label: "Photo" } });
        expect((screen.getByLabelText("Photo") as HTMLInputElement).accept).toBe("image/*");
    });
    test("passes through attributes", () => {
        render(Subject, { props: { label: "P", "data-testid": "ii" } });
        expect(screen.getByTestId("ii")).toBeTruthy();
    });
});
