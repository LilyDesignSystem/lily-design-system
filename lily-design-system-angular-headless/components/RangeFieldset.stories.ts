import type { Meta, StoryObj } from "@storybook/angular";
import { RangeFieldset } from "./RangeFieldset";

const meta: Meta<RangeFieldset> = {
    title: "Headless/RangeFieldset",
    component: RangeFieldset,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<RangeFieldset>;

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
