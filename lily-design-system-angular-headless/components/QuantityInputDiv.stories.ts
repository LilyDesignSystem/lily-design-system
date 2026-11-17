import type { Meta, StoryObj } from "@storybook/angular";
import { QuantityInputDiv } from "./QuantityInputDiv";

const meta: Meta<QuantityInputDiv> = {
    title: "Headless/QuantityInputDiv",
    component: QuantityInputDiv,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<QuantityInputDiv>;

export const Default: Story = {
    args: {
        label: "Weight",
        magnitudeLabel: "Amount",
        unitLabel: "Unit",
        name: "weight",
        units: [
            { value: "kg", label: "kilograms", min: 0, max: 300, step: 0.1 },
            { value: "[lb_av]", label: "pounds", min: 0, max: 660, step: 0.1 },
        ],
    },
};
