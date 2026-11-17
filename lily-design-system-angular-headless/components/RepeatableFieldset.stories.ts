import type { Meta, StoryObj } from "@storybook/angular";
import { RepeatableFieldset } from "./RepeatableFieldset";

const meta: Meta<RepeatableFieldset> = {
    title: "Headless/RepeatableFieldset",
    component: RepeatableFieldset,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<RepeatableFieldset>;

// The item's fields are a render function, a slot or a template, so the default story renders the component's
// structure with one item; see components/repeatable-fieldset/index.md for a full example.
export const Default: Story = {
    args: {
        legend: "Medicines",
        items: [{ name: "Aspirin" }],
        newItem: () => ({ name: "" }),
        itemLegend: (n: number) => `Medicine ${n}`,
        addLabel: "Add another medicine",
        removeLabel: (n: number) => `Remove medicine ${n}`,
    } as never,
};
