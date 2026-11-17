import { fireEvent, render, screen } from "@testing-library/vue";
import { defineComponent, h, ref } from "vue";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import RepeatableFieldset from "./RepeatableFieldset.vue";

const Host = defineComponent({
    props: { initial: { type: Array, default: () => [] }, min: Number, max: Number },
    setup(props) {
        const items = ref((props.initial as { name: string }[]).map((x) => ({ ...x })));
        return () => [
            h(
                RepeatableFieldset,
                {
                    legend: "Medicines",
                    items: items.value,
                    "onUpdate:items": (next: { name: string }[]) => (items.value = next),
                    newItem: () => ({ name: "" }),
                    itemLegend: (n: number) => `Medicine ${n}`,
                    addLabel: "Add another medicine",
                    removeLabel: (n: number) => `Remove medicine ${n}`,
                    addedLabel: (n: number) => `Medicine ${n} added`,
                    removedLabel: (n: number) => `Medicine ${n} removed`,
                    min: props.min,
                    max: props.max,
                },
                {
                    item: ({ item, index }: { item: { name: string }; index: number }) => [
                        h("label", { for: `medicine-${index}` }, "Name"),
                        h("input", { id: `medicine-${index}`, value: item.name }),
                    ],
                },
            ),
            h("span", { "data-testid": "names" }, items.value.map((x) => x.name).join("|")),
        ];
    },
});

const items = () =>
    [...document.querySelectorAll(".repeatable-fieldset-item")] as HTMLFieldSetElement[];
const legends = () => items().map((el) => el.querySelector("legend")?.textContent);

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("RepeatableFieldset", () => {
    test("add appends an item, renumbers, announces, and moves focus to its first field", async () => {
        render(Host, { props: { initial: [{ name: "Aspirin" }] } });
        await fireEvent.click(screen.getByRole("button", { name: "Add another medicine" }));
        expect(legends()).toEqual(["Medicine 1", "Medicine 2"]);
        expect(document.activeElement).toBe(items()[1].querySelector("input"));
        expect(screen.getByRole("status").textContent?.trim()).toBe("Medicine 2 added");
    });

    test("remove takes out that item, keeps the others, and moves focus to the add button", async () => {
        render(Host, {
            props: { initial: [{ name: "Aspirin" }, { name: "Metformin" }, { name: "Ramipril" }] },
        });
        await fireEvent.click(screen.getByRole("button", { name: "Remove medicine 2" }));
        expect(legends()).toEqual(["Medicine 1", "Medicine 2"]);
        expect(screen.getByTestId("names").textContent).toBe("Aspirin|Ramipril");
        expect(document.activeElement).toBe(
            screen.getByRole("button", { name: "Add another medicine" }),
        );
    });

    test("min leaves out the remove buttons; max disables the add button", () => {
        render(Host, { props: { initial: [{ name: "Aspirin" }], min: 1, max: 1 } });
        expect(screen.queryByRole("button", { name: /Remove/ })).toBeNull();
        expect(
            (screen.getByRole("button", { name: "Add another medicine" }) as HTMLButtonElement)
                .disabled,
        ).toBe(true);
    });
});
