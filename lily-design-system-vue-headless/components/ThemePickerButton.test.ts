import { describe, expect, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";

import Subject from "./ThemePickerButton.vue";

describe("ThemePickerButton", () => {
    test("renders a button with class theme-picker-button", () => {
        const { container } = render(Subject, { props: { label: "Light theme" } });
        const btn = container.querySelector(".theme-picker-button");
        expect(btn).toBeTruthy();
        expect(btn?.tagName).toBe("BUTTON");
    });

    test("applies aria-label from label prop", () => {
        render(Subject, { props: { label: "Light theme" } });
        expect(screen.getByRole("button", { name: "Light theme" })).toBeTruthy();
    });

    test("aria-pressed reflects the pressed prop", async () => {
        const { rerender, container } = render(Subject, { props: { label: "Light theme" } });
        let btn = container.querySelector(".theme-picker-button")!;
        expect(btn.getAttribute("aria-pressed")).toBe("false");

        await rerender({ label: "Light theme", pressed: true });
        btn = container.querySelector(".theme-picker-button")!;
        expect(btn.getAttribute("aria-pressed")).toBe("true");
    });

    test("type defaults to button", () => {
        render(Subject, { props: { label: "x" } });
        expect(screen.getByRole("button").getAttribute("type")).toBe("button");
    });

    test("disabled prop disables the button", () => {
        render(Subject, { props: { label: "x", disabled: true } });
        const btn = screen.getByRole("button") as HTMLButtonElement;
        expect(btn.disabled).toBe(true);
    });

    test("emits click when activated", async () => {
        const { emitted } = render(Subject, { props: { label: "x" } });
        await fireEvent.click(screen.getByRole("button"));
        expect(emitted().click).toBeTruthy();
    });
});
