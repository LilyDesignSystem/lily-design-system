import { fireEvent, render } from "@testing-library/svelte";
import fc from "fast-check";
import { createRawSnippet } from "svelte";
import { expect, test } from "vitest";
import Listbox from "../Listbox.svelte";

function options(labels: string[]) {
    return createRawSnippet(() => ({
        render: () => '<div role="presentation"></div>',
        setup(root) {
            labels.forEach((label, i) => {
                const option = document.createElement("div");
                option.id = `opt-${i}`;
                option.setAttribute("role", "option");
                option.textContent = label;
                root.append(option);
            });
        },
    }));
}

test("typing a Unicode initial cycles through matching option ids and wraps", async () => {
    const initial = fc.oneof(
        fc.integer({ min: 0x20000, max: 0x2a6df }).map((n) => String.fromCodePoint(n)),
        fc.integer({ min: 0xac00, max: 0xd7a3 }).map((n) => String.fromCodePoint(n)),
        fc.constantFrom("𠮷", "𐐀", "é", "e\u0301"),
    );
    await fc.assert(
        fc.asyncProperty(initial, fc.integer({ min: 2, max: 5 }), async (key, count) => {
            const labels = Array.from({ length: count }, (_, i) => key.normalize("NFC") + i);
            labels.splice(1, 0, "—");
            const view = render(Listbox, {
                props: {
                    label: "Names",
                    navigation: "active-descendant",
                    typeahead: true,
                    activeIndex: 0,
                    children: options(labels),
                },
            });
            try {
                const listbox = view.getByRole("listbox");
                await fireEvent.keyDown(listbox, { key, isComposing: true });
                expect(listbox.getAttribute("aria-activedescendant")).toBe("opt-0");
                for (let i = 1; i <= count; i++) {
                    await fireEvent.keyDown(listbox, { key });
                    const expected = i === count ? 0 : i + 1;
                    expect(listbox.getAttribute("aria-activedescendant")).toBe(`opt-${expected}`);
                }
            } finally {
                await view.unmount();
            }
        }),
    );
});
