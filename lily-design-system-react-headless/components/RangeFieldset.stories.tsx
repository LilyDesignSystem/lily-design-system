import type { Meta, StoryObj } from "@storybook/react-vite";
import RangeFieldset from "./RangeFieldset";

const meta = {
    title: "Headless/RangeFieldset",
    component: RangeFieldset,
    tags: ["autodocs"],
} satisfies Meta<typeof RangeFieldset>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        legend: "Price",
        minimumLabel: "Lowest price",
        maximumLabel: "Highest price",
        minimum: 20,
        maximum: 80,
        minimumName: "price-min",
        maximumName: "price-max",
    },
};
