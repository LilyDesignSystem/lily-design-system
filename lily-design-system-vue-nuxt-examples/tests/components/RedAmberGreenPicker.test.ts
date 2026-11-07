import { fireEvent, render, screen } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "../../components/RedAmberGreenPicker.vue";

const statusLabel = (status: string) =>
    (({ red: "Rouge", amber: "Ambre", green: "Vert" }) as Record<string, string>)[status];

describe("RedAmberGreenPicker", () => {
    test("renders a fieldset radiogroup named by label", () => {
        render(Subject, { props: { label: "Status", statusLabel } });
        const group = screen.getByRole("radiogroup", { name: "Status" });
        expect(group.tagName).toBe("FIELDSET");
        expect(group.classList.contains("red-amber-green-picker")).toBe(true);
    });

    test("holds one native radio per status, sharing one name", () => {
        render(Subject, { props: { label: "Status", statusLabel } });
        const radios = screen.getAllByRole("radio") as HTMLInputElement[];
        expect(radios.map((r) => r.value)).toEqual(["red", "amber", "green"]);
        expect(new Set(radios.map((r) => r.name))).toEqual(new Set(["status"]));
    });

    test("statusLabel gives each option its text", () => {
        render(Subject, { props: { label: "Status", statusLabel } });
        for (const text of ["Rouge", "Ambre", "Vert"])
            expect(screen.getByLabelText(text)).toBeTruthy();
    });

    test("without statusLabel an option shows its value, never other English", () => {
        render(Subject, { props: { label: "Status" } as never });
        expect(screen.getByLabelText("amber")).toBeTruthy();
        expect(screen.queryByText("Amber")).toBeNull();
    });

    test("checks the radio for the model value, and a choice updates it", async () => {
        const { emitted } = render(Subject, {
            props: { label: "Status", statusLabel, modelValue: "amber" },
        });
        const radios = screen.getAllByRole("radio") as HTMLInputElement[];
        expect(radios[1].checked).toBe(true);
        await fireEvent.click(radios[0]);
        expect(emitted()["update:modelValue"]?.[0]).toEqual(["red"]);
    });

    test("ArrowRight and ArrowLeft move the selection through the native radio group", async () => {
        const user = userEvent.setup();
        render(Subject, { props: { label: "Status", statusLabel } });
        const radios = screen.getAllByRole("radio") as HTMLInputElement[];
        await user.click(radios[0]);
        await user.keyboard("{ArrowRight}");
        expect(radios[1].checked).toBe(true);
        expect(document.activeElement).toBe(radios[1]);
        await user.keyboard("{ArrowLeft}");
        expect(radios[0].checked).toBe(true);
    });

    test("disabled disables the group, and attributes pass through", () => {
        render(Subject, {
            props: { label: "Status", statusLabel, disabled: true },
            attrs: { "data-testid": "g" },
        });
        expect((screen.getByTestId("g") as HTMLFieldSetElement).disabled).toBe(true);
    });
});
