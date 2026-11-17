import type { Meta, StoryObj } from "@storybook/react-vite";
import QuantityInputDiv from "./QuantityInputDiv";

const meta = {
    title: "Headless/QuantityInputDiv",
    component: QuantityInputDiv,
    tags: ["autodocs"],
} satisfies Meta<typeof QuantityInputDiv>;

export default meta;
type Story = StoryObj<typeof meta>;

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
