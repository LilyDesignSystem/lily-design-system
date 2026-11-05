import { fireEvent, render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";
import Subject from "./FileDialog.vue";
describe("FileDialog", () => {
    test("not visible when closed", () => {
        render(Subject, { props: { label: "Open", open: false }, slots: { default: "files" } });
        expect(screen.queryByRole("dialog")).toBeNull();
    });
    test("visible when open", () => {
        render(Subject, { props: { label: "Open", open: true }, slots: { default: "files" } });
        expect(screen.getByRole("dialog")).toBeTruthy();
    });
    test("has aria-label", () => {
        render(Subject, { props: { label: "Open file", open: true }, slots: { default: "files" } });
        expect(screen.getByLabelText("Open file")).toBeTruthy();
    });
    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "F", open: true, "data-testid": "fd" },
            slots: { default: "x" },
        });
        expect(screen.getByTestId("fd")).toBeTruthy();
    });

    test("Escape closes the dialog", async () => {
        const { emitted } = render(Subject, {
            props: { label: "Open", open: true },
            slots: { default: "files" },
        });
        await fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
        expect(emitted()["update:open"]).toEqual([[false]]);
    });
});
