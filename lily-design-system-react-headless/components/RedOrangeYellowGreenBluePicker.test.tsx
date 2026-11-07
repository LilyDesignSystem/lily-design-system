import { act, fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./RedOrangeYellowGreenBluePicker";

const statusLabel = (status: string) =>
    (
        ({
            red: "Rouge",
            orange: "Orange",
            yellow: "Jaune",
            green: "Vert",
            blue: "Bleu",
        }) as Record<string, string>
    )[status];

describe("RedOrangeYellowGreenBluePicker", () => {
    test("renders a fieldset radiogroup named by label", () => {
        render(
            <Subject
                label="Status"
                statusLabel={statusLabel}
            />,
        );
        const group = screen.getByRole("radiogroup", { name: "Status" });
        expect(group.tagName).toBe("FIELDSET");
        expect(group.classList.contains("red-orange-yellow-green-blue-picker")).toBe(true);
    });

    test("holds one native radio per status, sharing one name", () => {
        render(
            <Subject
                label="Status"
                statusLabel={statusLabel}
            />,
        );
        const radios = screen.getAllByRole("radio") as HTMLInputElement[];
        expect(radios.map((r) => r.value)).toEqual(["red", "orange", "yellow", "green", "blue"]);
        expect(new Set(radios.map((r) => r.name))).toEqual(new Set(["status"]));
    });

    test("statusLabel gives each option its text", () => {
        render(
            <Subject
                label="Status"
                statusLabel={statusLabel}
            />,
        );
        for (const text of ["Rouge", "Orange", "Jaune", "Vert", "Bleu"])
            expect(screen.getByLabelText(text)).toBeTruthy();
    });

    test("without statusLabel an option shows its value, never other English", () => {
        const Loose = Subject as unknown as (props: { label: string }) => React.JSX.Element;
        render(<Loose label="Status" />);
        expect(screen.getByLabelText("orange")).toBeTruthy();
        expect(screen.queryByText("Orange")).toBeNull();
    });

    test("checks the radio for value, and a choice reports through onChange", () => {
        const onChange = vi.fn();
        render(
            <Subject
                label="Status"
                statusLabel={statusLabel}
                value="orange"
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
                    value="orange"
                />
            </form>,
        );
        const form = container.querySelector("form")!;
        fireEvent.click(form.querySelector<HTMLInputElement>('input[value="blue"]')!);
        expect(new FormData(form).get("status")).toBe("blue");
        await act(async () => {
            form.reset();
            await new Promise((resolve) => setTimeout(resolve, 0));
        });
        expect(new FormData(form).get("status")).toBe("orange");
    });
});
