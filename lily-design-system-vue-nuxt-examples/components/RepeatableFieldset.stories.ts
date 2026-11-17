import type { Meta, StoryObj } from "@storybook/vue3-vite";
import RepeatableFieldset from "./RepeatableFieldset.vue";

const meta = {
    title: "Headless/RepeatableFieldset",
    component: RepeatableFieldset,
    tags: ["autodocs"],
} satisfies Meta<typeof RepeatableFieldset>;

export default meta;
type Story = StoryObj<typeof meta>;

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
