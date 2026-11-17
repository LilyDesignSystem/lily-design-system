import { fireEvent, render, screen } from "./test-utils";
import { createSignal } from "solid-js";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import RepeatableFieldset from "./RepeatableFieldset";

type Medicine = { id: number; name: string };
let nextId = 100;

function Host({ initial, min, max }: { initial: Medicine[]; min?: number; max?: number }) {
    const [items, setItems] = createSignal(initial);
    return (
        <>
            <RepeatableFieldset<Medicine>
                legend="Medicines"
                items={items()}
                onItemsChange={setItems}
                newItem={() => ({ id: nextId++, name: "" })}
                itemKey={(item) => item.id}
                itemLegend={(n) => `Medicine ${n}`}
                addLabel="Add another medicine"
                removeLabel={(n) => `Remove medicine ${n}`}
                addedLabel={(n) => `Medicine ${n} added`}
                removedLabel={(n) => `Medicine ${n} removed`}
                min={min}
                max={max}
                renderItem={(item, index) => (
                    <>
                        <label for={`medicine-${item.id}`}>Name</label>
                        <input
                            id={`medicine-${item.id}`}
                            value={item.name}
                            onInput={(event) =>
                                setItems(
                                    items().map((x, i) =>
                                        i === index ? { ...x, name: event.currentTarget.value } : x,
                                    ),
                                )
                            }
                        />
                    </>
                )}
            />
            <span data-testid="names">
                {items()
                    .map((x) => x.name)
                    .join("|")}
            </span>
        </>
    );
}

const items = () =>
    [...document.querySelectorAll(".repeatable-fieldset-item")] as HTMLFieldSetElement[];
const legends = () => items().map((el) => el.querySelector("legend")?.textContent);

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("RepeatableFieldset", () => {
    test("add appends an item, renumbers, announces, and moves focus to its first field", () => {
        render(() => <Host initial={[{ id: 1, name: "Aspirin" }]} />);
        fireEvent.click(screen.getByRole("button", { name: "Add another medicine" }));
        expect(legends()).toEqual(["Medicine 1", "Medicine 2"]);
        expect(document.activeElement).toBe(items()[1].querySelector("input"));
        expect(screen.getByRole("status").textContent).toBe("Medicine 2 added");
    });

    test("remove takes out that item, keeps the others, and moves focus to the add button", () => {
        render(() => (
            <Host
                initial={[
                    { id: 1, name: "Aspirin" },
                    { id: 2, name: "Metformin" },
                    { id: 3, name: "Ramipril" },
                ]}
            />
        ));
        fireEvent.click(screen.getByRole("button", { name: "Remove medicine 2" }));
        expect(legends()).toEqual(["Medicine 1", "Medicine 2"]);
        expect(screen.getByTestId("names").textContent).toBe("Aspirin|Ramipril");
        expect(document.activeElement).toBe(
            screen.getByRole("button", { name: "Add another medicine" }),
        );
    });

    test("min leaves out the remove buttons; max disables the add button", () => {
        render(() => (
            <Host
                initial={[{ id: 1, name: "Aspirin" }]}
                min={1}
                max={1}
            />
        ));
        expect(screen.queryByRole("button", { name: /Remove/ })).toBeNull();
        expect(
            (screen.getByRole("button", { name: "Add another medicine" }) as HTMLButtonElement)
                .disabled,
        ).toBe(true);
    });
});
