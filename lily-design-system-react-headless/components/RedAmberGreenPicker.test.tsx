import { act, fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./RedAmberGreenPicker";

const statusLabel = (status: string) =>
    (({ red: "Rouge", amber: "Ambre", green: "Vert" }) as Record<string, string>)[status];

describe("RedAmberGreenPicker", () => {
    test("renders a fieldset radiogroup named by label", () => {
        render(
            <Subject
                label="Status"
                statusLabel={statusLabel}
            />,
        );
        const group = screen.getByRole("radiogroup", { name: "Status" });
        expect(group.tagName).toBe("FIELDSET");
        expect(group.classList.contains("red-amber-green-picker")).toBe(true);
    });

    test("holds one native radio per status, sharing one name", () => {
        render(
            <Subject
                label="Status"
                statusLabel={statusLabel}
            />,
        );
        const radios = screen.getAllByRole("radio") as HTMLInputElement[];
        expect(radios.map((r) => r.value)).toEqual(["red", "amber", "green"]);
        expect(new Set(radios.map((r) => r.name))).toEqual(new Set(["status"]));
    });

    test("statusLabel gives each option its text", () => {
        render(
            <Subject
                label="Status"
                statusLabel={statusLabel}
            />,
        );
        for (const text of ["Rouge", "Ambre", "Vert"])
            expect(screen.getByLabelText(text)).toBeTruthy();
    });

    test("without statusLabel an option shows its value, never other English", () => {
        const Loose = Subject as unknown as (props: { label: string }) => React.JSX.Element;
        render(<Loose label="Status" />);
        expect(screen.getByLabelText("amber")).toBeTruthy();
        expect(screen.queryByText("Amber")).toBeNull();
    });

    test("checks the radio for value, and a choice reports through onChange", () => {
        const onChange = vi.fn();
        render(
            <Subject
                label="Status"
                statusLabel={statusLabel}
                value="amber"
                onChange={onChange}
            />,
        );
        const radios = screen.getAllByRole("radio") as HTMLInputElement[];
        expect(radios[1].checked).toBe(true);
        fireEvent.click(radios[0]);
        expect(onChange).toHaveBeenCalledWith("red");
        expect(radios[0].checked).toBe(true);
    });

    test("ArrowRight and ArrowLeft move the selection through the native radio group", async () => {
        const user = userEvent.setup();
        render(
            <Subject
                label="Status"
                statusLabel={statusLabel}
            />,
        );
        const radios = screen.getAllByRole("radio") as HTMLInputElement[];
        await user.click(radios[0]);
        await user.keyboard("{ArrowRight}");
        expect(radios[1].checked).toBe(true);
        expect(document.activeElement).toBe(radios[1]);
        await user.keyboard("{ArrowLeft}");
        expect(radios[0].checked).toBe(true);
    });

    test("disabled disables the group, and attributes pass through", () => {
        render(
            <Subject
                label="Status"
                statusLabel={statusLabel}
                disabled
                data-testid="g"
            />,
        );
        expect((screen.getByTestId("g") as HTMLFieldSetElement).disabled).toBe(true);
    });

    test("a form reset restores the initial value", async () => {
        const { container } = render(
            <form>
                <Subject
                    label="Status"
                    statusLabel={statusLabel}
                    value="amber"
                />
            </form>,
        );
        const form = container.querySelector("form")!;
        fireEvent.click(form.querySelector<HTMLInputElement>('input[value="green"]')!);
        expect(new FormData(form).get("status")).toBe("green");
        await act(async () => {
            form.reset();
            await new Promise((resolve) => setTimeout(resolve, 0));
        });
        expect(new FormData(form).get("status")).toBe("amber");
    });
});
