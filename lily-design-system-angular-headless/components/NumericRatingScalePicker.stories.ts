import type { Meta, StoryObj } from "@storybook/angular";
import { NumericRatingScalePicker } from "./NumericRatingScalePicker";

const meta: Meta<NumericRatingScalePicker> = {
    title: "Headless/NumericRatingScalePicker",
    component: NumericRatingScalePicker,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<NumericRatingScalePicker>;

export const Default: Story = {
    args: {
        label: "How bad is your pain now?",
        minLabel: "No pain",
        maxLabel: "Worst pain imaginable",
    },
};
