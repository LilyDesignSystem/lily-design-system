import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";
import Subject from "../../components/FileManager.vue";
describe("FileManager", () => {
    test("renders a region", () => {
        render(Subject, { props: { label: "Files" }, slots: { default: "content" } });
        expect(screen.getByRole("region")).toBeTruthy();
    });
    test("has aria-label", () => {
        render(Subject, { props: { label: "File browser" }, slots: { default: "content" } });
        expect(screen.getByLabelText("File browser")).toBeTruthy();
    });
    test("passes through attributes", () => {
        render(Subject, { props: { label: "F", "data-testid": "fm" }, slots: { default: "x" } });
        expect(screen.getByTestId("fm")).toBeTruthy();
    });
});
